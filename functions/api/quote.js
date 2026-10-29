/**
 * POST /api/quote
 * Receives the quote request form, checks it, and emails it to Ryan via Resend.
 *
 * Environment variables (Cloudflare Pages > Settings > Variables and Secrets):
 *   RESEND_API_KEY        (secret)   API key from resend.com
 *   TURNSTILE_SECRET_KEY  (secret)   Turnstile secret key. If not set, the spam check is skipped.
 *   QUOTE_TO              (optional) Where requests go. Default: ryan@397graphix.co.nz
 *   QUOTE_FROM            (optional) Sender. Must be on a domain verified in Resend.
 *                                    Default: 397 Graphix Website <website@397graphix.co.nz>
 */

const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024;     // 8 MB per photo
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;   // 20 MB all together
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
const EXT_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif', pdf: 'application/pdf' };
const LIMITS = { name: 100, business: 120, phone: 40, email: 160, service: 80, when: 40, location: 120, message: 5000 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const oneLine = s => s.replace(/[\r\n]+/g, ' ');
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function verifyTurnstile(token, secret, ip) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = await r.json().catch(() => ({}));
    return data.success === true;
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Sorry, we couldn\'t read that. Please try again.' }, 400);
  }

  // Honeypot: real people never see or fill this field.
  if (clean(form.get('website'), 200)) return json({ ok: true });

  const f = {};
  for (const [k, max] of Object.entries(LIMITS)) f[k] = clean(form.get(k), max);
  for (const k of Object.keys(f)) if (k !== 'message') f[k] = oneLine(f[k]);

  if (!f.name || !f.message) return json({ ok: false, error: 'Please add your name and a few words about the job.' }, 400);
  if (!f.phone && !f.email) return json({ ok: false, error: 'Please add a phone number or email so we can get back to you.' }, 400);
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return json({ ok: false, error: 'That email address doesn\'t look right.' }, 400);

  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(form.get('cf-turnstile-response'), 4096);
    const ok = token && await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP'));
    if (!ok) return json({ ok: false, error: 'The spam check didn\'t pass. Please refresh the page and try again.' }, 400);
  }

  // Photos
  const files = form.getAll('photos').filter(x => x && typeof x === 'object' && x.size > 0);
  if (files.length > MAX_FILES) return json({ ok: false, error: `Please attach up to ${MAX_FILES} files.` }, 400);
  let total = 0;
  const attachments = [];
  for (const file of files) {
    const type = file.type || EXT_TYPES[(file.name.split('.').pop() || '').toLowerCase()] || '';
    if (!ALLOWED_TYPES.includes(type)) return json({ ok: false, error: 'Photos need to be JPG, PNG, WebP, HEIC or PDF.' }, 400);
    if (file.size > MAX_FILE_BYTES) return json({ ok: false, error: 'Each file needs to be under 8 MB.' }, 400);
    total += file.size;
    if (total > MAX_TOTAL_BYTES) return json({ ok: false, error: 'Files need to be under 20 MB in total.' }, 400);
    const filename = clean(file.name, 100).replace(/[^\w.\- ]/g, '_') || 'photo';
    attachments.push({ filename, content: toBase64(await file.arrayBuffer()) });
  }

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return json({ ok: false, error: 'Our form isn\'t working right now. Please call 022 500 3904.' }, 500);
  }

  const rows = [
    ['Name', f.name], ['Business', f.business], ['Phone', f.phone], ['Email', f.email],
    ['Service', f.service], ['Timeframe', f.when], ['Location', f.location],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v || '-'}`).join('\n') +
    `\n\n${f.message}\n\n${attachments.length ? `${attachments.length} file(s) attached.` : 'No files attached.'}`;
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">` +
    rows.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top"><b>${k}</b></td><td>${esc(v || '-')}</td></tr>`).join('') +
    `</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(f.message)}</p>` +
    `<p style="font-family:Arial,sans-serif;font-size:12px;color:#888">${attachments.length ? attachments.length + ' file(s) attached.' : 'No files attached.'} Sent from the 397graphix.co.nz quote form.</p>`;

  const email = {
    from: env.QUOTE_FROM || '397 Graphix Website <website@397graphix.co.nz>',
    to: [env.QUOTE_TO || 'ryan@397graphix.co.nz'],
    subject: `Quote request: ${f.service || 'General'} - ${f.name}`,
    text,
    html,
  };
  if (f.email) email.reply_to = f.email;
  if (attachments.length) email.attachments = attachments;

  const failed = json({ ok: false, error: 'Sorry, that didn\'t send. Please call 022 500 3904 or email ryan@397graphix.co.nz.' }, 502);
  let r;
  try {
    r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(email),
    });
  } catch (err) {
    console.error('Resend unreachable', err);
    return failed;
  }
  if (!r.ok) {
    console.error('Resend error', r.status, await r.text().catch(() => ''));
    return failed;
  }
  return json({ ok: true });
}
