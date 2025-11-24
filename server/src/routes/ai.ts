import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middleware/auth.js';
import { ValidationError } from '../middleware/errorHandler.js';
import { AIService } from '../services/ai.service.js';
import { GuardrailService } from '../services/guardrail.service.js';

const router = Router();
const aiService = new AIService();
const guardrailService = new GuardrailService();

// Validation schemas
const chatSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'llama', 'none']),
  model: z.string().optional(),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    })
  ),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4096).optional(),
});

/**
 * POST /api/ai/chat
 * Proxy AI chat requests to configured provider
 * Requires authentication and content.approve permission
 */
router.post('/chat', authenticate, authorize('content.approve'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const data = chatSchema.parse(req.body);

    // Apply input guardrails
    const inputValidation = await guardrailService.validateInput(data.messages);
    if (!inputValidation.safe) {
      throw new ValidationError(`Input validation failed: ${inputValidation.reason}`);
    }

    // Call AI service
    const response = await aiService.chat(
      data.provider,
      data.messages,
      {
        model: data.model,
        temperature: data.temperature,
        maxTokens: data.maxTokens,
      }
    );

    // Apply output guardrails
    const outputValidation = await guardrailService.validateOutput(response);
    if (!outputValidation.safe) {
      throw new ValidationError(`Output validation failed: ${outputValidation.reason}`);
    }

    res.json({
      success: true,
      output: response,
      provider: data.provider,
      model: data.model || aiService.getDefaultModel(data.provider),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError(error.errors[0].message));
    } else {
      next(error);
    }
  }
});

/**
 * GET /api/ai/config
 * Get current AI configuration (without secrets)
 */
router.get('/config', authenticate, (_req: Request, res: Response) => {
  res.json({
    success: true,
    config: {
      provider: process.env.AI_PROVIDER || 'none',
      models: {
        openai: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini',
        anthropic: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-haiku-20240307',
        llama: process.env.LLAMA_DEFAULT_MODEL || 'llama-3.1-8b-instruct',
      },
      guardrails: {
        enabled: true,
        deterministicMode: guardrailService.isDeterministicMode(),
      },
    },
  });
});

/**
 * POST /api/ai/validate
 * Validate content against guardrails without making AI call
 */
router.post('/validate', authenticate, authorize('content.approve'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      throw new ValidationError('Content is required and must be a string');
    }

    const validation = await guardrailService.validateContent(content);

    res.json({
      success: true,
      validation,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
