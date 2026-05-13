import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  facilitySize?: string;
  message?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, company, facilitySize, message } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email?.trim() || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }

  // ── Send via Resend (or fall back to a mailto log if key not set) ──
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'admin@kenesis.ai';

  if (RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kenesis Contact <no-reply@kenesis.ai>',
        to: [TO_EMAIL],
        reply_to: email.trim(),
        subject: `New demo request from ${name.trim()}`,
        html: `
          <h2>New contact form submission</h2>
          <table>
            <tr><td><b>Name</b></td><td>${name}</td></tr>
            <tr><td><b>Email</b></td><td>${email}</td></tr>
            <tr><td><b>Company</b></td><td>${company || '—'}</td></tr>
            <tr><td><b>Facility size</b></td><td>${facilitySize || '—'}</td></tr>
            <tr><td><b>Message</b></td><td>${message || '—'}</td></tr>
          </table>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
    }
  } else {
    // No email provider configured — log to console (useful in dev / before env vars are set)
    console.log('[contact form]', { name, email, company, facilitySize, message });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
