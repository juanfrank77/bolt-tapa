import React, { useState } from 'react';
import { useAuth, isGuestUser } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useDatabase';
import tapaIcon from '../assets/tapa-icon.png';
import { Button } from '../components';
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
import { MascotGuide } from '../components';



const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [isMascotMinimized, setIsMascotMinimized] = useState(false);
  const navigate = useNavigate();
  const isGuest = user ? isGuestUser(user) : false;

  const handleSignOut = async () => {
    await signOut();
  };

  const handleStartChatting = () => {
    navigate('/chat');
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
                src={tapaIcon} 
                alt="TAPA Logo" 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#812dea] to-[#4ea6fd] bg-clip-text text-transparent">
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
                    className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
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
              <div className="text-2xl font-bold text-blue-600 mb-1">6</div>
              <div className="text-sm text-gray-600">AI Models Available</div>
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
        {(isGuest || profile?.subscription_status === 'free') && (
          <div className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] rounded-2xl p-8 text-white text-center">
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
                className="bg-white text-[#812dea] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign Up Free
              </Link>
            ) : (
            <button className="bg-white text-[#812dea] px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
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