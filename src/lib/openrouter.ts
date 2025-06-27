import { OPENROUTER_API_KEY } from '../utils/env';
import type { OpenRouterModelsResponse, OpenRouterModel } from '../types/openrouter';

/**
 * Fetches available models from the OpenRouter API
 * @returns Promise<OpenRouterModel[]> Array of available models
 * @throws Error if the API request fails or returns invalid data
 */
export async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API request failed: ${response.status} ${response.statusText}`);
    }

    const result: OpenRouterModelsResponse = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch OpenRouter models: ${error.message}`);
    }
    throw new Error('Failed to fetch OpenRouter models: Unknown error');
  }
}

/**
 * Filters models to only include those that are free (have 'free' in the name)
 * @param models Array of OpenRouter models
 * @returns Array of free models
 */
export function filterFreeModels(models: OpenRouterModel[]): OpenRouterModel[] {
  return models.filter(model => 
    model.name.toLowerCase().includes('free') || 
    model.id.toLowerCase().includes('free')
  );
}

/**
 * Filters models to only include premium models (excluding free models)
 * @param models Array of OpenRouter models
 * @returns Array of premium models
 */
export function filterPremiumModels(models: OpenRouterModel[]): OpenRouterModel[] {
  return models.filter(model => 
    !model.name.toLowerCase().includes('free') && 
    !model.id.toLowerCase().includes('free')
  );
}

/**
 * Converts OpenRouter pricing strings to numbers
 * @param priceString String representation of price
 * @returns Number representation of price
 */
export function parsePricing(priceString: string): number {
  return parseFloat(priceString) || 0;
}

/**
 * Checks if a model is available based on user subscription
 * @param model OpenRouter model
 * @param userSubscription User's subscription tier
 * @returns Boolean indicating if model is available
 */
export function isModelAvailable(
  model: OpenRouterModel, 
  userSubscription: 'free' | 'premium'
): boolean {
  const isFreeModel = model.name.toLowerCase().includes('free') || 
                     model.id.toLowerCase().includes('free');
  
  if (isFreeModel) {
    return true; // Free models available to all users
  }
  
  return userSubscription === 'premium'; // Premium models only for premium users
}

/**
 * Gets a display-friendly model name by cleaning up the OpenRouter model name
 * @param model OpenRouter model
 * @returns Cleaned model name
 */
export function getDisplayName(model: OpenRouterModel): string {
  // Remove common prefixes and clean up the name
  let name = model.name;
  
  // Remove provider prefixes like "OpenAI: " or "Anthropic: "
  name = name.replace(/^[^:]+:\s*/, '');
  
  // Remove version numbers in parentheses if they exist
  name = name.replace(/\s*\([^)]*\)$/, '');
  
  return name.trim();
}

/**
 * Categorizes models by provider or type
 * @param models Array of OpenRouter models
 * @returns Object with categorized models
 */
export function categorizeModels(models: OpenRouterModel[]): Record<string, OpenRouterModel[]> {
  const categories: Record<string, OpenRouterModel[]> = {};
  
  models.forEach(model => {
    // Extract provider from model name or ID
    let provider = 'Other';
    
    if (model.name.toLowerCase().includes('gpt') || model.id.includes('openai')) {
      provider = 'OpenAI';
    } else if (model.name.toLowerCase().includes('claude') || model.id.includes('anthropic')) {
      provider = 'Anthropic';
    } else if (model.name.toLowerCase().includes('llama') || model.id.includes('meta')) {
      provider = 'Meta';
    } else if (model.name.toLowerCase().includes('gemini') || model.id.includes('google')) {
      provider = 'Google';
    }
    
    if (!categories[provider]) {
      categories[provider] = [];
    }
    
    categories[provider].push(model);
  });
  
  return categories;
}