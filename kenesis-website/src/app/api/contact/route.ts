import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Node.js runtime required for nodemailer
export const runtime = 'nodejs';

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

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;
  const TO_EMAIL   = process.env.CONTACT_TO_EMAIL ?? 'admin@kenesis.ai';

  if (!GMAIL_USER || !GMAIL_PASS) {
    // Env vars not set yet — log and succeed silently so the form UX still works
    console.log('[contact form — no email credentials set]', { name, email, company, facilitySize, message });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Kenesis Contact" <${GMAIL_USER}>`,
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `New demo request from ${name.trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;">
          <h2 style="color:#f59e0b;">New contact form submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:140px;">Name</td><td style="padding:8px 0;"><b>${name}</b></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Company</td><td style="padding:8px 0;">${company || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Facility size</td><td style="padding:8px 0;">${facilitySize || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Message</td><td style="padding:8px 0;">${message || '—'}</td></tr>
          </table>
        </div>
      `,
    });
  } catch (err) {
    console.error('[contact form] nodemailer error:', err);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
