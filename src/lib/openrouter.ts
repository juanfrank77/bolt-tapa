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
 * Extracts the provider name from an OpenRouter model ID
 * @param model OpenRouter model
 * @returns Provider name (e.g., "OpenAI", "Anthropic", etc.)
 */
export function getProviderName(model: OpenRouterModel): string {
  // Extract provider from the model ID (first part before '/')
  const parts = model.id.split('/');
  if (parts.length > 1) {
    const provider = parts[0];
    
    // Capitalize and format common provider names
    switch (provider.toLowerCase()) {
      case 'openai':
        return 'OpenAI';
      case 'anthropic':
        return 'Anthropic';
      case 'meta-llama':
      case 'meta':
        return 'Meta';
      case 'google':
        return 'Google';
      case 'mistralai':
        return 'Mistral AI';
      case 'deepseek':
        return 'DeepSeek';
      case 'qwen':
        return 'Qwen';
      case 'microsoft':
        return 'Microsoft';
      default:
        // Capitalize first letter of provider name
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  }
  
  return 'Unknown Provider';
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

// Chat completion types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SendMessageResult {
  content: string;
  tokensUsed: number;
  responseTime: number;
}

/**
 * Sends a message to the specified model via OpenRouter API
 * @param modelId The OpenRouter model ID to use
 * @param messages Array of chat messages for context
 * @returns Promise<SendMessageResult> The AI response with metadata
 * @throws Error if the API request fails
 */
export async function sendMessageToModel(
  modelId: string,
  messages: ChatMessage[]
): Promise<SendMessageResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result: ChatCompletionResponse = await response.json();
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Extract the AI's response
    const aiMessage = result.choices?.[0]?.message?.content;
    if (!aiMessage) {
      throw new Error('No response content received from the model');
    }

    // Extract token usage
    const tokensUsed = result.usage?.total_tokens || 0;

    return {
      content: aiMessage,
      tokensUsed,
      responseTime,
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (error instanceof Error) {
      throw new Error(`Failed to send message to model: ${error.message}`);
    }
    throw new Error('Failed to send message to model: Unknown error');
  }
}