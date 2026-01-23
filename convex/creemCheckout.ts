import { action } from "./_generated/server";
import { v } from "convex/values";

interface CreemCheckoutRequest {
  product_id: string;
}

interface CreemCheckoutResponse {
  checkout_url: string;
}

export const creemCheckout = action({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    const creemApiKey = process.env.CREEM_API_KEY;
    if (!creemApiKey) {
      throw new Error("CREEM_API_KEY environment variable is not set");
    }

    const response = await fetch("https://test-api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "x-api-key": creemApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: args.productId,
        success_url: "https://tapachat.com/payment-success",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Creem API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: CreemCheckoutResponse = await response.json();
    if (!data.checkout_url) {
      throw new Error("No checkout URL received from Creem API");
    }

    return { checkout_url: data.checkout_url };
  },
});