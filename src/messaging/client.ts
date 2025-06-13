import { BaseClient } from '../base/client';
import { SirenConfig } from '../common/types';
import {
  MessageRepliesResponse,
  MessageStatusResponse,
  ReplyData,
  SendMessageRequest,
  SendMessageResponse,
} from './types';

export class MessageClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Send a message using a specific template.
   * @param templateName - The name of the template to use
   * @param channel - The channel to send the message through (e.g., "SLACK", "EMAIL")
   * @param recipientType - The type of recipient (e.g., "direct")
   * @param recipientValue - The identifier for the recipient (e.g., Slack user ID, email address)
   * @param templateVariables - Optional dictionary of variables to populate the template
   * @returns The message ID of the sent message
   */
  async send(
    templateName: string,
    channel: string,
    recipientType: string,
    recipientValue: string,
    templateVariables?: Record<string, any>
  ): Promise<string> {
    const payload: SendMessageRequest = {
      template: { name: templateName },
      recipient: { type: recipientType, value: recipientValue },
      channel,
    };

    if (templateVariables) {
      payload.templateVariables = templateVariables;
    }

    const response = await this.makeRequest<SendMessageRequest, SendMessageResponse>(
      'POST',
      '/api/v1/public/send-messages',
      payload
    );

    return response.data.notificationId;
  }

  /**
   * Retrieve the status of a specific message.
   * @param messageId - The ID of the message for which to retrieve the status
   * @returns The status of the message (e.g., "DELIVERED", "PENDING")
   */
  async getStatus(messageId: string): Promise<string> {
    const response = await this.makeRequest<null, MessageStatusResponse>(
      'GET',
      `/api/v1/public/message-status/${messageId}`
    );

    return response.data.status;
  }

  /**
   * Retrieve replies for a specific message.
   * @param messageId - The ID of the message for which to retrieve replies
   * @returns A list of reply objects containing message details
   */
  async getReplies(messageId: string): Promise<ReplyData[]> {
    const response = await this.makeRequest<null, MessageRepliesResponse>(
      'GET',
      `/api/v1/public/get-reply/${messageId}`
    );

    return response.data;
  }
} 