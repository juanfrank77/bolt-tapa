import React, { useState } from 'react';
import { useAuth, isGuestUser } from '../hooks/useAuth';
import { useUserProfile, useModelAccess } from '../hooks/useDatabase';
import { 
  Brain, 
  SignOut, 
  User, 
  Sparkle, 
  Crown, 
  Lightning, 
  ChatCircle,
  Lock,
  CheckCircle,
  Star
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Define available AI models
const AI_MODELS = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient conversational AI perfect for everyday tasks and quick responses.',
    minSubscription: 'free' as const,
    icon: ChatCircle,
    color: 'from-green-500 to-emerald-600',
    features: ['Fast responses', 'General knowledge', 'Code assistance']
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Anthropic\'s fastest model, great for simple tasks and quick interactions.',
    minSubscription: 'free' as const,
    icon: Lightning,
    color: 'from-blue-500 to-cyan-600',
    features: ['Lightning fast', 'Concise answers', 'Task-focused']
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Advanced reasoning and complex problem-solving capabilities for professional use.',
    minSubscription: 'premium' as const,
    icon: Brain,
    color: 'from-purple-500 to-violet-600',
    features: ['Advanced reasoning', 'Complex tasks', 'High accuracy']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance for a wide range of tasks with excellent reasoning.',
    minSubscription: 'premium' as const,
    icon: Star,
    color: 'from-orange-500 to-amber-600',
    features: ['Balanced performance', 'Creative writing', 'Analysis']
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'The most advanced model with enhanced capabilities and latest knowledge.',
    minSubscription: 'enterprise' as const,
    icon: Crown,
    color: 'from-gray-700 to-gray-900',
    features: ['Latest knowledge', 'Enhanced capabilities', 'Premium support']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most powerful model for the most complex and nuanced tasks.',
    minSubscription: 'enterprise' as const,
    icon: Crown,
    color: 'from-indigo-600 to-purple-700',
    features: ['Maximum capability', 'Complex reasoning', 'Enterprise features']
  }
];

const ModelCard: React.FC<{
  model: typeof AI_MODELS[0];
  userSubscription: string;
  hasAccess: boolean;
  loading: boolean;
  isGuest: boolean;
  onSelectModel: (modelId: string) => void;
}> = ({ model, userSubscription, hasAccess, loading, isGuest, onSelectModel }) => {
  const IconComponent = model.icon;
  const isAccessible = hasAccess;
  const needsUpgrade = !isAccessible && model.minSubscription !== 'free';

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'free':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Free</span>;
      case 'premium':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Premium</span>;
      case 'enterprise':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Enterprise</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 ${
      isAccessible 
        ? 'border-transparent hover:border-blue-200 hover:shadow-xl transform hover:-translate-y-1' 
        : 'border-gray-200 opacity-75'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${model.color} rounded-xl flex items-center justify-center`}>
          <IconComponent className="w-6 h-6 text-white" weight="bold" />
        </div>
        {getSubscriptionBadge(model.minSubscription)}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{model.name}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{model.description}</p>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {model.features.map((feature, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" weight="fill" />
              {feature}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <button disabled className="w-full bg-gray-200 text-gray-500 px-4 py-3 rounded-lg font-medium cursor-not-allowed">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
            Checking access...
          </div>
        </button>
      ) : isAccessible ? (
        <button
          onClick={() => onSelectModel(model.id)}
          className={`w-full bg-gradient-to-r ${model.color} text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center`}
        >
          <ChatCircle className="w-4 h-4 mr-2" weight="bold" />
          {isGuest ? 'Try as Guest' : 'Start Chatting'}
        </button>
      ) : needsUpgrade ? (
        <button className="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center">
          <Lock className="w-4 h-4 mr-2" />
          {isGuest ? 'Sign up for access' : `Upgrade to ${model.minSubscription} required`}
        </button>
      ) : (
        <button className="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-lg font-medium cursor-not-allowed">
          Access Denied
        </button>
      )}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const navigate = useNavigate();
  const isGuest = user ? isGuestUser(user) : false;

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    navigate(`/chat/${modelId}`);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/src/assets/tapa-icon.png" 
                alt="TAPA Logo" 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TAPA
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">
                  {isGuest ? 'Guest' : (profile?.full_name || user?.email)}
                </span>
                {!isGuest && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile?.subscription_status === 'premium' 
                    ? 'bg-purple-100 text-purple-800'
                    : profile?.subscription_status === 'enterprise'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {profile?.subscription_status || 'free'}
                </span>
                )}
              </div>
              {isGuest ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SignOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
            <Sparkle className="w-4 h-4 mr-2" weight="fill" />
            {isGuest ? 'Welcome to TAPA' : 'Welcome to your AI Dashboard'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hello, {isGuest ? 'Guest' : (profile?.full_name?.split(' ')[0] || 'there')}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isGuest 
              ? 'Explore our AI models as a guest. Sign up to unlock your full potential and save your conversations.'
              : 'Choose from our selection of AI models and start your conversation. Each model has unique strengths and capabilities.'
            }
          </p>
        </div>

        {/* Guest Notice */}
        {isGuest && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">You're browsing as a guest</h3>
                  <p className="text-blue-700">Sign up to save conversations, access premium models, and track your usage.</p>
                </div>
              </div>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}

        {/* AI Models Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Available AI Models</h2>
            {!isGuest && (
            <div className="text-sm text-gray-600">
              Your plan: <span className="font-medium capitalize">{profile?.subscription_status || 'free'}</span>
            </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_MODELS.map((model) => {
              const ModelAccessWrapper: React.FC = () => {
                const { hasAccess, loading } = useModelAccess(model.id);
                return (
                  <ModelCard
                    key={model.id}
                    model={model}
                    userSubscription={profile?.subscription_status || 'free'}
                    hasAccess={hasAccess}
                    loading={loading}
                    isGuest={isGuest}
                    onSelectModel={handleSelectModel}
                  />
                );
              };
              return <ModelAccessWrapper key={model.id} />;
            })}
          </div>
        </div>

        {/* Quick Stats */}
        {!isGuest && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {AI_MODELS.filter(m => m.minSubscription === 'free').length}
              </div>
              <div className="text-sm text-gray-600">Free Models Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {profile?.subscription_status === 'premium' || profile?.subscription_status === 'enterprise' 
                  ? AI_MODELS.filter(m => m.minSubscription === 'premium' || m.minSubscription === 'free').length
                  : AI_MODELS.filter(m => m.minSubscription === 'free').length}
              </div>
              <div className="text-sm text-gray-600">Models You Can Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Conversations Today</div>
            </div>
          </div>
        </div>
        )}

        {/* Upgrade CTA for Free Users */}
        {(isGuest || profile?.subscription_status === 'free') && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <Crown className="w-12 h-12 mx-auto mb-4" weight="bold" />
            <h3 className="text-2xl font-bold mb-4">
              {isGuest ? 'Sign Up to Unlock More' : 'Unlock Premium AI Models'}
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              {isGuest 
                ? 'Create an account to save your conversations, access premium models, and unlock the full potential of TAPA.'
                : 'Upgrade to Premium and get access to GPT-4, Claude 3 Sonnet, and other advanced models with enhanced capabilities.'
              }
            </p>
            {isGuest ? (
              <Link
                to="/signup"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign Up Free
              </Link>
            ) : (
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Upgrade to Premium
            </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;