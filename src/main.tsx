import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { convex } from './lib/convex';
import { ModelProvider } from './context/ModelContext';
import { LandingPage, LoginPage, SignUpPage, DashboardPage, ChatPage, PaymentSuccessPage, PrivacyPolicyPage, TermsOfServicePage } from './pages';
import { aiChatLoader } from './routes/chat';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
    loader: aiChatLoader
  },
  {
    path: "/payment-success",
    element: <PaymentSuccessPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfServicePage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <ModelProvider>
        <RouterProvider router={router} />
      </ModelProvider>
    </ConvexAuthProvider>
  </StrictMode>
);
