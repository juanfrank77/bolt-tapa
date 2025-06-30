import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth, isGuestUser } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useDatabase';
import { Header } from '../components';
import { CheckCircle, Crown, ArrowRight, Warning } from '@phosphor-icons/react';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract payment parameters from URL
  const checkoutId = searchParams.get('checkout_id');
  const orderId = searchParams.get('order_id');
  const customerId = searchParams.get('customer_id');
  const subscriptionId = searchParams.get('subscription_id');
  const productId = searchParams.get('product_id');
  const signature = searchParams.get('signature');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Check if user is authenticated
        if (!user || isGuestUser(user)) {
          setError('You must be logged in to complete the payment process.');
          setLoading(false);
          return;
        }

        // Validate required payment parameters
        if (!subscriptionId || !orderId || !checkoutId) {
          setError('Invalid payment confirmation. Missing required payment information.');
          setLoading(false);
          return;
        }

        // Update user's subscription status to premium
        await updateProfile({
          subscription_status: 'premium'
        });

        setSuccess(true);
        setLoading(false);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);

      } catch (err) {
        console.error('Error processing payment:', err);
        setError('Failed to update your subscription. Please contact support if this issue persists.');
        setLoading(false);
      }
    };

    processPayment();
  }, [user, subscriptionId, orderId, checkoutId, updateProfile, navigate]);

  // Redirect to login if not authenticated after a delay
  useEffect(() => {
    if (error && (!user || isGuestUser(user))) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header variant="minimal" />
      
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
            {loading && (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Payment</h2>
                <p className="text-gray-600 mb-6">
                  We're confirming your payment and upgrading your account. This will only take a moment...
                </p>
              </>
            )}

            {success && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                  <CheckCircle className="w-10 h-10 text-green-600" weight="fill" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful! 🎉</h2>
                <div className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] rounded-lg p-4 text-white mb-6">
                  <Crown className="w-8 h-8 mx-auto mb-2" weight="bold" />
                  <p className="font-semibold">Welcome to TAPA Premium!</p>
                  <p className="text-sm text-purple-100 mt-1">
                    You now have access to all premium AI models
                  </p>
                </div>
                <p className="text-gray-600 mb-6">
                  Your subscription has been activated successfully. You can now access GPT-4o, Claude 3.7 Sonnet, and the other premium models.
                </p>
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <span>Redirecting to your dashboard in 3 seconds...</span>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center mx-auto"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" weight="bold" />
                </button>
              </>
            )}

            {error && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Warning className="w-8 h-8 text-red-600" weight="bold" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Processing Error ❌</h2>
                <p className="text-red-600 mb-6">{error}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gradient-to-r from-[#812dea] to-[#4ea6fd] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  If you continue to experience issues, please contact support.
                </p>
              </>
            )}

            {/* Payment Details (for debugging/confirmation) */}
            {(success || error) && checkoutId && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Order ID: {orderId?.substring(0, 8)}...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;