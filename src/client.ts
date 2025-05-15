import { SirenConfig } from './common/types';
import { TemplateClient } from './template/client';
import { WorkflowClient } from './workflow/client';

/**
 * Main SDK client. Provides access to template and workflow APIs.
 *
 * @example
 * const client = new SirenClient({ apiToken: 'your-token', env: 'prod' });
 * await client.workflow.triggerWorkflow(...);
 * await client.template.createTemplate(...);
 */
export class SirenClient {
  /** Template-related API methods */
  public template: TemplateClient;
  /** Workflow-related API methods */
  public workflow: WorkflowClient;

  /**
   * Create a new SirenClient instance.
   * @param config SDK configuration
   */
  constructor(config: SirenConfig) {
    if (!config.apiToken) {
      throw new Error('API token is required');
    }
    this.template = new TemplateClient(config);
    this.workflow = new WorkflowClient(config);
  }
}

/**
 * Factory function for creating a SirenClient instance.
 */
export const createSirenClient = (config: SirenConfig): SirenClient => {
  return new SirenClient(config);
};

export default createSirenClient; 