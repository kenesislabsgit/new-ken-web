import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, facilitySize, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    // Send notification to Kenesis team
    await transporter.sendMail({
      from: `"Kenesis Website" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.ZOHO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${escHtml(name)}${company ? ` — ${escHtml(company)}` : ''}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #f59e0b;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0;">${escHtml(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
            ${company ? `<tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0;">${escHtml(company)}</td></tr>` : ''}
            ${facilitySize ? `<tr><td style="padding: 8px 0; color: #666;">Facility Size</td><td style="padding: 8px 0;">${escHtml(facilitySize)}</td></tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${escHtml(message)}</p>
          </div>
          <p style="margin-top: 16px; color: #999; font-size: 12px;">Sent from kenesis.in contact form</p>
        </div>
      `,
    });

    // Send confirmation to the user
    await transporter.sendMail({
      from: `"Kenesis Labs" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'We received your inquiry — Kenesis Labs',
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Thank you, ${escHtml(name)}.</h2>
          <p>We've received your inquiry and will get back to you within 24 hours.</p>
          <p style="color: #666;">If you need immediate assistance, reply to this email or call us at +91 93422 81662.</p>
          <br/>
          <p>— The Kenesis Labs Team</p>
          <p style="color: #999; font-size: 12px;">Kenesis Labs Pvt. Ltd. · Chennai, India</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
