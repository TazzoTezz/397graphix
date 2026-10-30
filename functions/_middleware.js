/**
 * Cloudflare Pages Global Middleware — Maintenance Mode Switch (NIST-Hardened)
 *
 * How to toggle Maintenance Mode in Cloudflare (without editing code):
 *   1. Go to Cloudflare Dashboard > Workers & Pages > [Your Project] > Settings > Variables and Secrets
 *   2. Add / Edit variable:
 *        MAINTENANCE_MODE = true               (turns Maintenance Mode ON)
 *        MAINTENANCE_MODE = false              (turns Maintenance Mode OFF)
 *        MAINTENANCE_BYPASS_KEY = <your-secret> (optional secret token for owner preview bypass)
 *
 * Owner Preview Bypass (while Maintenance Mode is ON):
 *   - Visit https://397graphix.co.nz/?bypass=<your-MAINTENANCE_BYPASS_KEY>
 *     to set an HttpOnly Secure cookie that lets you browse the full live site.
 *   - Visit https://397graphix.co.nz/?bypass=off to clear the bypass cookie.
 */

function timingSafeEqualStr(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a.length || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const FALLBACK_MAINTENANCE_HTML = `<!doctype html>
<html lang="en-NZ" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Studio Upgrade in Progress | 397 Graphix</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="icon" type="image/png" href="/assets/img/favicon.png" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #08090C;
      color: #F3F4F6;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-image:
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    header, footer {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: rgba(8, 9, 12, 0.9);
      padding: 1.1rem 1.5rem;
    }
    footer { border-bottom: 0; border-top: 1px solid rgba(255,255,255,0.08); color: #6B7280; font-size: 0.78rem; font-family: monospace; }
    .wrap { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .logo { height: 40px; width: auto; }
    .call-pill {
      display: inline-flex; align-items: center; gap: 0.5rem;
      border: 1px solid rgba(225, 29, 72, 0.55); background: rgba(225, 29, 72, 0.14);
      color: #fff; text-decoration: none; padding: 0.55rem 0.95rem; border-radius: 4px;
      font-family: monospace; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
    }
    .dot { width: 8px; height: 8px; border-radius: 999px; background: #E11D48; display: inline-block; }
    main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem; }
    .card {
      max-width: 660px; width: 100%; background: #11141D; border: 1px solid #2C3342;
      border-radius: 6px; padding: 2.5rem 2rem; text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);
    }
    .badge {
      display: inline-block; border: 1px solid rgba(225, 29, 72, 0.5); background: rgba(225, 29, 72, 0.12);
      color: #F43F5E; font-family: monospace; font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; padding: 0.35rem 0.75rem; border-radius: 3px;
      margin-bottom: 1.25rem;
    }
    h1 { font-size: clamp(1.85rem, 4vw, 2.85rem); font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; line-height: 1.08; }
    h1 span { color: #F43F5E; }
    p { margin-top: 1rem; color: #D1D5DB; font-size: 1rem; line-height: 1.6; }
    .actions { margin-top: 1.75rem; display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center; }
    .btn-primary {
      background: linear-gradient(135deg, #BE123C 0%, #E11D48 100%); color: #fff; text-decoration: none;
      padding: 0.85rem 1.5rem; border-radius: 4px; font-weight: 800; font-size: 0.88rem;
      text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid #FB7185;
    }
    .btn-secondary {
      background: #1A1E29; color: #fff; text-decoration: none;
      padding: 0.85rem 1.5rem; border-radius: 4px; font-weight: 700; font-size: 0.88rem;
      text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid #363E4F;
    }
    .grid {
      margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.65rem;
      text-align: left; font-family: monospace; font-size: 0.78rem;
    }
    .item { background: #0B0D13; border: 1px solid rgba(255,255,255,0.08); padding: 0.65rem 0.75rem; border-radius: 4px; }
    .item b { color: #F43F5E; display: block; margin-bottom: 0.15rem; }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <img src="/assets/img/logo.png" alt="397 Graphix" class="logo" />
      <a href="tel:+64225003904" class="call-pill"><span class="dot"></span> Call Direct: 022 500 3904</a>
    </div>
  </header>
  <main>
    <div class="card">
      <div class="badge">SYSTEM STATUS // STUDIO UPGRADE IN PROGRESS</div>
      <h1>WE’RE TUNING THE <span>DIGITAL STUDIO.</span></h1>
      <p>Our website is temporarily offline while we roll out new interactive vehicle wrap and signage tools. <strong>Our Wellington workshop and install crew are operating as normal.</strong></p>
      <div class="actions">
        <a href="tel:+64225003904" class="btn-primary">Call Ryan: 022 500 3904 &rarr;</a>
        <a href="mailto:ryan@397graphix.co.nz?subject=Quote%20Enquiry%20-%20397%20Graphix" class="btn-secondary">Email: ryan@397graphix.co.nz</a>
      </div>
      <div class="grid">
        <div class="item"><b>// 01</b>Vehicle Wraps</div>
        <div class="item"><b>// 02</b>Fleet Signage</div>
        <div class="item"><b>// 03</b>Window Frosting</div>
        <div class="item"><b>// 04</b>External Signage</div>
        <div class="item"><b>// 05</b>3D Lettering</div>
        <div class="item"><b>// 06</b>LED Light Fixtures</div>
      </div>
    </div>
  </main>
  <footer>
    <div class="wrap">
      <span>&copy; 397 Graphix. All rights reserved.</span>
      <span>Website and IT support provided by <a href="https://synctech.co.nz" target="_blank" rel="noopener noreferrer" style="color:#E5E7EB;text-decoration:underline;font-weight:700;">Sync Tech NZ</a></span>
    </div>
  </footer>
</body>
</html>`;

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 1. Check if Maintenance Mode is enabled via Cloudflare Environment Variable
  const flag = String(env.MAINTENANCE_MODE || '').trim().toLowerCase();
  const isMaintenance = flag === 'true' || flag === '1' || flag === 'on';

  if (!isMaintenance) {
    return next();
  }

  // 2. Always allow static assets (fonts, images, CSS, JS) and API endpoints
  const path = url.pathname;
  if (
    path.startsWith('/assets/') ||
    path.startsWith('/_astro/') ||
    path === '/favicon.ico' ||
    path === '/script.js' ||
    path.startsWith('/api/')
  ) {
    return next();
  }

  // 3. Support Owner Preview Bypass via secret env.MAINTENANCE_BYPASS_KEY (defaults to '397' if not customized)
  const bypassSecret = String(env.MAINTENANCE_BYPASS_KEY || '397').trim();
  const bypassParam = url.searchParams.get('bypass');
  const cookieHeader = request.headers.get('Cookie') || '';
  const isHttps = url.protocol === 'https:';
  const secureFlag = isHttps ? '; Secure' : '';

  const safePath = '/' + url.pathname.replace(/^\/+/, '');

  if (bypassParam === 'off') {
    url.searchParams.delete('bypass');
    return new Response(null, {
      status: 302,
      headers: {
        Location: safePath + url.search,
        'Set-Cookie': `397_bypass=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secureFlag}`,
        'Cache-Control': 'no-store',
      },
    });
  }

  if (bypassSecret && bypassParam && timingSafeEqualStr(bypassParam, bypassSecret)) {
    url.searchParams.delete('bypass');
    return new Response(null, {
      status: 302,
      headers: {
        Location: safePath + url.search,
        'Set-Cookie': `397_bypass=${encodeURIComponent(bypassSecret)}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax${secureFlag}`,
        'Cache-Control': 'no-store',
      },
    });
  }

  if (bypassSecret) {
    const match = cookieHeader.match(/(?:^|;\s*)397_bypass=([^;]+)/);
    if (match) {
      try {
        const cookieVal = decodeURIComponent(match[1]);
        if (timingSafeEqualStr(cookieVal, bypassSecret)) {
          return next();
        }
      } catch {
        // Ignore malformed cookie
      }
    }
  }

  // 4. Try fetching the compiled Astro /maintenance page; if redirected or empty, use the built-in HTML
  let htmlBody = '';
  for (const candidate of ['/maintenance/', '/maintenance.html', '/maintenance/index.html']) {
    try {
      const target = new URL(candidate, request.url);
      const res = await env.ASSETS.fetch(new Request(target.toString(), { method: 'GET' }));
      if (res && res.ok) {
        const text = await res.text();
        if (text && text.length > 200) {
          htmlBody = text;
          break;
        }
      }
    } catch {
      // Fall through to next candidate
    }
  }

  if (!htmlBody) {
    htmlBody = FALLBACK_MAINTENANCE_HTML;
  }

  return new Response(htmlBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  });
}
