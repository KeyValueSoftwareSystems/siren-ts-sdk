import { ChatClient } from './client';
import { ChatMessageRequest, ChatEndRequest } from './types';

const API_TOKEN = 'test_api_key';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('ChatClient', () => {
  let client: ChatClient;

  beforeEach(() => {
    client = new ChatClient({ apiToken: API_TOKEN, baseUrl: BASE_URL });
  });

  describe('message', () => {
    it('should send a chat message with a template successfully', async () => {
      const messageData: ChatMessageRequest = {
        chatNodeId: 'chat_Dr-CrE',
        workflowExecutionId: '78713239-9b84-48f1-8f71-8b260255882d',
        templateId: '07e9fef6-7f04-4269-9d2f-d019ec92fd7f',
        templateVariables: {
          data: 'Hello',
          attach: 'asd',
          attachdata: 'asd',
        },
      };

      const mockResponse = {
        data: {
          messageId: 'msg_123',
          status: 'SENT',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.message(messageData);

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/chat/message`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(messageData),
        })
      );
    });

    it('should send a chat message with a body and subject successfully', async () => {
      const messageData: ChatMessageRequest = {
        chatNodeId: 'chat_Dr-CrE',
        workflowExecutionId: '78713239-9b84-48f1-8f71-8b260255882d',
        body: 'Do you approve this action?',
        subject: 'subject',
      };

      const mockResponse = {
        data: {
          messageId: 'msg_456',
          status: 'SENT',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.message(messageData);

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/chat/message`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(messageData),
        })
      );
    });

    it('should throw an error if both templateId and body/subject are provided', async () => {
      const messageData: ChatMessageRequest = {
        chatNodeId: 'chat_Dr-CrE',
        workflowExecutionId: '78713239-9b84-48f1-8f71-8b260255882d',
        templateId: '07e9fef6-7f04-4269-9d2f-d019ec92fd7f',
        body: 'Do you approve this action?',
      };

      await expect(client.message(messageData)).rejects.toThrow(
        'Cannot provide both templateId and body/subject.'
      );
    });

    it('should throw an error if neither templateId nor body are provided', async () => {
      const messageData: ChatMessageRequest = {
        chatNodeId: 'chat_Dr-CrE',
        workflowExecutionId: '78713239-9b84-48f1-8f71-8b260255882d',
      };

      await expect(client.message(messageData)).rejects.toThrow(
        'Either templateId or body must be provided.'
      );
    });
  });

  describe('end', () => {
    it('should end a chat successfully', async () => {
      const endData: ChatEndRequest = {
        chatNodeId: 'chat_J7lYQC',
        workflowExecutionId: '700c2f5b-0f01-4881-8896-9015e68f5083',
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: {} }),
      });

      const result = await client.end(endData);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/chat/end`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(endData),
        })
      );
    });
  });
});
