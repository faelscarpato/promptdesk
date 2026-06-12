import { LLMProvider, LLMResponse } from '@core/types';

/**
 * URL do Cloudflare Worker proxy (resolve CORS de providers como NVIDIA NIM).
 * Defina a variavel de ambiente VITE_PROXY_URL no Cloudflare Pages
 * apontando para o worker: https://llm-proxy.<subdominio>.workers.dev
 *
 * Se nao definida, tenta chamada direta (funciona para OpenAI, Groq, Together que tem CORS).
 */
const PROXY_URL = (import.meta as any).env?.VITE_PROXY_URL as string | undefined;

/**
 * Providers que tem CORS aberto — chamada direta sem proxy.
 */
const DIRECT_ORIGINS = [
  'api.openai.com',
  'api.groq.com',
  'api.together.xyz',
  'api.mistral.ai',
  'openrouter.ai',
];

function needsProxy(baseUrl: string): boolean {
  if (!PROXY_URL) return false;
  try {
    const host = new URL(baseUrl).hostname;
    return !DIRECT_ORIGINS.some(o => host.includes(o));
  } catch {
    return false;
  }
}

export async function callLLM(
  provider: LLMProvider,
  prompt: string,
  temperature: number = 0.7
): Promise<LLMResponse> {
  if (!provider?.apiKey) {
    throw new Error('Nenhuma API Key configurada. Vá em Configurações e adicione um provedor.');
  }

  const baseUrl = (provider.baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '');
  const endpoint = `${baseUrl}/chat/completions`;
  const useProxy = needsProxy(baseUrl);

  const fetchUrl     = useProxy ? PROXY_URL! : endpoint;
  const extraHeaders = useProxy ? { 'X-Target-URL': endpoint } : {};

  const res = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model: provider.model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erro do provedor (${res.status}): ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? '',
    tokens_used: data.usage?.total_tokens ?? 0,
  };
}
