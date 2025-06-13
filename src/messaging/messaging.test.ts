import { MessageClient } from './client';
import { SirenConfig } from '../common/types';

const API_TOKEN = 'test_api_token';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('MessageClient', () => {
  let client: MessageClient;
  let config: SirenConfig;

  beforeEach(() => {
    config = {
      apiToken: API_TOKEN,
      env: 'dev',
    };
    client = new MessageClient(config);
  });

  describe('send', () => {
    it('should send a message successfully', async () => {
      const mockResponse = {
        data: {
          notificationId: 'test_msg_123',
        },
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.send(
        'test_template',
        'SLACK',
        'direct',
        'U123ABC',
        { name: 'John' }
      );

      expect(result).toBe('test_msg_123');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template: { name: 'test_template' },
            recipient: { type: 'direct', value: 'U123ABC' },
            channel: 'SLACK',
            templateVariables: { name: 'John' },
          }),
        }
      );
    });

    it('should send a message with a different template and recipient', async () => {
      const mockResponse = {
        data: {
          notificationId: 'test_msg_456',
        },
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.send(
        'another_template',
        'EMAIL',
        'direct',
        'user@example.com',
        { user_name: 'Jane' }
      );

      expect(result).toBe('test_msg_456');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template: { name: 'another_template' },
            recipient: { type: 'direct', value: 'user@example.com' },
            channel: 'EMAIL',
            templateVariables: { user_name: 'Jane' },
          }),
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: {
          code: 'INVALID_TEMPLATE',
          message: 'Template not found',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(mockError),
      });

      await expect(
        client.send('nonexistent', 'SLACK', 'direct', 'U123ABC')
      ).rejects.toThrow('Template not found');
    });
  });

  describe('getStatus', () => {
    it('should get message status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'DELIVERED',
        },
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getStatus('test_msg_123');

      expect(result).toBe('DELIVERED');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/message-status/test_msg_123`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
        }
      );
    });
  });

  describe('getReplies', () => {
    it('should get message replies successfully', async () => {
      const mockResponse = {
        data: [
          {
            text: 'Reply 1',
            user: 'U123',
            ts: '12345.6789',
            threadTs: '12345.0000',
          },
          {
            text: 'Reply 2',
            user: 'U456',
            ts: '12346.7890',
            threadTs: '12345.0000',
          },
        ],
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getReplies('test_msg_123');

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('Reply 1');
      expect(result[0].user).toBe('U123');
      expect(result[1].text).toBe('Reply 2');
      expect(result[1].user).toBe('U456');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/get-reply/test_msg_123`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
        }
      );
    });

    it('should handle empty replies', async () => {
      const mockResponse = {
        data: [],
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getReplies('test_msg_no_replies');

      expect(result).toHaveLength(0);
    });
  });
}); 