const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fullName, email, destination, checkIn, checkOut, guests, totalPrice } = await req.json()

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Email to admin
    const adminHtml = `
      <h2>🏔️ Rezervim i Ri — Fshati.al</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Emri</td><td style="padding:8px;border:1px solid #ddd">${fullName}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Destinacioni</td><td style="padding:8px;border:1px solid #ddd">${destination}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Check-in</td><td style="padding:8px;border:1px solid #ddd">${checkIn}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Check-out</td><td style="padding:8px;border:1px solid #ddd">${checkOut || '—'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Persona</td><td style="padding:8px;border:1px solid #ddd">${guests}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Totali</td><td style="padding:8px;border:1px solid #ddd">€${totalPrice}</td></tr>
      </table>
    `

    const guestHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#1C3D2E;padding:24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#F8F4ED;margin:0;font-size:24px">🏔️ Fshati.al</h1>
        </div>
        <div style="background:#ffffff;padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="color:#1C3D2E;margin-top:0">Faleminderit ${fullName}!</h2>
          <p style="color:#555;line-height:1.6">
            Rezervimi juaj për <strong>${destination}</strong> u dërgua me sukses.
            Do t'ju konfirmojmë brenda 24 orësh.
          </p>
          <div style="background:#f8f4ed;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:4px 0;color:#333"><strong>📅 Data:</strong> ${checkIn}${checkOut ? ` → ${checkOut}` : ''}</p>
            <p style="margin:4px 0;color:#333"><strong>👥 Persona:</strong> ${guests}</p>
            <p style="margin:4px 0;color:#333"><strong>💰 Totali:</strong> €${totalPrice}</p>
          </div>
          <p style="color:#999;font-size:13px;margin-bottom:0">— Ekipi Fshati.al</p>
        </div>
      </div>
    `

    // Send admin notification
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'Fshati.al <onboarding@resend.dev>',
        to: ['hello@fshati.al'],
        subject: `Rezervim i Ri: ${fullName} — ${destination}`,
        html: adminHtml,
      }),
    })

    // Send guest confirmation
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'Fshati.al <onboarding@resend.dev>',
        to: [email],
        subject: `Konfirmim Rezervimi — ${destination} | Fshati.al`,
        html: guestHtml,
      }),
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
