import { logger } from '../utils/logger.js';

export interface RegulatoryReference {
  authority: string;
  document: string;
  section: string;
  effectiveDate: string;
  url: string;
}

export interface DraftContent {
  id: string;
  moduleId: string;
  changeType: 'update' | 'new' | 'deprecation';
  content: string;
  rationale: string;
  regulatoryTrigger: RegulatoryReference;
  status: 'pending-review' | 'approved' | 'rejected';
  generatedAt: string;
  sources: Array<{ label: string; url: string }>;
}

/**
 * RegWatch Service
 * Monitors regulatory authority websites for updates
 * Generates draft content proposals based on regulatory changes
 */
export class RegWatchService {
  private enabled: boolean;
  private intervalHours: number;
  private authorities: string[];
  private monitoringTimer?: NodeJS.Timeout;

  // Mock updates for demonstration (replace with actual web scraping/API calls)
  private readonly MOCK_UPDATES: RegulatoryReference[] = [
    {
      authority: 'FDA',
      document: 'Data Integrity and Compliance with Drug CGMP — Update 2025',
      section: 'Guidance',
      effectiveDate: new Date().toISOString(),
      url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/data-integrity-and-compliance-drug-cgmp',
    },
    {
      authority: 'ICH',
      document: 'E6(R3) Good Clinical Practice — Draft for Consultation',
      section: 'Concept Paper',
      effectiveDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.ich.org/page/efficacy-guidelines',
    },
    {
      authority: 'EMA',
      document: 'GVP Module IX — Signal Management Amendment 2025',
      section: 'Module IX',
      effectiveDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.ema.europa.eu/en/human-regulatory/post-authorisation/pharmacovigilance',
    },
  ];

  constructor() {
    this.enabled = process.env.REGWATCH_ENABLED === 'true';
    this.intervalHours = parseInt(process.env.REGWATCH_INTERVAL_HOURS || '24');
    this.authorities = (process.env.REGWATCH_AUTHORITIES || '').split(',').map(a => a.trim());
    
    if (this.enabled) {
      logger.info('RegWatch service initialized', {
        intervalHours: this.intervalHours,
        authorities: this.authorities,
      });
    }
  }

  /**
   * Start monitoring regulatory authorities
   */
  startMonitoring(onUpdate: (draft: DraftContent) => void): void {
    if (!this.enabled) {
      logger.warn('RegWatch monitoring is disabled');
      return;
    }

    logger.info('Starting RegWatch monitoring');

    // Run initial check
    this.checkForUpdates(onUpdate);

    // Schedule periodic checks
    this.monitoringTimer = setInterval(
      () => this.checkForUpdates(onUpdate),
      this.intervalHours * 60 * 60 * 1000
    );
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = undefined;
      logger.info('RegWatch monitoring stopped');
    }
  }

  /**
   * Check for regulatory updates
   */
  private async checkForUpdates(onUpdate: (draft: DraftContent) => void): Promise<void> {
    logger.info('Checking for regulatory updates');

    try {
      // TODO: Implement actual web scraping/API integration
      // For now, using mock data
      const updates = await this.fetchRegulatoryUpdates();

      for (const update of updates) {
        const draft = this.generateDraftFromUpdate(update);
        onUpdate(draft);
      }

      logger.info(`Found ${updates.length} regulatory updates`);
    } catch (error) {
      logger.error('Error checking for regulatory updates', { error });
    }
  }

  /**
   * Fetch regulatory updates from authority websites
   * TODO: Implement actual web scraping or API integration for:
   * - FDA: https://www.fda.gov/regulatory-information/search-fda-guidance-documents
   * - EMA: https://www.ema.europa.eu/en/human-regulatory
   * - ICH: https://www.ich.org/page/efficacy-guidelines
   * - PMDA: https://www.pmda.go.jp/english/
   * - MHRA: https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency
   * - CDSCO: https://cdsco.gov.in/
   * - Health Canada: https://www.canada.ca/en/health-canada.html
   */
  private async fetchRegulatoryUpdates(): Promise<RegulatoryReference[]> {
    // Mock implementation - replace with actual API calls or web scraping
    return this.MOCK_UPDATES.filter(update =>
      this.authorities.length === 0 || this.authorities.includes(update.authority)
    );
  }

  /**
   * Generate draft content from regulatory update
   */
  private generateDraftFromUpdate(ref: RegulatoryReference): DraftContent {
    const id = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    // Map authority to module domain
    const moduleId = this.mapAuthorityToModule(ref.authority);

    const content = this.generateUpdateContent(ref);
    const rationale = `Regulatory trigger: ${ref.authority} — ${ref.document} (${ref.section}). Training should be updated to ensure alignment with clarified expectations, effective on ${new Date(ref.effectiveDate).toDateString()}.`;

    return {
      id,
      moduleId,
      changeType: 'update',
      content,
      rationale,
      regulatoryTrigger: ref,
      status: 'pending-review',
      generatedAt: new Date().toISOString(),
      sources: [
        { label: `${ref.authority}: ${ref.document}`, url: ref.url },
      ],
    };
  }

  /**
   * Generate detailed update content
   */
  private generateUpdateContent(ref: RegulatoryReference): string {
    return [
      `Update overview: Incorporate latest ${ref.authority} update — ${ref.document} (${ref.section}).`,
      '',
      'Curriculum changes:',
      '- Add a new slide explaining the update scope, applicability, and effective date.',
      '- Revise the "key controls" section to include specific expectations clarified by the update.',
      '- Include a short scenario-based interactive exercise demonstrating compliant vs non-compliant practice.',
      '- Add a checklist for day-to-day execution aligned to the updated guidance.',
      '',
      'Learning objectives to add/refine:',
      '- Learner can summarize the update and identify impacted processes.',
      '- Learner can apply the updated control expectations to a realistic case.',
      '- Learner can locate the relevant SOP/work instruction section(s) reflecting the update.',
      '',
      'Assessment adjustments:',
      '- Add 2 knowledge-check questions targeting the updated expectation language.',
      '- Add 1 scenario question that tests decision-making under the new guidance.',
      '',
      `Primary source: ${ref.url}`,
    ].join('\n');
  }

  /**
   * Map regulatory authority to target module
   */
  private mapAuthorityToModule(authority: string): string {
    const authorityModuleMap: Record<string, string[]> = {
      'FDA': ['mod-003', 'mod-005', 'mod-006'], // GMP, QA, Clinical Ops
      'EMA': ['mod-002', 'mod-006'], // Pharmacovigilance, Clinical Ops
      'ICH': ['mod-001', 'mod-004', 'mod-006'], // GCP, Regulatory Affairs, Clinical Ops
      'PMDA': ['mod-004'], // Regulatory Affairs
      'MHRA': ['mod-002', 'mod-003'], // Pharmacovigilance, GMP
      'CDSCO': ['mod-003', 'mod-004'], // GMP, Regulatory Affairs
      'Health Canada': ['mod-002', 'mod-004'], // Pharmacovigilance, Regulatory Affairs
    };

    const modules = authorityModuleMap[authority] || ['mod-001'];
    return modules[0]; // Return first matching module
  }

  /**
   * Manual check for updates (on-demand)
   */
  async checkNow(): Promise<DraftContent[]> {
    logger.info('Manual regulatory update check triggered');
    
    const updates = await this.fetchRegulatoryUpdates();
    return updates.map(update => this.generateDraftFromUpdate(update));
  }
}
