import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // CORS headers so your website can talk to this function securely
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. Get the requested amount from your frontend
    const { amount } = await req.json()

    // 2. Your public Key ID (You can safely hardcode this here)
    const keyId = 'rzp_test_Svr9dcgbJa0AGO' 
    
    // 3. Pull the Secret securely from Supabase
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    // 4. Ask Razorpay to create an Order ID
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // This is how Razorpay expects the keys for authentication
        'Authorization': 'Basic ' + btoa(`${keyId}:${keySecret}`)
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay calculates in paise (100 paise = 1 INR)
        currency: 'INR',
        receipt: 'receipt_' + Math.random().toString(36).substring(7)
      })
    })

    const orderData = await response.json()

    // 5. Send the Order ID back to your HTML website
    return new Response(JSON.stringify(orderData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})