import { GuestUser } from '../hooks/useAuth';

export interface ChatLoaderData {
  user: any | GuestUser;
  profile: any;
}

export async function aiChatLoader(): Promise<ChatLoaderData> {
  // Simplified loader - auth and profile fetching is now handled client-side with Convex
  const guestUser: GuestUser = {
    id: 'guest',
    email: 'guest@tapa.ai',
    isGuest: true
  };

  return {
    user: guestUser,
    profile: null
  };
}

// Action removed - logging now handled client-side with Convex