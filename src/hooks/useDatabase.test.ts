import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserProfile } from './useDatabase';
import { isGuestUser } from './useAuth';

// Mock Convex hooks
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

// Mock Convex API
vi.mock('../../convex/_generated/api', () => ({
  api: {
    users: {
      getUserProfile: vi.fn(),
      updateUserProfile: vi.fn(),
    },
  },
}));

// Mock useAuth hook
vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
  isGuestUser: vi.fn(),
}));

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from './useAuth';

describe('useUserProfile Hook', () => {
  const mockUpdateProfileMutation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateProfileMutation.mockResolvedValue(undefined);
    
    (useMutation as any).mockImplementation((fn: any) => {
      if (fn === api.users.updateUserProfile) return mockUpdateProfileMutation;
      return vi.fn();
    });
  });

  describe('guest user profile', () => {
    beforeEach(() => {
      const guestUser = {
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      };
      
      (useAuth as any).mockReturnValue({ user: guestUser });
      (isGuestUser as any).mockReturnValue(true);
      (useQuery as any).mockReturnValue(null);
    });

    it('returns guest profile for guest user', () => {
      const { result } = renderHook(() => useUserProfile());

      expect(result.current.profile).toEqual({
        id: 'guest-profile',
        user_id: 'guest',
        full_name: 'Guest User',
        avatar_url: null,
        subscription_status: 'free',
        created_at: expect.any(Number),
        updated_at: expect.any(Number),
      });
    });

    it('returns loading as false for guest user', () => {
      const { result } = renderHook(() => useUserProfile());

      expect(result.current.loading).toBe(false);
    });

    it('returns error as null for guest user', () => {
      const { result } = renderHook(() => useUserProfile());

      expect(result.current.error).toBe(null);
    });

    it('returns updateProfile function that resolves immediately for guest user', async () => {
      const { result } = renderHook(() => useUserProfile());

      await expect(result.current.updateProfile({ full_name: 'Test' })).resolves.toBeUndefined();
      expect(mockUpdateProfileMutation).not.toHaveBeenCalled();
    });
  });

  describe('authenticated user profile', () => {
    const mockAuthUser = {
      id: 'user-123',
      email: 'user@example.com',
    };

    const mockProfile = {
      id: 'profile-123',
      user_id: 'user-123',
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg',
      subscription_status: 'premium',
      created_at: 1234567890,
      updated_at: 1234567890,
    };

    beforeEach(() => {
      (useAuth as any).mockReturnValue({ user: mockAuthUser });
      (isGuestUser as any).mockReturnValue(false);
      (useQuery as any).mockReturnValue(mockProfile);
    });

    it('returns user profile from query', () => {
      const { result } = renderHook(() => useUserProfile());

      expect(result.current.profile).toEqual(mockProfile);
    });

    it('returns loading as false for authenticated user', () => {
      const { result } = renderHook(() => useUserProfile());

      expect(result.current.loading).toBe(false);
    });

    it('returns error as null for authenticated user', () => {
      const { result } = renderHook(() => useUserProfile());

      expect(result.current.error).toBe(null);
    });

    it('calls updateProfile mutation with correct parameters', async () => {
      const { result } = renderHook(() => useUserProfile());

      const updates = {
        full_name: 'Jane Doe',
        avatar_url: 'https://example.com/new-avatar.jpg',
      };

      await act(async () => {
        await result.current.updateProfile(updates);
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        ...updates,
      });
    });

    it('updates full_name successfully', async () => {
      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({ full_name: 'New Name' });
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        full_name: 'New Name',
      });
    });

    it('updates avatar_url successfully', async () => {
      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({ avatar_url: 'https://example.com/avatar.png' });
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        avatar_url: 'https://example.com/avatar.png',
      });
    });

    it('updates subscription_status successfully', async () => {
      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({ subscription_status: 'enterprise' });
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        subscription_status: 'enterprise',
      });
    });

    it('updates multiple fields at once', async () => {
      const { result } = renderHook(() => useUserProfile());

      const updates = {
        full_name: 'Updated Name',
        avatar_url: 'https://example.com/updated.jpg',
        subscription_status: 'premium' as const,
      };

      await act(async () => {
        await result.current.updateProfile(updates);
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        ...updates,
      });
    });

    it('does not call mutation for guest user even if updateProfile is called', async () => {
      const guestUser = {
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      };
      
      (useAuth as any).mockReturnValue({ user: guestUser });
      (isGuestUser as any).mockReturnValue(true);

      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({ full_name: 'Test' });
      });

      expect(mockUpdateProfileMutation).not.toHaveBeenCalled();
    });

    it('handles updateProfile with no parameters', async () => {
      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({});
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
      });
    });
  });

  describe('hook return values', () => {
    it('returns all expected properties for guest user', () => {
      const guestUser = {
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      };
      
      (useAuth as any).mockReturnValue({ user: guestUser });
      (isGuestUser as any).mockReturnValue(true);

      const { result } = renderHook(() => useUserProfile());

      expect(result.current).toHaveProperty('profile');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('updateProfile');
      expect(typeof result.current.updateProfile).toBe('function');
    });

    it('returns all expected properties for authenticated user', () => {
      const mockAuthUser = {
        id: 'user-123',
        email: 'user@example.com',
      };
      
      (useAuth as any).mockReturnValue({ user: mockAuthUser });
      (isGuestUser as any).mockReturnValue(false);
      (useQuery as any).mockReturnValue({
        id: 'profile-123',
        user_id: 'user-123',
        full_name: 'John Doe',
        avatar_url: null,
        subscription_status: 'free',
        created_at: 1234567890,
        updated_at: 1234567890,
      });

      const { result } = renderHook(() => useUserProfile());

      expect(result.current).toHaveProperty('profile');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('updateProfile');
      expect(typeof result.current.updateProfile).toBe('function');
    });
  });

  describe('subscription status types', () => {
    it('accepts free subscription status', async () => {
      const mockAuthUser = {
        id: 'user-123',
        email: 'user@example.com',
      };
      
      (useAuth as any).mockReturnValue({ user: mockAuthUser });
      (isGuestUser as any).mockReturnValue(false);
      (useQuery as any).mockReturnValue({
        id: 'profile-123',
        user_id: 'user-123',
        full_name: 'John Doe',
        avatar_url: null,
        subscription_status: 'free',
        created_at: 1234567890,
        updated_at: 1234567890,
      });

      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({ subscription_status: 'free' });
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        subscription_status: 'free',
      });
    });

    it('accepts premium subscription status', async () => {
      const mockAuthUser = {
        id: 'user-123',
        email: 'user@example.com',
      };
      
      (useAuth as any).mockReturnValue({ user: mockAuthUser });
      (isGuestUser as any).mockReturnValue(false);
      (useQuery as any).mockReturnValue({
        id: 'profile-123',
        user_id: 'user-123',
        full_name: 'John Doe',
        avatar_url: null,
        subscription_status: 'free',
        created_at: 1234567890,
        updated_at: 1234567890,
      });

      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({ subscription_status: 'premium' });
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        subscription_status: 'premium',
      });
    });

    it('accepts enterprise subscription status', async () => {
      const mockAuthUser = {
        id: 'user-123',
        email: 'user@example.com',
      };
      
      (useAuth as any).mockReturnValue({ user: mockAuthUser });
      (isGuestUser as any).mockReturnValue(false);
      (useQuery as any).mockReturnValue({
        id: 'profile-123',
        user_id: 'user-123',
        full_name: 'John Doe',
        avatar_url: null,
        subscription_status: 'free',
        created_at: 1234567890,
        updated_at: 1234567890,
      });

      const { result } = renderHook(() => useUserProfile());

      await act(async () => {
        await result.current.updateProfile({ subscription_status: 'enterprise' });
      });

      expect(mockUpdateProfileMutation).toHaveBeenCalledWith({
        userId: 'user-123',
        subscription_status: 'enterprise',
      });
    });
  });
});
