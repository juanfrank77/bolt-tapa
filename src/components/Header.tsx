import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth, isGuestUser } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useDatabase';
import tapaIcon from '../assets/tapa-icon.png';
import { ThemeToggle } from './';
import { 
  SignOut, 
  User, 
  List,
  X,
  ArrowLeft
} from '@phosphor-icons/react';

interface HeaderProps {
  variant?: 'default' | 'minimal' | 'chat';
  showBackButton?: boolean;
  backTo?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  variant = 'default', 
  showBackButton = false,
  backTo = '/',
  className = '' 
}) => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isGuest = user ? isGuestUser(user) : false;
  const isAuthenticated = user && !isGuest;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    closeMobileMenu();
  };

  // Navigation items based on authentication status
  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Features', href: '/#features', external: true },
      { label: 'How it Works', href: '/#how-it-works', external: true },
      { label: 'Pricing', href: '/#pricing', external: true },
    ];

    if (isAuthenticated) {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Chat', href: '/chat' },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  // Render different variants
  if (variant === 'minimal') {
    return (
      <header className={`bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 ${className}`}>
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
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // if (variant === 'chat') {
  //   return (
  //     <header className={`bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 ${className}`}>
  //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  //         <div className="grid grid-cols-3 items-center py-4">
  //           {/* Left: TAPA Logo */}
  //           <div className="flex items-center justify-start">
  //             <Link to="/" className="flex items-center space-x-2">
  //               <img 
  //                 src={tapaIcon} 
  //                 alt="TAPA Logo" 
  //                 className="w-8 h-8"
  //               />
  //               <span className="text-lg font-bold bg-gradient-to-r from-[#812dea] to-[#4ea6fd] bg-clip-text text-transparent">
  //                 TAPA
  //               </span>
  //             </Link>
  //           </div>

  //           {/* Center: Back Button or Title */}
  //           <div className="flex items-center justify-center">
  //             {showBackButton && (
  //               <Link
  //                 to={backTo}
  //                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
  //               >
  //                 <ArrowLeft className="w-5 h-5" />
  //                 <span className="hidden sm:inline">Back</span>
  //               </Link>
  //             )}
  //           </div>

  //           {/* Right: User Info and Theme Toggle */}
  //           <div className="flex items-center justify-end space-x-2">
  //             {isGuest && (
  //               <div className="hidden sm:flex items-center space-x-2 text-sm">
  //                 <span className="text-gray-600">Guest</span>
  //               </div>
  //             )}
  //             <ThemeToggle />
  //           </div>
  //         </div>
  //       </div>
  //     </header>
  //   );
  // }

  // Default variant - full navigation header
  return (
    <header className={`bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
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
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.external ? (
                <a 
                  key={item.label}
                  href={item.href} 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link 
                  key={item.label}
                  to={item.href} 
                  className={`transition-colors ${
                    location.pathname === item.href 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {/* Authentication Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">
                    {('user_metadata' in user && user.user_metadata?.full_name) 
                          ? user.user_metadata.full_name.split(' ')[0] 
                          : user.email}
                  </span>
                  {profile?.subscription_status && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.subscription_status === 'premium' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {profile.subscription_status}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <SignOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : isGuest ? (
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
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Get Started
              </Link>
            )}
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
              {navigationItems.map((item) => (
                item.external ? (
                  <a 
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link 
                    key={item.label}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`transition-colors px-2 py-1 ${
                      location.pathname === item.href 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              
              {/* Mobile Authentication Actions */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 px-2 py-1 mb-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {profile?.full_name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1"
                  >
                    <SignOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : isGuest ? (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block text-blue-600 hover:text-blue-700 font-medium transition-colors px-2 py-1"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="block bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-4 py-2 rounded-lg font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/signup" 
                  onClick={closeMobileMenu}
                  className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-6 py-2 rounded-full font-medium text-center"
                >
                  Get Started
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;