import React, { useEffect } from 'react';
import { Header } from '../components';
import tapaIcon from '../assets/tapa-icon.png';
import { ArrowLeft, Shield, Eye, Database, Lock } from '@phosphor-icons/react';

const PrivacyPolicyPage: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header variant="minimal" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" weight="bold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">
              Your privacy is a big deal to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="text-sm text-gray-500 mt-4">
              Last updated: June 2025
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-blue-600 mr-3" weight="bold" />
                <h2 className="text-2xl font-bold text-gray-900 mb-0">Information We Collect</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                use our AI chat service, or contact us for support. This may include your name, email 
                address, and conversation history with the AI models.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-red-600 mr-3" weight="bold" />
                <h2 className="text-2xl font-bold text-gray-900 mb-0">How We Secure Your Data</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All data is encrypted in transit when sent from our servers to your browser. 
                We make a great effort to secure your data at rest. Also, the database backups are encrypted.
                We implement appropriate technical security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. 
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-0">How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our AI chat service</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Access</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
                We use some third-party subprocessors to help run our application and provide you the service.
                If at any point we need to access your content to help you with a support case, we will ask 
                for your consent before proceeding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                With respect to your data, you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Know what personal information is collected, used, or shared</li>
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal data, subject to certain limitations under applicable law</li>
                <li>Request restriction of how and why your personal information is used or processed</li>
                <li>Opt out of certain communications from us by email</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Applicable Changes</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this policy as needed to comply with relevant regulations and reflect any new practices.
                Whenever we make a significant change to these policies, we will refresh the date at the top of this page 
                and take any other appropriate steps to notify you accordingly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quesions</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a 
                  href="mailto:hello@tapachat.com" 
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  hello@tapachat.com
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <img 
                src={tapaIcon} 
                alt="TAPA Logo" 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold">TAPA</span>
            </div>
            <p className="text-gray-400 mb-6">
              Making AI accessible to everyone.
            </p>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} TAPA. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
