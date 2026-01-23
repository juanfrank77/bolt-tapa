import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { convex } from './lib/convex';
import { ModelProvider } from './context/ModelContext';
import { LandingPage, LoginPage, SignUpPage, DashboardPage, ChatPage, PaymentSuccessPage, PrivacyPolicyPage, TermsOfServicePage } from './pages';
import { aiChatLoader, aiChatAction } from './routes/chat';
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
    loader: aiChatLoader,
    action: aiChatAction,
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
    <ConvexProvider client={convex}>
      <ModelProvider>
        <RouterProvider router={router} />
      </ModelProvider>
    </ConvexProvider>
  </StrictMode>
);
