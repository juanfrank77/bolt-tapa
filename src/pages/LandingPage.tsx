import React, { useState } from 'react';
import { Link } from 'react-router';
import tapaIcon from '../assets/tapa-icon.png';
import { 
  Brain, 
  Sparkle, 
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star,
  List,
  X
} from '@phosphor-icons/react';

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img 
                src={tapaIcon} 
                alt="TAPA Logo" 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#812dea] to-[#4ea6fd] bg-clip-text text-transparent">
                TAPA
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <List className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="#features" 
                  onClick={closeMobileMenu}
                  className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={closeMobileMenu}
                  className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                >
                  How it Works
                </a>
                <a 
                  href="#pricing" 
                  onClick={closeMobileMenu}
                  className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                >
                  Pricing
                </a>
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu}
                  className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-medium text-center"
                >
                  Get Started
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-8">
              <Sparkle className="w-4 h-4 mr-2" weight="fill" />
              Your AI Assistant is Here
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Meet Your
              <span className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] bg-clip-text text-transparent block">
                AI Companion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              TAPA is your <b>T</b>echnologically <b>A</b>ugmented <b>P</b>ersonal <b>A</b>ssistant. 
            </p>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Chat with multiple AI models in one place, learn from a friendly mascot, and unlock               the power of <b>AI</b> without the complexity.
            </p>
            
            <div className="flex flex-col gap-4 justify-center items-center">
              <Link 
                to="/signup"
                className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center group"
              >
                Start Your AI Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" weight="bold" />
              </Link>
              <Link 
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-8 py-4 rounded-full text-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                Try for Free
              </Link>
            </div>
            
            <div className="mt-16 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" weight="fill" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-500 mr-1" weight="fill" />
                <span>100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose TAPA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TAPA is designed to be the most user-friendly AI platform, 
              perfect for beginners and non-technical users.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" weight="bold" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multiple AI Models</h3>
              <p className="text-gray-600 leading-relaxed">
                Access several AI models from one platform. Compare responses, 
                find the best fit for your needs, and switch seamlessly between models.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkle className="w-8 h-8 text-white" weight="bold" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Friendly Mascot Guide</h3>
              <p className="text-gray-600 leading-relaxed">
                Meet TAPA, your AI companion who will guide you every step. 
                Learn AI concepts, get personalized tips, and never feel lost in the world of artificial intelligence.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" weight="bold" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simple & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                No technical knowledge required. Our intuitive interface makes AI accessible to everyone, while enterprise-grade security keeps your data safe & private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who have simplified their AI experience with TAPA.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sign Up & Choose Your Plan</h3>
              <p className="text-gray-600">
                Create your account in seconds and select the plan that fits your needs. 
                Start with our free tier or unlock premium models.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Meet Your AI Mascot</h3>
              <p className="text-gray-600">
                Get introduced to your friendly AI guide who will help you understand 
                different models and find the perfect assistant for your tasks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Chatting & Learning</h3>
              <p className="text-gray-600">
                Begin conversations with AI models, explore different capabilities, 
                and discover how AI can enhance your daily tasks and creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for you. Start free and upgrade when you need more power.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $0<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started with AI</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" weight="fill" />
                  <span className="text-gray-700">Access to free AI models</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" weight="fill" />
                  <span className="text-gray-700">Basic chat functionality</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" weight="fill" />
                  <span className="text-gray-700">TAPA mascot guide</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" weight="fill" />
                  <span className="text-gray-700">Limited conversation history</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" weight="fill" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>
              
              <Link
                to="/signup"
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-[#812dea] to-[#4ea6fd] rounded-2xl p-8 text-white relative transform hover:scale-105 transition-transform duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold mb-2">
                  $15<span className="text-lg font-normal text-purple-100">/month</span>
                </div>
                <p className="text-purple-100">Unlock the full power of AI</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" weight="fill" />
                  <span>Everything in Free plan</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" weight="fill" />
                  <span>Access to premium AI models</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" weight="fill" />
                  <span>GPT-4o, Claude 3.5 Sonnet & more</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" weight="fill" />
                  <span>Unlimited conversation history</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" weight="fill" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" weight="fill" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" weight="fill" />
                  <span>Early access to new features</span>
                </li>
              </ul>
              
              <Link
                to="/signup"
                className="w-full bg-white text-[#812dea] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-center block"
              >
                Start Premium Trial
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include a 7-day free trial. No credit card required to start.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" weight="fill" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" weight="fill" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" weight="fill" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#812dea] to-[#4ea6fd]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore AI?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join the AI revolution today. Start with a free trial and discover 
            how TAPA can transform the way you interact with artificial intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup"
              className="bg-white text-[#812dea] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center group"
            >
              Start Your AI Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" weight="bold" />
            </Link>
            <Link 
              to="/login"
              className="text-white hover:text-purple-100 px-8 py-4 rounded-full text-lg font-medium border-2 border-white/30 hover:border-white/50 transition-all duration-200"
            >
              Already have an account?
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-purple-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
              <span>No commitments</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bolt Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-12 h-12 hover:scale-110 transition-transform duration-200"
          title="Built with Bolt"
        >
          <img 
            src="/white_circle_360x360.svg" 
            alt="Built with Bolt" 
            className="w-full h-full drop-shadow-lg"
          />
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <img 
                  src={tapaIcon} 
                  alt="TAPA Logo" 
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold">TAPA</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Making AI accessible to everyone. Your friendly companion in the world of artificial intelligence.
              </p>
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} TAPA. All rights reserved.
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:hello@tapachat.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;