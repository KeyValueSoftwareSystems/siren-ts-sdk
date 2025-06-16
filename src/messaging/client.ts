import { BaseClient } from '../base/client';
import { SirenConfig } from '../common/types';
import { SirenValidationError } from '../common/errors';
import {
  RecipientType,
  ReplyData,
  SendMessageRequest,
  MessageData,
  StatusData
} from './types';

export class MessageClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Send a message either using a template or directly.
   * @param recipientType - The type of recipient ("user_id" or "direct")
   * @param recipientValue - The identifier for the recipient (e.g., Slack user ID, email address)
   * @param channel - The channel to send the message through (e.g., "SLACK", "EMAIL")
   * @param body - Optional message body text (required if no template)
   * @param templateName - Optional template name (required if no body)
   * @param templateVariables - Optional template variables for template-based messages
   * @returns The notification ID of the sent message
   */
  async send(
    recipientType: RecipientType,
    recipientValue: string,
    channel: string,
    body?: string,
    templateName?: string,
    templateVariables?: Record<string, any>
  ): Promise<string> {
    if (!body && !templateName) {
      throw new SirenValidationError('Either body or templateName must be provided');
    }

    const payload: SendMessageRequest = {
      recipient: {
        type: recipientType,
        value: recipientValue
      },
      channel
    };

    if (body) {
      payload.body = body;
    } else if (templateName) {
      payload.template = { name: templateName };
    if (templateVariables) {
      payload.templateVariables = templateVariables;
      }
    }

    const response = await this.makeRequest<SendMessageRequest, MessageData>(
      'POST',
      '/api/v1/public/send-messages',
      payload
    );
    return response.data!.notificationId;
  }

  /**
   * Retrieve the status of a specific message.
   * @param messageId - The ID of the message for which to retrieve the status
   * @returns The status of the message (e.g., "DELIVERED", "PENDING")
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
   * @param messageId - The ID of the message for which to retrieve replies
   * @returns A list of reply objects containing message details
   */
  async getReplies(messageId: string): Promise<ReplyData[]> {
    const response = await this.makeRequest<null, ReplyData[]>(
      'GET',
      `/api/v1/public/get-reply/${messageId}`
    );
    return response.data!;
  }
} 