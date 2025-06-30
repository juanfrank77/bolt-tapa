import { SUPABASE_URL } from '../utils/env';

export interface CreemCheckoutResponse {
  checkout_url: string;
}

/**
 * Initiates the checkout flow in Creem for a particular product
 * @param product_id String with the id of the product
 * @returns Promise<string> the checkout url to redirect the user to
 * @throws Error if the API is unavailable or returns invalid data
 */
export async function initiateCreemCheckout(product_id: string): Promise<string> {
  try {
    // Use the Supabase Edge Function instead of direct API call
    const response = await fetch(`${SUPABASE_URL}/functions/v1/creem-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        `Checkout request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: CreemCheckoutResponse = await response.json();
    
    if (!data.checkout_url) {
      throw new Error('No checkout URL received from payment service');
    }

    return data.checkout_url;
  } catch (error) {
    console.error("Error creating the checkout:", error);
    throw error;
  }
}