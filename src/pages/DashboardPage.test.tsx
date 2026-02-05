import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import DashboardPage from './DashboardPage';

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
  useNavigate: vi.fn(() => (_: string) => {}),
  useLocation: vi.fn(() => ({ pathname: '/dashboard' })),
}));

// Mock hooks
const mockUseAuth = vi.fn();
const mockUseUserProfile = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
  isGuestUser: (user: any) => user?.isGuest === true,
}));

vi.mock('../hooks/useDatabase', () => ({
  useUserProfile: () => mockUseUserProfile(),
}));

// Mock ModelContext
const mockUseModels = vi.fn();
const mockUseSelectedModel = vi.fn();

vi.mock('../context/ModelContext', () => ({
  useModels: () => mockUseModels(),
  useSelectedModel: () => mockUseSelectedModel(),
}));

// Mock convex/react with all required exports
const mockUseMutation = vi.fn();
const mockUseQuery = vi.fn();

vi.mock('convex/react', () => ({
  useMutation: () => mockUseMutation(),
  useQuery: () => mockUseQuery(),
}));

// Mock creem checkout
vi.mock('../lib/creem', () => ({
  initiateCreemCheckout: vi.fn(),
}));

// Mock assets
vi.mock('../assets/tapa-icon.png', () => ({ default: 'mock-icon.png' }));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock values - guest user
    mockUseAuth.mockReturnValue({
      user: { id: 'guest', email: 'guest@tapa.ai', isGuest: true },
    });
    
    mockUseUserProfile.mockReturnValue({
      profile: null,
      loading: false,
    });
    
    mockUseModels.mockReturnValue({
      availableModels: [
        { id: 'model-1', name: 'Free Model 1', pricing: { prompt: 0, completion: 0 } },
        { id: 'model-2', name: 'Free Model 2', pricing: { prompt: 0, completion: 0 } },
      ],
      loading: false,
      error: null,
    });
    
    mockUseSelectedModel.mockReturnValue({
      selectedModel: null,
      setSelectedModel: vi.fn(),
    });
    
    mockUseMutation.mockReturnValue(vi.fn().mockResolvedValue({}));
    mockUseQuery.mockReturnValue(null);
  });

  it('renders dashboard welcome section', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<DashboardPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('Hello')).toBe(true);
  });

  it('renders start chatting button', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<DashboardPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('Start Chatting')).toBe(true);
  });

  it('renders sign up section for free users', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<DashboardPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('Sign Up')).toBe(true);
  });

  it('renders guest notice when user is guest', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<DashboardPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('guest')).toBe(true);
  });
});
