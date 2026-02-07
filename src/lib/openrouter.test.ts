import { describe, it, expect } from 'vitest';
import { filterFreeModels, filterPremiumModels, parsePricing, isModelAvailable, getProviderName } from './openrouter';
import type { OpenRouterModel } from '../types/openrouter';

describe('OpenRouter Utility Functions', () => {
  // Sample test data
  const mockModels: OpenRouterModel[] = [
    {
      id: 'free-model-1',
      name: 'Free Model 1',
      description: 'A free AI model',
      created: 1600000000,
      context_length: 4096,
      architecture: {
        input_modalities: ['text'],
        output_modalities: ['text'],
        tokenizer: 'GPT-3.5'
      },
      top_provider: {
        is_moderated: true
      },
      pricing: {
        prompt: '0.000001',
        completion: '0.000001',
        image: '0',
        request: '0',
        web_search: '0',
        internal_reasoning: '0'
      },
      canonical_slug: 'free-model-1',
      hugging_face_id: 'free-model-1',
      per_request_limits: {},
      supported_parameters: []
    },
    {
      id: 'premium-model-1',
      name: 'Premium Model',
      description: 'A premium AI model',
      created: 1600000000,
      context_length: 8192,
      architecture: {
        input_modalities: ['text', 'image'],
        output_modalities: ['text'],
        tokenizer: 'GPT-4'
      },
      top_provider: {
        is_moderated: true
      },
      pricing: {
        prompt: '0.00001',
        completion: '0.00001',
        image: '0',
        request: '0',
        web_search: '0',
        internal_reasoning: '0'
      },
      canonical_slug: 'premium-model-1',
      hugging_face_id: 'premium-model-1',
      per_request_limits: {},
      supported_parameters: []
    },
    {
      id: 'openai/gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'OpenAI GPT-3.5 Turbo',
      created: 1600000000,
      context_length: 4096,
      architecture: {
        input_modalities: ['text'],
        output_modalities: ['text'],
        tokenizer: 'GPT-3.5'
      },
      top_provider: {
        is_moderated: true
      },
      pricing: {
        prompt: '0.0000015',
        completion: '0.000002',
        image: '0',
        request: '0',
        web_search: '0',
        internal_reasoning: '0'
      },
      canonical_slug: 'openai/gpt-3.5-turbo',
      hugging_face_id: 'openai/gpt-3.5-turbo',
      per_request_limits: {},
      supported_parameters: []
    },
    {
      id: 'anthropic/claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      description: 'Anthropic Claude 3 Sonnet',
      created: 1600000000,
      context_length: 8192,
      architecture: {
        input_modalities: ['text', 'image'],
        output_modalities: ['text'],
        tokenizer: 'Claude 3'
      },
      top_provider: {
        is_moderated: true
      },
      pricing: {
        prompt: '0.00001',
        completion: '0.00001',
        image: '0',
        request: '0',
        web_search: '0',
        internal_reasoning: '0'
      },
      canonical_slug: 'anthropic/claude-3-sonnet',
      hugging_face_id: 'anthropic/claude-3-sonnet',
      per_request_limits: {},
      supported_parameters: []
    }
  ];

  describe('filterFreeModels', () => {
    it('returns only models with free in name or id', () => {
      const freeModels = filterFreeModels(mockModels);
      expect(freeModels.length).toBe(1);
      expect(freeModels[0].id).toBe('free-model-1');
      expect(freeModels[0].name).toBe('Free Model 1');
    });

    it('returns empty array when no free models', () => {
      const noFreeModels = mockModels.filter(model => !model.name.toLowerCase().includes('free') && !model.id.toLowerCase().includes('free'));
      const result = filterFreeModels(noFreeModels);
      expect(result.length).toBe(0);
    });
  });

  describe('filterPremiumModels', () => {
    it('returns models without free in name or id', () => {
      const premiumModels = filterPremiumModels(mockModels);
      expect(premiumModels.length).toBe(3);
      expect(premiumModels.every(model => !model.name.toLowerCase().includes('free') && !model.id.toLowerCase().includes('free'))).toBe(true);
    });

    it('returns empty array when all models are free', () => {
      const allFreeModels = mockModels.filter(model => model.name.toLowerCase().includes('free') || model.id.toLowerCase().includes('free'));
      const result = filterPremiumModels(allFreeModels);
      expect(result.length).toBe(0);
    });
  });

  describe('parsePricing', () => {
    it('parses valid price strings', () => {
      expect(parsePricing('0.000001')).toBe(0.000001);
      expect(parsePricing('0.00001')).toBe(0.00001);
      expect(parsePricing('1.5')).toBe(1.5);
    });

    it('returns 0 for invalid price strings', () => {
      expect(parsePricing('invalid')).toBe(0);
      expect(parsePricing('')).toBe(0);
      expect(parsePricing('abc123')).toBe(0);
    });
  });

  describe('isModelAvailable', () => {
    it('returns true for free models in free tier', () => {
      const freeModel = mockModels[0];
      expect(isModelAvailable(freeModel, 'free')).toBe(true);
    });

    it('returns false for premium models in free tier', () => {
      const premiumModel = mockModels[1];
      expect(isModelAvailable(premiumModel, 'free')).toBe(false);
    });

    it('returns true for all models in premium tier', () => {
      mockModels.forEach(model => {
        expect(isModelAvailable(model, 'premium')).toBe(true);
      });
    });
  });

  describe('getProviderName', () => {
    it('extracts provider from model id', () => {
      expect(getProviderName(mockModels[2])).toBe('OpenAI');
      expect(getProviderName(mockModels[3])).toBe('Anthropic');
    });

    it('returns model id if no provider is present', () => {
      const modelWithoutProvider = { ...mockModels[0], id: 'model-without-provider' };
      expect(getProviderName(modelWithoutProvider)).toBe('Unknown Provider');
    });
  });
});
