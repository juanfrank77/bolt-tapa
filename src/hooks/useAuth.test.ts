import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth, isGuestUser, GuestUser } from './useAuth';

// Mock Convex hooks
vi.mock('convex/react', () => ({
  useConvexAuth: vi.fn(),
  useMutation: vi.fn(),
  useQuery: vi.fn(),
}));

// Mock Convex API
vi.mock('../../convex/_generated/api', () => ({
  api: {
    auth: {
      signOut: vi.fn(),
      getCurrentUser: vi.fn(),
    },
    users: {
      createUserProfile: vi.fn(),
    },
  },
}));

import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

describe('useAuth Hook', () => {
  const mockSignOutMutation = vi.fn();
  const mockCreateUserProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOutMutation.mockResolvedValue(undefined);
    mockCreateUserProfile.mockResolvedValue(undefined);
    
    (useMutation as any).mockImplementation((fn: any) => {
      if (fn === api.auth.signOut) return mockSignOutMutation;
      if (fn === api.users.createUserProfile) return mockCreateUserProfile;
      return vi.fn();
    });
  });

  describe('isGuestUser helper function', () => {
    it('returns true for guest user', () => {
      const guestUser: GuestUser = {
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      };
      expect(isGuestUser(guestUser)).toBe(true);
    });

    it('returns false for authenticated user', () => {
      const authUser = { id: 'user-123', email: 'user@example.com' };
      expect(isGuestUser(authUser)).toBe(false);
    });

    it('returns false for null user', () => {
      expect(isGuestUser(null)).toBe(false);
    });

    it('returns false for user without isGuest property', () => {
      const user = { id: 'user-123', email: 'user@example.com', isGuest: false };
      expect(isGuestUser(user)).toBe(false);
    });
  });

  describe('authentication states', () => {
    it('returns guest user when not authenticated', async () => {
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      });
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('returns authenticated user when authenticated with profile', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(mockCreateUserProfile).toHaveBeenCalled();
    });

    it('returns authenticated user when authenticated without profile', async () => {
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('sets loading to true while Convex auth is loading', () => {
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });
      (useQuery as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
    });

    it('handles error when creating user profile', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockCreateUserProfile.mockRejectedValue(new Error('Profile creation failed'));
      
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error creating user profile:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('sign out functionality', () => {
    it('signs out successfully and sets guest user', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSignOutMutation).toHaveBeenCalled();
      expect(result.current.user).toEqual({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      });
    });

    it('handles sign out error and falls back to guest state', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockSignOutMutation.mockRejectedValue(new Error('Sign out failed'));
      
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(mockUser);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing out:',
        expect.any(Error)
      );
      expect(result.current.user).toEqual({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      });
      
      consoleErrorSpy.mockRestore();
    });

    it('signs out from guest state', async () => {
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toEqual({
        id: 'guest',
        email: 'guest@tapa.ai',
        isGuest: true,
      });
    });
  });

  describe('hook return values', () => {
    it('returns all expected properties', async () => {
      (useConvexAuth as any).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });
      (useQuery as any).mockReturnValue(null);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('signOut');
      expect(typeof result.current.signOut).toBe('function');
    });
  });
});
