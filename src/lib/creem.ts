import { CREEM_API_KEY } from '../utils/env';

/**
* Initiates the checkout flow in Creem for a particular product
* @param product_id String with the id of the product
* @returns String the checkout url to redirect the user to
* @throws Error if the API is unavailable or returns invalid data
**/
export async function initiateCreemCheckout(product_id) {
  try {
    const response await fetch('https://test-api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': 'creem_test_LUo2MK2C0SxkiG0WOzY6L',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id
      })
    });
    const data = await response.json();
    return data.checkout_url;
  } catch (error) {
    console.error("Error creating the checkout:", error);
  }
}