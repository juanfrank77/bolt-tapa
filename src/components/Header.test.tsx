import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import Header from './Header';

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to, className, onClick }: any) => (
    <a href={to} className={className} onClick={onClick}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/' }),
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

// Mock assets
vi.mock('../assets/tapa-icon.png', () => ({ default: 'mock-icon.png' }));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock values
    mockUseAuth.mockReturnValue({
      user: null,
      signOut: vi.fn(),
    });
    
    mockUseUserProfile.mockReturnValue({
      profile: null,
    });
  });

  describe('Default Variant', () => {
    it('renders logo and brand name', async () => {
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      expect(container.querySelector('img[alt="TAPA Logo"]')).toBeTruthy();
      expect(container.textContent?.includes('TAPA')).toBe(true);
    });

    it('renders mobile menu button', async () => {
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      const menuButton = container.querySelector('button[aria-label="Toggle mobile menu"]');
      expect(menuButton).toBeTruthy();
    });

    it('renders navigation links for unauthenticated user', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        signOut: vi.fn(),
      });
      
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      expect(container.textContent?.includes('Features')).toBe(true);
      expect(container.textContent?.includes('How it Works')).toBe(true);
      expect(container.textContent?.includes('Pricing')).toBe(true);
      expect(container.textContent?.includes('Get Started')).toBe(true);
    });

    it('renders dashboard and chat links for authenticated user', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } },
        signOut: vi.fn(),
      });
      
      mockUseUserProfile.mockReturnValue({
        profile: { subscription_status: 'free' },
      });
      
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      expect(container.textContent?.includes('Dashboard')).toBe(true);
      expect(container.textContent?.includes('Chat')).toBe(true);
      expect(container.textContent?.includes('Sign Out')).toBe(true);
    });

    it('renders guest login/signup buttons for guest user', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 'guest', email: 'guest@tapa.ai', isGuest: true },
        signOut: vi.fn(),
      });
      
      mockUseUserProfile.mockReturnValue({
        profile: { subscription_status: 'free' },
      });
      
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      expect(container.textContent?.includes('Sign In')).toBe(true);
      expect(container.textContent?.includes('Sign Up')).toBe(true);
    });

    it('shows premium badge for premium users', async () => {
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } },
        signOut: vi.fn(),
      });
      
      mockUseUserProfile.mockReturnValue({
        profile: { subscription_status: 'premium' },
      });
      
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      expect(container.textContent?.includes('premium')).toBe(true);
    });
  });

  describe('Minimal Variant', () => {
    it('renders minimal variant with logo and back button', async () => {
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header variant="minimal" />);
        requestAnimationFrame(() => resolve());
      });
      
      expect(container.querySelector('img[alt="TAPA Logo"]')).toBeTruthy();
      expect(container.textContent?.includes('Back to Home')).toBe(true);
    });

    it('does not render navigation links in minimal variant', async () => {
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header variant="minimal" />);
        requestAnimationFrame(() => resolve());
      });
      
      expect(container.textContent?.includes('Features')).toBe(false);
      expect(container.textContent?.includes('Get Started')).toBe(false);
    });
  });

  describe('Mobile Menu', () => {
    it('shows mobile menu toggle button', async () => {
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      // Mobile menu button should be present
      const menuButton = container.querySelector('button[aria-label="Toggle mobile menu"]');
      expect(menuButton).toBeTruthy();
    });
  });

  describe('Sign Out', () => {
    it('calls signOut when sign out button is clicked', async () => {
      const mockSignOut = vi.fn();
      
      mockUseAuth.mockReturnValue({
        user: { id: '123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } },
        signOut: mockSignOut,
      });
      
      mockUseUserProfile.mockReturnValue({
        profile: { subscription_status: 'free' },
      });
      
      const container = document.createElement('div');
      const root = createRoot(container);
      
      await new Promise<void>((resolve) => {
        root.render(<Header />);
        requestAnimationFrame(() => resolve());
      });
      
      const signOutButton = container.querySelector('button') as HTMLButtonElement;
      expect(signOutButton?.textContent?.includes('Sign Out')).toBe(true);
      
      signOutButton?.click();
      
      // Note: The signOut function is async and called with await
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
