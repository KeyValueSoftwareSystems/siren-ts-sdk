import { BaseClient } from '../base/client';
import { SirenConfig } from '../common/types';
import { WebhookConfigRequest, WebhookConfigResponse } from './types';

export class WebhookClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Configure webhook for status notifications.
   * @param config Webhook configuration (url, secret)
   * @returns WebhookConfigResponse
   */
  async configureNotifications(config: WebhookConfigRequest): Promise<WebhookConfigResponse> {
    const payload = { webhookConfig: { url: config.url, secret: config.secret } };
    const response = await this.makeRequest<typeof payload, WebhookConfigResponse>(
      'PUT',
      '/api/v1/public/webhooks',
      payload
    );
    if (!response.data) {
      throw new Error('No data returned from webhook configuration response');
    }
    return response.data;
  }

  /**
   * Configure webhook for inbound messages.
   * @param config Webhook configuration (url, secret)
   * @returns WebhookConfigResponse
   */
  async configureInbound(config: WebhookConfigRequest): Promise<WebhookConfigResponse> {
    const payload = { inboundWebhookConfig: { url: config.url, secret: config.secret } };
    const response = await this.makeRequest<typeof payload, WebhookConfigResponse>(
      'PUT',
      '/api/v1/public/webhooks',
      payload
    );
    if (!response.data) {
      throw new Error('No data returned from webhook configuration response');
    }
    return response.data;
  }
} 