// OpenRouter API response types
export interface OpenRouterArchitecture {
  input_modalities: string[];
  output_modalities: string[];
  tokenizer: string;
}

export interface OpenRouterTopProvider {
  is_moderated: boolean;
}

export interface OpenRouterPricing {
  prompt: string;
  completion: string;
  image: string;
  request: string;
  web_search: string;
  internal_reasoning: string;
}

export interface OpenRouterPerRequestLimits {
  [key: string]: any;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  created: number;
  description: string;
  architecture: OpenRouterArchitecture;
  top_provider: OpenRouterTopProvider;
  pricing: OpenRouterPricing;
  canonical_slug: string;
  context_length: number;
  hugging_face_id: string;
  per_request_limits: OpenRouterPerRequestLimits;
  supported_parameters: string[];
}

export interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

// Processed AI model types for our application
export interface AIModel {
  id: string;
  name: string;
  description: string;
  minSubscription: 'free' | 'premium';
  icon: string; // Phosphor icon name
  color: string; // Tailwind gradient classes
  features: string[];
  contextLength?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

export type AIModelConfig = Record<string, AIModel>;

// Helper type for model subscription requirements
export type SubscriptionTier = 'free' | 'premium';

// Type for model categories
export interface ModelCategory {
  name: string;
  description: string;
  models: AIModel[];
}