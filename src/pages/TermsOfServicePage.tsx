import React from 'react';
import { Header } from '../components';
import { FileText, Users, Warning, CheckCircle } from '@phosphor-icons/react';
import tapaIcon from '../assets/tapa-icon.png';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header variant="minimal" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" weight="bold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using our AI platform.
            </p>
            <div className="text-sm text-gray-500 mt-4">
              Last updated: June 2025
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" weight="bold" />
                <h2 className="text-2xl font-bold text-gray-900 mb-0">Acceptance of Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using TAPA's AI platform, you accept and agree to be bound by the 
                terms and provisions of this agreement. If you do not agree to abide by those, 
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-purple-600 mr-3" weight="bold" />
                <h2 className="text-2xl font-bold text-gray-900 mb-0">User Accounts</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access certain features of our service, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all content posted and activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TAPA's AI platform is provided for legitimate educational, research, and business purposes. You agree not to use the service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Generate harmful, illegal, or inappropriate content</li>
                <li>Attempt to reverse engineer or extract training data from the AI models</li>
                <li>Use the service for any unlawful purpose or to solicit unlawful activity</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the service or servers connected to the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription and Billing</h2>
              <p className="text-gray-700 leading-relaxed">
                Some features of our service require a paid subscription. Subscription fees are billed 
                in advance on a monthly or annual basis and are non-refundable.
                <br>
                If you are using a free plan of service, it is really free. We do not ask you for your 
                credit card information and we do not sell your data.
                <br>
                If you are upgrading from a free plan to a paid plan, we will charge your card immediately 
                and your billing cycle starts on the day of the upgrade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation and Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                You may cancel your subscription at any time, and cancellation will take effect at the end of 
                your current billing period.
                <br>
                All of your content and services will be inaccessible immediately upon account cancellation. 
                Within 30 days, all content will be permanently deleted from active systems and logs.
                <br>
                We have the right to terminate or suspend your account and refuse access to the service
                for any reason whatsoever at any time. Under our sole discretion we reserve the right to
                provide access to the service for any reason including, but not limited to, a breach of
                these Terms. Suspension means you will not be able to access the account or any content in it. 
                Termination means the deletion of your account and the forfeiture of all content in your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Copyright and Content Ownership</h2>
              <p className="text-gray-700 leading-relaxed">
                The service and its original content, features, and functionality are and will remain the exclusive 
                property of TAPA and its licensors. You obtain no ownership rights to the service as a result of 
                your use of it.
                <br>
                We do not pre-screen content, but we reserve the right in our sole discretion to refuse 
                or remove any content that is available via the service.
                <br>
                You give us a limited license to use the content posted by you to provide you with the service, 
                but we claim no ownership rights over those materials. All materials you submit to the service 
                remain yours.
                <br>
                You may not reproduce, duplicate, distribute, exploit any part of the service, or create 
                derivative works from our content without express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-0">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall TAPA, nor its directors, employees, partners, or affiliates, be liable for 
                any direct, indirect, incidental, special, consequential, punitive or exemplary damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible 
                losses, resulting from your use of the service, unauthorized access to or alteration of 
                your transmissions or data, or any other matter relating to these Terms or the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any 
                time. If a revision is material, we will provide at least 30 days notice prior to any 
                new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{' '}
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

export default TermsOfServicePage;
