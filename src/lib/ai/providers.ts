export type AIProvider = 'none' | 'openai' | 'anthropic' | 'llama'

export interface AIConfig {
  provider: AIProvider
  model?: string
  apiBaseUrl?: string
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIClient {
  name: AIProvider
  model?: string
  chat(messages: AIMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<string>
}

class NoopClient implements AIClient {
  name: AIProvider = 'none'
  async chat() { return Promise.resolve('AI not configured. Using mock output.') }
}

export function createAIClient(config: AIConfig): AIClient {
  switch (config.provider) {
    case 'openai':
      // Integrate server-side via OpenAI REST; keep frontend free of secrets.
      return {
        name: 'openai',
        model: config.model || 'gpt-4o-mini',
        async chat(messages) {
          // Forward to backend API route (to be implemented) to avoid exposing keys.
          const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'openai', model: this.model, messages })
          })
          const data = await res.json().catch(() => ({}))
          return data.output || ''
        }
      }
    case 'anthropic':
      return {
        name: 'anthropic',
        model: config.model || 'claude-3-haiku',
        async chat(messages) {
          const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'anthropic', model: this.model, messages })
          })
          const data = await res.json().catch(() => ({}))
          return data.output || ''
        }
      }
    case 'llama':
      return {
        name: 'llama',
        model: config.model || 'llama-3.1-8b-instruct',
        async chat(messages) {
          // Expect an OpenAI-compatible local endpoint (e.g., llama.cpp/ollama or vLLM)
          const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'llama', model: this.model, messages })
          })
          const data = await res.json().catch(() => ({}))
          return data.output || ''
        }
      }
    default:
      return new NoopClient()
  }
}

// Helper to load config from window or a runtime config endpoint.
export function loadAIConfig(): AIConfig {
  const w = globalThis as any
  const cfg = (w.__AI_CONFIG__ as AIConfig) || { provider: 'none' as AIProvider }
  return cfg
}
