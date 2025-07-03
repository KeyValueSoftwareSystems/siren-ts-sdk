import { BaseClient } from '../base/client';
import { SirenConfig } from '../common/types';
import { SirenValidationError } from '../common/errors';
import {
  ProviderCode,
  ProviderIntegration,
  Recipient,
  SendMessageRequest,
  MessageData,
  StatusData,
  ReplyData
} from './types';

/** Mapping between channel names and recipient field keys */
const CHANNEL_RECIPIENT_KEY: Record<string, keyof Recipient> = {
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  SLACK: 'slack',
  TEAMS: 'teams',
  DISCORD: 'discord',
  LINE: 'line',
  IN_APP: 'inApp',
  PUSH: 'pushToken'
};

export class MessageClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Send a message either using a template or directly.
   * @param recipientValue - Identifier for the recipient (e.g., Slack user ID, email address)
   * @param channel - Channel to send the message through (e.g., "SLACK", "EMAIL")
   * @param body - Optional raw body text (required if no template)
   * @param templateName - Optional template name (required if no body)
   * @param templateVariables - Optional variables for template-based messages
   * @param providerName - Optional provider integration name (must be provided with providerCode)
   * @param providerCode - Optional provider integration code (must be provided with providerName)
   * @param subject - Optional subject line (useful for email messages)
   * @returns Notification ID of the sent message
   */
  async send(
    recipientValue: string,
    channel: string,
    body?: string,
    templateName?: string,
    templateVariables?: Record<string, any>,
    providerName?: string,
    providerCode?: ProviderCode,
    subject?: string
  ): Promise<string> {
    if (!body && !templateName) {
      throw new SirenValidationError('Either body or templateName must be provided');
    }

    if ((providerName !== undefined) !== (providerCode !== undefined)) {
      throw new SirenValidationError('Both providerName and providerCode must be provided together');
    }

    const recipient = this.createRecipient(channel, recipientValue);

    const payload: SendMessageRequest = {
      recipient,
      channel
    };

    if (body) {
      payload.body = body;
    } else if (templateName) {
      payload.template = { name: templateName };
    }

    if (subject) {
      payload.subject = subject;
    }

    if (templateVariables) {
      payload.templateVariables = templateVariables;
    }

    if (providerName && providerCode) {
      payload.providerIntegration = {
        name: providerName,
        code: providerCode
      } as ProviderIntegration;
    }

    const response = await this.makeRequest<SendMessageRequest, MessageData>(
      'POST',
      '/api/v1/public/send-messages',
      payload
    );

    return response.data!.notificationId;
  }

  /**
   * Send a message using an awesome template path/identifier.
   */
  async sendAwesomeTemplate(
    recipientValue: string,
    channel: string,
    templateIdentifier: string,
    templateVariables?: Record<string, any>,
    providerName?: string,
    providerCode?: ProviderCode,
    subject?: string
  ): Promise<string> {
    if ((providerName !== undefined) !== (providerCode !== undefined)) {
      throw new SirenValidationError('Both providerName and providerCode must be provided together');
    }

    const recipient = this.createRecipient(channel, recipientValue);

    const payload: SendMessageRequest = {
      channel,
      templateIdentifier,
      recipient
    };

    if (subject) {
      payload.subject = subject;
    }

    if (templateVariables) {
      payload.templateVariables = templateVariables;
    }

    if (providerName && providerCode) {
      payload.providerIntegration = {
        name: providerName,
        code: providerCode
      } as ProviderIntegration;
    }

    const response = await this.makeRequest<SendMessageRequest, MessageData>(
      'POST',
      '/api/v1/public/send-awesome-messages',
      payload
    );

    return response.data!.notificationId;
  }

  /**
   * Retrieve the status of a specific message.
   */
  async getStatus(messageId: string): Promise<string> {
    const response = await this.makeRequest<null, StatusData>(
      'GET',
      `/api/v1/public/message-status/${messageId}`
    );

    return response.data!.status;
  }

  /**
   * Retrieve replies for a specific message.
   */
  async getReplies(messageId: string): Promise<ReplyData[]> {
    const response = await this.makeRequest<null, ReplyData[]>(
      'GET',
      `/api/v1/public/get-reply/${messageId}`
    );

    return response.data!;
  }

  /**
   * Create the recipient object for the payload based on channel.
   */
  private createRecipient(channel: string, recipientValue: string): Recipient {
    const key = CHANNEL_RECIPIENT_KEY[channel.toUpperCase()];
    if (!key) {
      throw new SirenValidationError(`Unsupported channel: ${channel}`);
    }

    return {
      [key]: recipientValue
    } as Recipient;
  }
} 