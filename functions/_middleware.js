/**
 * Cloudflare Pages Global Middleware — Maintenance Mode Switch
 *
 * How to toggle Maintenance Mode in Cloudflare (without editing code):
 *   1. Go to Cloudflare Dashboard > Workers & Pages > [Your Project] > Settings > Variables and Secrets
 *   2. Add / Edit variable:
 *        MAINTENANCE_MODE = true     (turns Maintenance Mode ON)
 *        MAINTENANCE_MODE = false    (turns Maintenance Mode OFF)
 *   3. Trigger a quick retry/redeploy or preview—when MAINTENANCE_MODE is "true", all visitors
 *      see the branded /maintenance page with a 503 status (preserving your Google SEO rankings).
 *
 * Owner Preview Bypass (while Maintenance Mode is ON):
 *   - Visit https://397graphix.co.nz/?bypass=397 (or set a custom MAINTENANCE_BYPASS_KEY in Cloudflare)
 *     to set a browser cookie that lets you browse the full live site while the public sees the
 *     maintenance screen.
 *   - Visit https://397graphix.co.nz/?bypass=off to clear the bypass cookie and view the maintenance screen.
 */

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 1. Check if Maintenance Mode is enabled via Cloudflare Environment Variable
  const flag = String(env.MAINTENANCE_MODE || '').trim().toLowerCase();
  const isMaintenance = flag === 'true' || flag === '1' || flag === 'on';

  if (!isMaintenance) {
    return next();
  }

  // 2. Always allow static assets (fonts, images, CSS, JS) and the /maintenance asset itself
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

  // 3. Support Owner Preview Bypass via ?bypass=397 (or custom env.MAINTENANCE_BYPASS_KEY)
  const bypassSecret = String(env.MAINTENANCE_BYPASS_KEY || '397').trim();
  const bypassParam = url.searchParams.get('bypass');
  const cookieHeader = request.headers.get('Cookie') || '';

  if (bypassParam === 'off') {
    url.searchParams.delete('bypass');
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.pathname + url.search,
        'Set-Cookie': '397_bypass=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
      },
    });
  }

  if (bypassParam && bypassParam === bypassSecret) {
    url.searchParams.delete('bypass');
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.pathname + url.search,
        'Set-Cookie': '397_bypass=1; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax',
      },
    });
  }

  if (cookieHeader.includes('397_bypass=1')) {
    return next();
  }

  // 4. Fetch and return the branded /maintenance page with HTTP 503 (SEO-safe temporary maintenance)
  const maintenanceUrl = new URL('/maintenance', request.url);
  const maintenanceResponse = await env.ASSETS.fetch(new Request(maintenanceUrl.toString(), request));

  return new Response(maintenanceResponse.body, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Retry-After': '3600',
    },
  });
}

