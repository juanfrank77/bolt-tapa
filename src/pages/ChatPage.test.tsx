import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import ChatPage from './ChatPage';

// Add scrollIntoView mock to Element prototype (JSDOM doesn't have this)
Element.prototype.scrollIntoView = vi.fn();

// Mock openrouter lib first since it's imported in the component
vi.mock('../lib/openrouter', () => ({
  sendMessageToModel: vi.fn(),
  getDisplayName: vi.fn((model) => model?.name || 'AI Assistant'),
  getProviderName: vi.fn((model) => model?.provider || 'Unknown'),
}));

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
  useNavigate: vi.fn(() => (_: string) => {}),
  useLocation: vi.fn(() => ({ pathname: '/chat' })),
  useLoaderData: vi.fn(() => ({ profile: null })),
}));

// Mock convex/react with all required exports
vi.mock('convex/react', () => ({
  useMutation: vi.fn(() => vi.fn().mockResolvedValue({})),
  useQuery: vi.fn(() => null),
}));

// Mock convex API
vi.mock('../../convex/_generated/api', () => ({
  api: {
    auth: {
      signInWithPassword: 'signInWithPassword',
    },
    users: {
      getUserProfile: 'getUserProfile',
      updateUserProfile: 'updateUserProfile',
    },
    interactions: {
      logInteraction: 'logInteraction',
    },
  },
}));

// Mock hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'guest', email: 'guest@tapa.ai', isGuest: true },
  }),
  isGuestUser: (user: any) => user?.isGuest === true,
}));

vi.mock('../hooks/useDatabase', () => ({
  useUserProfile: () => ({
    profile: null,
    loading: false,
  }),
}));

// Mock ModelContext
vi.mock('../context/ModelContext', () => ({
  useModels: () => ({
    availableModels: [
      { id: 'model-1', name: 'Free Model 1', pricing: { prompt: 0, completion: 0 }, provider: 'provider-1' },
      { id: 'model-2', name: 'Free Model 2', pricing: { prompt: 0, completion: 0 }, provider: 'provider-2' },
    ],
    loading: false,
    error: null,
  }),
  useSelectedModel: () => ({
    selectedModel: { id: 'model-1', name: 'Free Model 1' },
    setSelectedModel: vi.fn(),
  }),
}));

// Mock assets
vi.mock('../assets/tapa-icon.png', () => ({ default: 'mock-icon.png' }));

describe('ChatPage', () => {
  it('renders chat interface without crashing', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<ChatPage />);
      requestAnimationFrame(() => resolve());
    });
    
    // Basic check that the container has rendered something
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('renders chat interface content', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<ChatPage />);
      requestAnimationFrame(() => resolve());
    });
    
    // Check that the container has some content
    expect(container.innerHTML).toBeTruthy();
    expect(container.textContent).toBeTruthy();
  });
});
