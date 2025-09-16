import { BaseClient } from '../base/client';
import { SirenConfig } from '../common/types';
import {
  ChatMessageRequest,
  ChatMessageResponse,
  ChatEndRequest,
} from './types';

export class ChatClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Send a chat message.
   * @param messageData Message attributes matching the ChatMessageRequest interface fields.
   * @returns A ChatMessageResponse object.
   */
  async message(messageData: ChatMessageRequest): Promise<ChatMessageResponse> {
    if (messageData.templateId && (messageData.body || messageData.subject)) {
      throw new Error('Cannot provide both templateId and body/subject.');
    }
    if (!messageData.templateId && !messageData.body) {
      throw new Error('Either templateId or body must be provided.');
    }

    const response = await this.makeRequest<ChatMessageRequest, ChatMessageResponse>(
      'POST',
      '/api/v1/chat/message',
      messageData
    );
    return response.data as ChatMessageResponse;
  }

  /**
   * End a chat.
   * @param endData End chat attributes matching the ChatEndRequest interface fields.
   * @returns True if the chat was successfully ended.
   */
  async end(endData: ChatEndRequest): Promise<boolean> {
    await this.makeRequest<ChatEndRequest, undefined>(
      'POST',
      '/api/v1/chat/end',
      endData
    );
    return true;
  }
}
