import React, { useState } from 'react';
import { useAuth, isGuestUser } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useDatabase';
import { useModels } from '../context/ModelContext';
import { initiateCreemCheckout } from '../lib/creem';
import { Header, Button, MascotGuide } from '../components';
import { Link } from 'react-router';
import { 
  Brain, 
  User, 
  Sparkle, 
  Crown, 
  ChatCircle
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { availableModels, loading: modelsLoading, error: modelsError } = useModels();
  const [isMascotMinimized, setIsMascotMinimized] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const navigate = useNavigate();
  const isGuest = user ? isGuestUser(user) : false;

  const handleStartChatting = () => {
    navigate('/chat');
  };

  const handleUpgradeToPremium = async () => {
    if (isGuest) {
      navigate('/signup');
      return;
    }

    setIsUpgrading(true);
    try {
      // Replace 'prod_premium_plan' with your actual Creem product ID
      const checkoutUrl = await initiateCreemCheckout('prod_5fEbbXSXgkLAcjbGK2ENxc');
      
      // Redirect to Creem checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to initiate checkout:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  if (profileLoading || modelsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {profileLoading ? 'Loading your dashboard...' : 'Loading AI models...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header />

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
                className="bg-[#812dea] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#6d1fc7] transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}

        {/* AI Models Section */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-[#812dea] to-[#4ea6fd] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" weight="bold" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your AI Conversation</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Access multiple AI models in one place. Choose your preferred model and start chatting right away.
            </p>
            <Button
              onClick={handleStartChatting}
              size="lg"
              icon={<ChatCircle className="w-5 h-5" weight="bold" />}
              className="text-lg px-8 py-4"
            >
              Start Chatting
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {!isGuest && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Account</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1 capitalize">
                {profile?.subscription_status || 'free'}
              </div>
              <div className="text-sm text-gray-600">Current Plan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Conversations Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{availableModels.length}</div>
              <div className="text-sm text-gray-600">AI Models Available</div>
            </div>
          </div>
        </div>
        )}

        {/* Models Error Display */}
        {modelsError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-red-600" weight="bold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Unable to Load AI Models</h3>
                <p className="text-red-700">{modelsError}</p>
                <p className="text-red-600 text-sm mt-1">You can still use the chat with fallback models.</p>
              </div>
            </div>
          </div>
        )}

        {/* Mascot Guide Section */}
        <div className="mb-8">
          <MascotGuide 
            isMinimized={isMascotMinimized}
            onToggleMinimize={() => setIsMascotMinimized(!isMascotMinimized)}
          />
        </div>

        {/* Upgrade CTA for Free Users */}
        {isGuest || profile?.subscription_status === 'free' ? (
          <div className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] rounded-2xl p-8 text-white text-center">
            <Crown className="w-12 h-12 mx-auto mb-4" weight="bold" />
            <h3 className="text-2xl font-bold mb-4">
              {isGuest ? 'Sign Up to Unlock Premium' : 'Upgrade to Premium'}
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              {isGuest 
                ? 'Create an account to save your conversations, access premium models, and unlock the full potential of TAPA.'
                : 'Upgrade to Premium and get access to GPT-4o, Claude 3.5 Sonnet, GPT-4.1, Claude 3 Opus, and other advanced models.'
              }
            </p>
            {isGuest ? (
              <button
                onClick={handleUpgradeToPremium}
                disabled={isUpgrading}
                className="bg-white text-[#812dea] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUpgrading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#812dea] mr-2"></div>
                    Starting...
                  </div>
                ) : (
                  'Sign Up Free'
                )}
              </button>
            ) : (
              <button 
              onClick={handleUpgradeToPremium}
              disabled={isUpgrading}
              className="bg-white text-[#812dea] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUpgrading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#812dea] mr-2"></div>
                  Starting checkout...
                </div>
              ) : (
                'Upgrade to Premium'
              )}
            </button>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default DashboardPage;