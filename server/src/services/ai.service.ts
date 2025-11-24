import { logger } from '../utils/logger.js';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export type AIProvider = 'openai' | 'anthropic' | 'llama' | 'none';

/**
 * AI Service
 * Provides unified interface to multiple AI providers
 * Supports OpenAI, Anthropic, and local Llama models
 */
export class AIService {
  private provider: AIProvider;

  constructor() {
    this.provider = (process.env.AI_PROVIDER as AIProvider) || 'none';
  }

  /**
   * Send chat request to AI provider
   */
  async chat(
    provider: AIProvider,
    messages: AIMessage[],
    options: AIOptions = {}
  ): Promise<string> {
    // Use specified provider or default
    const selectedProvider = provider !== 'none' ? provider : this.provider;

    logger.info(`AI chat request to ${selectedProvider}`, {
      messageCount: messages.length,
      model: options.model,
    });

    switch (selectedProvider) {
      case 'openai':
        return this.chatOpenAI(messages, options);
      case 'anthropic':
        return this.chatAnthropic(messages, options);
      case 'llama':
        return this.chatLlama(messages, options);
      default:
        return 'AI provider not configured. Please set AI_PROVIDER environment variable.';
    }
  }

  /**
   * OpenAI chat integration
   */
  private async chatOpenAI(messages: AIMessage[], options: AIOptions): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const model = options.model || process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    try {
      const response = await fetch(`${apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error('OpenAI API error', { status: response.status, error });
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('OpenAI chat error', { error });
      throw error;
    }
  }

  /**
   * Anthropic chat integration
   */
  private async chatAnthropic(messages: AIMessage[], options: AIOptions): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const apiBase = process.env.ANTHROPIC_API_BASE || 'https://api.anthropic.com';
    const model = options.model || process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-haiku-20240307';

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    try {
      // Convert messages format for Anthropic
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const conversationMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch(`${apiBase}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          system: systemMessage,
          messages: conversationMessages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error('Anthropic API error', { status: response.status, error });
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.content[0]?.text || '';
    } catch (error) {
      logger.error('Anthropic chat error', { error });
      throw error;
    }
  }

  /**
   * Local Llama chat integration (OpenAI-compatible endpoint)
   * Supports llama.cpp, ollama, vLLM, and other OpenAI-compatible local servers
   */
  private async chatLlama(messages: AIMessage[], options: AIOptions): Promise<string> {
    const apiBase = process.env.LLAMA_API_BASE || 'http://localhost:8000/v1';
    const apiKey = process.env.LLAMA_API_KEY || 'not-needed';
    const model = options.model || process.env.LLAMA_DEFAULT_MODEL || 'llama-3.1-8b-instruct';

    try {
      const response = await fetch(`${apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error('Llama API error', { status: response.status, error });
        throw new Error(`Llama API error: ${response.status}. Make sure your local LLM server is running.`);
      }

      const data = await response.json() as any;
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Llama chat error', { error });
      throw error;
    }
  }

  /**
   * Get default model for provider
   */
  getDefaultModel(provider: AIProvider): string {
    switch (provider) {
      case 'openai':
        return process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini';
      case 'anthropic':
        return process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-haiku-20240307';
      case 'llama':
        return process.env.LLAMA_DEFAULT_MODEL || 'llama-3.1-8b-instruct';
      default:
        return 'none';
    }
  }
}
