/*
  # Creem Checkout Edge Function

  This function acts as a secure proxy for Creem API calls, handling:
  - Secure API key management
  - Request forwarding to Creem API
  - Error handling and response formatting
  
  ## Security
  - API key is stored as environment variable in Supabase
  - No client-side exposure of sensitive credentials
  
  ## Usage
  - Called from frontend via `/functions/v1/creem-checkout`
  - Accepts product_id in request body
  - Returns checkout_url for redirect
*/

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreemCheckoutRequest {
  product_id: string;
}

interface CreemCheckoutResponse {
  checkout_url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the Creem API key from environment variables
    const creemApiKey = Deno.env.get('CREEM_API_KEY')
    if (!creemApiKey) {
      console.error('CREEM_API_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    let requestBody: CreemCheckoutRequest
    try {
      requestBody = await req.json()
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate required fields
    if (!requestBody.product_id) {
      return new Response(
        JSON.stringify({ error: 'product_id is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Make the request to Creem API
    const creemResponse = await fetch('https://test-api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': creemApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: requestBody.product_id,
        success_url: "https://tapachat.com/payment-success"
      }),
    })

    // Check if the Creem API request was successful
    if (!creemResponse.ok) {
      const errorText = await creemResponse.text()
      console.error(`Creem API request failed: ${creemResponse.status} ${creemResponse.statusText} - ${errorText}`)
      
      return new Response(
        JSON.stringify({ 
          error: 'Payment service temporarily unavailable',
          details: `Creem API returned ${creemResponse.status}`
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the Creem API response
    let creemData: CreemCheckoutResponse
    try {
      creemData = await creemResponse.json()
    } catch (error) {
      console.error('Failed to parse Creem API response:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid response from payment service' }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate the response from Creem
    if (!creemData.checkout_url) {
      console.error('No checkout URL received from Creem API')
      return new Response(
        JSON.stringify({ error: 'No checkout URL received from payment service' }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return the successful response
    return new Response(
      JSON.stringify({ checkout_url: creemData.checkout_url }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in creem-checkout function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})