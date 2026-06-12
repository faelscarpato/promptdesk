/**
 * Cloudflare Worker — Proxy universal para LLMs sem CORS
 * Deploy: wrangler deploy (em apps/proxy)
 *
 * Uso pelo frontend:
 *   baseUrl = https://llm-proxy.<seu-subdominio>.workers.dev
 *   O worker repassa para o provider real usando o header X-Target-URL
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Target-URL',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request: Request): Promise<Response> {
    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Destino real vem no header X-Target-URL
    const targetUrl = request.headers.get('X-Target-URL');
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'Header X-Target-URL ausente.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    // Clona headers, remove o X-Target-URL, mantem Authorization etc
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key.toLowerCase() !== 'x-target-url' && key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    }

    try {
      const upstream = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.method !== 'GET' ? request.body : undefined,
      });

      // Repassa resposta com headers CORS
      const response = new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: {
          ...Object.fromEntries(upstream.headers.entries()),
          ...CORS_HEADERS,
        },
      });

      return response;
    } catch (err) {
      return new Response(
        JSON.stringify({ error: `Proxy error: ${err}` }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
  },
};
