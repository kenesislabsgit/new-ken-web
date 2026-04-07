// Quick test: sends a test email via the /api/contact endpoint
// Usage: node test-email.mjs

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const payload = {
  name: 'Test User',
  email: 'admin@kenesis.ai', // sending to yourself so you can verify receipt
  company: 'Kenesis Labs (Test)',
  facilitySize: 'Small (< 50 cameras)',
  message: 'This is an automated test to verify the contact form email delivery is working correctly.',
};

console.log(`Sending test email to ${BASE_URL}/api/contact ...`);

try {
  const res = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (res.ok) {
    console.log('✅ Success! Check admin@kenesis.ai inbox for:');
    console.log('   1. A notification email (new inquiry from Test User)');
    console.log('   2. A confirmation email (we received your inquiry)');
  } else {
    console.error('❌ Failed:', data.error || data);
  }
} catch (err) {
  console.error('❌ Network error — is the dev server running on', BASE_URL, '?');
  console.error(err.message);
}
