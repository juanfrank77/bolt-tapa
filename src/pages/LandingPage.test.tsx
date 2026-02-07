import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import LandingPage from './LandingPage';

// Mock react-router
vi.mock('react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
  useNavigate: vi.fn(),
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

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock values - guest user
    mockUseAuth.mockReturnValue({
      user: { id: 'guest', email: 'guest@tapa.ai', isGuest: true },
    });
    
    mockUseUserProfile.mockReturnValue({
      profile: null,
    });
  });

  it('renders hero section with correct content', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<LandingPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('AI Companion')).toBe(true);
    expect(container.textContent?.includes('TAPA')).toBe(true);
    expect(container.textContent?.includes('Start Your AI Journey')).toBe(true);
  });

  it('renders features section with correct content', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<LandingPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('Multiple AI Models')).toBe(true);
    expect(container.textContent?.includes('Friendly Mascot Guide')).toBe(true);
    expect(container.textContent?.includes('Simple & Secure')).toBe(true);
  });

  it('renders footer with links', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    
    await new Promise<void>((resolve) => {
      root.render(<LandingPage />);
      requestAnimationFrame(() => resolve());
    });
    
    expect(container.textContent?.includes('Privacy Policy')).toBe(true);
    expect(container.textContent?.includes('Terms of Service')).toBe(true);
  });
});
