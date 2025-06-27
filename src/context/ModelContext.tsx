import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchOpenRouterModels, filterFreeModels, filterPremiumModels, categorizeModels } from '../lib/openrouter';
import { useAuth, isGuestUser } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useDatabase';
import type { OpenRouterModel } from '../types/openrouter';

interface ModelContextType {
  // Model data
  allModels: OpenRouterModel[];
  freeModels: OpenRouterModel[];
  premiumModels: OpenRouterModel[];
  categorizedModels: Record<string, OpenRouterModel[]>;
  
  // Available models based on user subscription
  availableModels: OpenRouterModel[];
  
  // Selected model
  selectedModel: OpenRouterModel | null;
  setSelectedModel: (model: OpenRouterModel | null) => void;
  
  // Loading and error states
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshModels: () => Promise<void>;
  isModelAvailable: (model: OpenRouterModel) => boolean;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

interface ModelProviderProps {
  children: ReactNode;
}

export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  
  // Model data state
  const [allModels, setAllModels] = useState<OpenRouterModel[]>([]);
  const [freeModels, setFreeModels] = useState<OpenRouterModel[]>([]);
  const [premiumModels, setPremiumModels] = useState<OpenRouterModel[]>([]);
  const [categorizedModels, setCategorizedModels] = useState<Record<string, OpenRouterModel[]>>({});
  
  // UI state
  const [selectedModel, setSelectedModel] = useState<OpenRouterModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's subscription tier
  const userSubscription = React.useMemo(() => {
    if (!user || isGuestUser(user)) return 'free';
    return profile?.subscription_status || 'free';
  }, [user, profile]);

  // Calculate available models based on subscription
  const availableModels = React.useMemo(() => {
    if (userSubscription === 'premium') {
      return allModels; // Premium users get all models
    }
    return freeModels; // Free users only get free models
  }, [allModels, freeModels, userSubscription]);

  // Check if a specific model is available to the current user
  const isModelAvailable = React.useCallback((model: OpenRouterModel): boolean => {
    if (userSubscription === 'premium') {
      return true; // Premium users can access all models
    }
    
    // Check if it's a free model
    const isFreeModel = model.name.toLowerCase().includes('free') || 
                       model.id.toLowerCase().includes('free') ||
                       freeModels.some(freeModel => freeModel.id === model.id);
    
    return isFreeModel;
  }, [userSubscription, freeModels]);

  // Fetch models from OpenRouter API
  const refreshModels = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const models = await fetchOpenRouterModels();
      
      // Process the models
      const free = filterFreeModels(models);
      const premium = filterPremiumModels(models);
      const categorized = categorizeModels(models);
      
      // Update state
      setAllModels(models);
      setFreeModels(free);
      setPremiumModels(premium);
      setCategorizedModels(categorized);
      
      // If no model is selected and we have available models, select the first one
      if (!selectedModel && models.length > 0) {
        const firstAvailable = userSubscription === 'premium' ? models[0] : free[0];
        if (firstAvailable) {
          setSelectedModel(firstAvailable);
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch models';
      setError(errorMessage);
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedModel, userSubscription]);

  // Initial load of models
  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  // Update selected model when subscription changes
  useEffect(() => {
    if (selectedModel && !isModelAvailable(selectedModel)) {
      // Current model is no longer available, select first available model
      const firstAvailable = availableModels[0];
      setSelectedModel(firstAvailable || null);
    }
  }, [selectedModel, availableModels, isModelAvailable]);

  const contextValue: ModelContextType = {
    // Model data
    allModels,
    freeModels,
    premiumModels,
    categorizedModels,
    availableModels,
    
    // Selected model
    selectedModel,
    setSelectedModel,
    
    // Loading and error states
    loading,
    error,
    
    // Actions
    refreshModels,
    isModelAvailable,
  };

  return (
    <ModelContext.Provider value={contextValue}>
      {children}
    </ModelContext.Provider>
  );
};

// Custom hook to use the Model Context
export const useModels = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModels must be used within a ModelProvider');
  }
  return context;
};

// Helper hook to get just the selected model
export const useSelectedModel = () => {
  const { selectedModel, setSelectedModel } = useModels();
  return { selectedModel, setSelectedModel };
};

// Helper hook to check model availability
export const useModelAvailability = (model: OpenRouterModel | null) => {
  const { isModelAvailable } = useModels();
  return model ? isModelAvailable(model) : false;
};

export default ModelContext;