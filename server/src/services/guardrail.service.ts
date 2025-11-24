import { logger } from '../utils/logger.js';
import { AIMessage } from './ai.service.js';

export interface ValidationResult {
  safe: boolean;
  reason?: string;
  issues?: string[];
}

/**
 * Guardrail Service
 * Implements deterministic and AI-based safety checks for content validation
 * Ensures GxP compliance and regulatory safety
 */
export class GuardrailService {
  private deterministicMode: boolean;
  
  // Regulatory authority keywords for content validation
  // Threshold for keyword matching (20% of domain keywords must match)
  private readonly KEYWORD_MATCH_THRESHOLD = 0.2;
  private readonly REGULATORY_DOMAINS = [
    'fda.gov',
    'ema.europa.eu',
    'europa.eu',
    'canada.ca',
    'hc-sc.gc.ca',
    'pmda.go.jp',
    'gov.uk',
    'mhra.gov.uk',
    'cdsco.gov.in',
    'nha.gov.in',
    'ich.org',
  ];

  // Prohibited content patterns
  private readonly PROHIBITED_PATTERNS = [
    /\b(confidential|proprietary|trade secret)\b/i,
    /\b(password|api[_\s-]?key|secret[_\s-]?key|token)\b/i,
    /\b(patient[_\s-]?data|phi|pii|personal[_\s-]?information)\b/i,
  ];

  // Required regulatory keywords for content validation
  private readonly REGULATORY_KEYWORDS = {
    gcp: ['consent', 'investigator', 'irb', 'iec', 'clinical trial', 'good clinical practice'],
    gmp: ['capa', 'deviation', 'batch', 'alcoa', 'manufacturing', 'quality'],
    pharmacovigilance: ['adverse event', 'signal', 'meddra', 'safety', 'pv'],
    regulatory: ['submission', 'ctd', 'ectd', 'regulatory affairs'],
  };

  constructor() {
    // Enable deterministic mode for critical validations
    this.deterministicMode = process.env.GUARDRAIL_DETERMINISTIC === 'true';
  }

  /**
   * Validate input messages before sending to AI
   */
  async validateInput(messages: AIMessage[]): Promise<ValidationResult> {
    const issues: string[] = [];

    // Check for empty messages
    if (!messages || messages.length === 0) {
      return { safe: false, reason: 'No messages provided' };
    }

    // Check each message
    for (const message of messages) {
      // Check for prohibited patterns
      for (const pattern of this.PROHIBITED_PATTERNS) {
        if (pattern.test(message.content)) {
          issues.push(`Message contains prohibited content: ${pattern.source}`);
        }
      }

      // Check message length
      if (message.content.length > 10000) {
        issues.push('Message exceeds maximum length (10000 characters)');
      }

      // Check for malicious patterns
      if (this.containsMaliciousContent(message.content)) {
        issues.push('Message contains potentially malicious content');
      }
    }

    if (issues.length > 0) {
      logger.warn('Input validation failed', { issues });
      return { safe: false, reason: issues[0], issues };
    }

    return { safe: true };
  }

  /**
   * Validate AI output before returning to client
   */
  async validateOutput(output: string): Promise<ValidationResult> {
    const issues: string[] = [];

    // Check for empty output
    if (!output || output.trim().length === 0) {
      return { safe: false, reason: 'Empty output' };
    }

    // Check for prohibited patterns
    for (const pattern of this.PROHIBITED_PATTERNS) {
      if (pattern.test(output)) {
        issues.push(`Output contains prohibited content: ${pattern.source}`);
      }
    }

    // Check for malicious content
    if (this.containsMaliciousContent(output)) {
      issues.push('Output contains potentially malicious content');
    }

    // Check output length
    if (output.length > 50000) {
      issues.push('Output exceeds maximum length');
    }

    if (issues.length > 0) {
      logger.warn('Output validation failed', { issues });
      return { safe: false, reason: issues[0], issues };
    }

    return { safe: true };
  }

  /**
   * Validate regulatory content for compliance
   */
  async validateContent(content: string): Promise<ValidationResult> {
    const issues: string[] = [];

    // Deterministic validation: Check for regulatory URLs
    const urls = this.extractUrls(content);
    for (const url of urls) {
      if (!this.isValidRegulatoryUrl(url)) {
        issues.push(`URL ${url} is not from a recognized regulatory authority`);
      }
    }

    // Check for minimum content quality
    if (content.length < 100) {
      issues.push('Content too short to be meaningful');
    }

    // Check for regulatory context
    const hasRegulatoryContext = this.hasRegulatoryKeywords(content);
    if (!hasRegulatoryContext) {
      issues.push('Content lacks regulatory context or keywords');
    }

    if (issues.length > 0) {
      return { safe: false, reason: issues[0], issues };
    }

    return { safe: true };
  }

  /**
   * Deterministic check for malicious content
   */
  private containsMaliciousContent(text: string): boolean {
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on(load|error|click)=/i,
      /\beval\s*\(/i,
      /\bexec\s*\(/i,
    ];

    return maliciousPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Extract URLs from text
   */
  private extractUrls(text: string): string[] {
    const urlPattern = /https?:\/\/[^\s]+/gi;
    return text.match(urlPattern) || [];
  }

  /**
   * Validate if URL is from a recognized regulatory authority
   */
  private isValidRegulatoryUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return this.REGULATORY_DOMAINS.some(domain => 
        urlObj.hostname.includes(domain)
      );
    } catch {
      return false;
    }
  }

  /**
   * Check if content contains regulatory keywords
   */
  private hasRegulatoryKeywords(content: string): boolean {
    const contentLower = content.toLowerCase();
    
    for (const domain of Object.values(this.REGULATORY_KEYWORDS)) {
      const matchCount = domain.filter(keyword => 
        contentLower.includes(keyword.toLowerCase())
      ).length;
      
      // Require at least KEYWORD_MATCH_THRESHOLD keyword match in any domain
      if (matchCount >= Math.ceil(domain.length * this.KEYWORD_MATCH_THRESHOLD)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if deterministic mode is enabled
   */
  isDeterministicMode(): boolean {
    return this.deterministicMode;
  }

  /**
   * Validate draft content against guardrails (from frontend)
   */
  async validateDraft(draft: {
    moduleId: string;
    content: string;
    rationale: string;
    regulatoryTrigger: {
      authority: string;
      document: string;
      url: string;
      effectiveDate: string;
    };
  }): Promise<ValidationResult> {
    const issues: string[] = [];

    // Validate source URL
    if (!this.isValidRegulatoryUrl(draft.regulatoryTrigger.url)) {
      issues.push('Source URL is not from a recognized regulatory authority');
    }

    // Validate effective date
    const effectiveDate = new Date(draft.regulatoryTrigger.effectiveDate);
    if (isNaN(effectiveDate.getTime())) {
      issues.push('Invalid effective date');
    }

    // Validate content length
    if (draft.content.length < 40) {
      issues.push('Content too short to be actionable');
    }

    // Validate rationale
    if (draft.rationale.length < 20) {
      issues.push('Rationale is insufficient');
    }

    // Check for regulatory context
    const hasContext = this.hasRegulatoryKeywords(
      `${draft.content} ${draft.rationale} ${draft.regulatoryTrigger.document}`
    );
    if (!hasContext) {
      issues.push('Draft may not align with regulatory subject matter');
    }

    if (issues.length > 0) {
      return { safe: false, reason: issues[0], issues };
    }

    return { safe: true };
  }
}
