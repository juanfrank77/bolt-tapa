import { redirect } from 'react-router';
import { supabase } from '../lib/supabase';
import { GuestUser } from '../hooks/useAuth';
import * as db from '../lib/database';

export interface ChatLoaderData {
  user: any | GuestUser;
  profile: any;
}

export async function aiChatLoader(): Promise<ChatLoaderData | Response> {
  try {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // Create guest user if no authenticated session
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

    // Fetch user profile
    const profile = await db.getUserProfile(session.user.id);

    return {
      user: session.user,
      profile
    };
  } catch (error) {
    console.error('Error in aiChatLoader:', error);
    // Return guest user on any error
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
}

export async function aiChatAction({ request }: { request: Request }) {
  try {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // For guest users, just return success without logging to database
      return new Response(JSON.stringify({ success: true, guest: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse form data
    const formData = await request.formData();
    const modelName = formData.get('modelName') as string;
    const prompt = formData.get('prompt') as string;
    const response = formData.get('response') as string;
    const tokensUsed = parseInt(formData.get('tokensUsed') as string);
    const responseTimeMs = formData.get('responseTimeMs') 
      ? parseInt(formData.get('responseTimeMs') as string) 
      : undefined;

    // Validate required fields
    if (!modelName || !prompt || !response || isNaN(tokensUsed)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Log interaction to database
    const interaction = await db.logInteraction(
      session.user.id,
      modelName,
      prompt,
      response,
      tokensUsed,
      responseTimeMs
    );

    return new Response(JSON.stringify({ success: true, interaction }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in aiChatAction:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}