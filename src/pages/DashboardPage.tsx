import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useDatabase';
import { Brain, SignOut, User, Sparkle } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" weight="bold" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TAPA
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">
                  {profile?.full_name || user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SignOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
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
            Welcome to your AI Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hello, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to explore the world of AI? Choose from our selection of models and start your conversation.
          </p>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                profile?.subscription_status === 'premium' 
                  ? 'bg-purple-100 text-purple-800'
                  : profile?.subscription_status === 'enterprise'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {profile?.subscription_status || 'free'}
              </span>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" weight="bold" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Models Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're working hard to bring you access to multiple AI models. Soon you'll be able to chat with 
            different AI assistants, compare their responses, and find the perfect match for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Features
            </Link>
            <button className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;