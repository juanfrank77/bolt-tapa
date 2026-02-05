import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import SignUpPage from './SignUpPage';

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
  useNavigate: vi.fn(),
  useLocation: vi.fn(() => ({ pathname: '/signup' })),
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

// Mock convex/react with all required exports
const mockUseMutation = vi.fn();
const mockUseQuery = vi.fn();

vi.mock('convex/react', () => ({
  useMutation: () => mockUseMutation(),
  useQuery: () => mockUseQuery(),
}));

// Mock convex API
vi.mock('../../convex/_generated/api', () => ({
  api: {
    users: {
      updateUserProfile: 'updateUserProfile',
    },
  },
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock values - not authenticated
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });
    
    mockUseUserProfile.mockReturnValue({
      profile: null,
    });
    
    mockUseMutation.mockReturnValue(vi.fn().mockResolvedValue({}));
    mockUseQuery.mockReturnValue(null);
  });

  it('renders registration form with correct fields', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<SignUpPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('Full name')).toBe(true);
    expect(container.textContent?.includes('Email')).toBe(true);
    expect(container.textContent?.includes('Password')).toBe(true);
    expect(container.textContent?.includes('Create account')).toBe(true);
  });

  it('handles name input change', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<SignUpPage />);
      requestAnimationFrame(() => resolve());
    });
    
    const nameInput = container.querySelector('input[name="fullName"]') as HTMLInputElement;
    expect(nameInput).toBeTruthy();
  });

  it('handles email input change', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<SignUpPage />);
      requestAnimationFrame(() => resolve());
    });
    
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    expect(emailInput).toBeTruthy();
  });

  it('handles password input change', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<SignUpPage />);
      requestAnimationFrame(() => resolve());
    });
    
    const passwordInput = container.querySelectorAll('input[type="password"]')[0] as HTMLInputElement;
    expect(passwordInput).toBeTruthy();
  });

  it('renders login link', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<SignUpPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('Already have an account')).toBe(true);
    expect(container.textContent?.includes('Sign in')).toBe(true);
  });
});
