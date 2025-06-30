import { CREEM_API_KEY } from '../utils/env';

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
    const response = await fetch('/api/creem/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id,
        success_url: "https://tapachat.com/dashboard"
      })
    });

    if (!response.ok) {
      throw new Error(`Creem API request failed: ${response.status} ${response.statusText}`);
    }

    const data: CreemCheckoutResponse = await response.json();
    
    if (!data.checkout_url) {
      throw new Error('No checkout URL received from Creem API');
    }

    return data.checkout_url;
  } catch (error) {
    console.error("Error creating the checkout:", error);
    throw error;
  }
}