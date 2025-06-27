// AI Model configurations
export const AI_MODEL_CONFIG = {
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    icon: 'ChatCircle',
    color: 'from-green-500 to-emerald-600',
    avatar: 'bg-gradient-to-r from-green-500 to-emerald-600'
  },
  'claude-3.5-haiku': {
    name: 'Claude 3.5 Haiku',
    icon: 'Lightning',
    color: 'from-blue-500 to-cyan-600',
    avatar: 'bg-gradient-to-r from-blue-500 to-cyan-600'
  },
  'gpt-4o': {
    name: 'GPT-4o',
    icon: 'Brain',
    color: 'from-purple-500 to-violet-600',
    avatar: 'bg-gradient-to-r from-purple-500 to-violet-600'
  },
  'claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    icon: 'Star',
    color: 'from-orange-500 to-amber-600',
    avatar: 'bg-gradient-to-r from-orange-500 to-amber-600'
  },
  'gpt-4.1': {
    name: 'GPT-4.1',
    icon: 'Crown',
    color: 'from-gray-700 to-gray-900',
    avatar: 'bg-gradient-to-r from-gray-700 to-gray-900'
  },
  'claude-3-opus': {
    name: 'Claude 3 Opus',
    icon: 'Crown',
    color: 'from-indigo-600 to-purple-700',
    avatar: 'bg-gradient-to-r from-indigo-600 to-purple-700'
  }
};

export const AI_MODELS = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient conversational AI perfect for everyday tasks and quick responses.',
    minSubscription: 'free' as const,
    icon: 'ChatCircle',
    color: 'from-green-500 to-emerald-600',
    features: ['Fast responses', 'General knowledge', 'Code assistance']
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Anthropic\'s fastest model, great for simple tasks and quick interactions.',
    minSubscription: 'free' as const,
    icon: 'Lightning',
    color: 'from-blue-500 to-cyan-600',
    features: ['Lightning fast', 'Concise answers', 'Task-focused']
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Advanced reasoning and complex problem-solving capabilities for professional use.',
    minSubscription: 'premium' as const,
    icon: 'Brain',
    color: 'from-purple-500 to-violet-600',
    features: ['Advanced reasoning', 'Complex tasks', 'High accuracy']
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Balanced performance for a wide range of tasks with excellent reasoning.',
    minSubscription: 'premium' as const,
    icon: 'Star',
    color: 'from-orange-500 to-amber-600',
    features: ['Balanced performance', 'Creative writing', 'Analysis']
  },
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    description: 'The most advanced model with enhanced capabilities and latest knowledge.',
    minSubscription: 'premium' as const,
    icon: 'Crown',
    color: 'from-gray-700 to-gray-900',
    features: ['Latest knowledge', 'Enhanced capabilities', 'Premium support']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most powerful model for the most complex and nuanced tasks.',
    minSubscription: 'premium' as const,
    icon: 'Crown',
    color: 'from-indigo-600 to-purple-700',
    features: ['Maximum capability', 'Complex reasoning', 'Advanced features']
  }
];