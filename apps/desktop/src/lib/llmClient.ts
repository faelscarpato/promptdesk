import { LLMProvider, LLMResponse } from '@core/types';

/**
 * Chama LLMs diretamente via fetch (funciona no browser e no Tauri web view).
 * Suporta qualquer provider com API compativel com OpenAI (OpenAI, Groq, Together, Ollama, etc).
 */
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

  const body = JSON.stringify({
    model: provider.model || 'gpt-4o-mini',
    messages: [
      { role: 'user', content: prompt },
    ],
    temperature,
    max_tokens: 4096,
  });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`,
    },
    body,
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
