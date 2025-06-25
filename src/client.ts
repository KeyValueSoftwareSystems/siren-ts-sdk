import { SirenConfig } from './common/types';
import { TemplateClient } from './template/client';
import { WorkflowClient } from './workflow/client';
import { MessageClient } from './messaging/client';
import { UserClient } from './user/client';
import { WebhookClient } from './webhook/client';

const BASE_URLS = {
  prod: 'https://api.trysiren.io',
  dev: 'https://api.dev.trysiren.io',
};

/**
 * Main SDK client. Provides access to template, workflow, and messaging APIs.
 *
 * @example
 * const client = new SirenClient({ apiToken: 'your-token', env: 'prod' });
 * await client.workflow.trigger(...);
 * await client.template.create(...);
 * await client.message.send(...);
 */
export class SirenClient {
  /** Template-related API methods */
  public template: TemplateClient;
  /** Workflow-related API methods */
  public workflow: WorkflowClient;
  /** Messaging-related API methods */
  public message: MessageClient;
  /** User-related API methods */
  public user: UserClient;
  /**
   * Client for webhook-related operations.
   * @example
   * ```typescript
   * const client = new SirenClient({ apiToken: 'your-api-token' });
   * await client.webhook.configureNotifications({ url: 'https://your.url/webhook' });
   * ```
   */
  public readonly webhook: WebhookClient;

  /**
   * Create a new SirenClient instance.
   * @param config SDK configuration
   */
  constructor(config: SirenConfig) {
    if (!config.apiToken) {
      throw new Error('API token is required');
    }

    // Validate environment if provided
    if (config.env && !(config.env in BASE_URLS)) {
      throw new Error(`Invalid environment '${config.env}'. Must be one of: ${Object.keys(BASE_URLS).join(', ')}`);
    }

    this.template = new TemplateClient(config);
    this.workflow = new WorkflowClient(config);
    this.message = new MessageClient(config);
    this.user = new UserClient(config);
    this.webhook = new WebhookClient(config);
  }
}

/**
 * Factory function for creating a SirenClient instance.
 */
export const createSirenClient = (config: SirenConfig): SirenClient => {
  return new SirenClient(config);
};

export default createSirenClient; 