import { MessageClient } from './client';
import { SirenConfig } from '../common/types';

const API_TOKEN = 'test_api_key';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('MessageClient', () => {
  let client: MessageClient;

  beforeEach(() => {
    client = new MessageClient({ apiToken: API_TOKEN, baseUrl: BASE_URL });
  });

  describe('send', () => {
    it('should send a direct message successfully', async () => {
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
        'direct',
        'alice@company.com',
        'EMAIL',
        'Your account has been successfully verified.'
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
            recipient: { type: 'direct', value: 'alice@company.com' },
            channel: 'EMAIL',
            body: 'Your account has been successfully verified.'
          }),
        }
      );
    });

    it('should send a template message successfully', async () => {
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
        'direct',
        'U01UBCD06BB',
        'SLACK',
        undefined,
        'welcome_template',
        { user_name: 'John' }
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
            recipient: { type: 'direct', value: 'U01UBCD06BB' },
            channel: 'SLACK',
            template: { name: 'welcome_template' },
            templateVariables: { user_name: 'John' }
          }),
        }
      );
    });

    it('should throw error if neither body nor template is provided', async () => {
      await expect(
        client.send('direct', 'U01UBCD06BB', 'SLACK')
      ).rejects.toThrow('Either body or templateName must be provided');
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: {
          errorCode: 'INVALID_TEMPLATE',
          message: 'Template not found',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(mockError),
      });

      await expect(
        client.send('direct', 'U01UBCD06BB', 'SLACK', undefined, 'nonexistent')
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
    });
  });

  describe('getReplies', () => {
    it('should get message replies successfully', async () => {
      const mockResponse = {
        data: [
          {
            text: 'Reply message',
            user: 'U01UBCD06BB',
            ts: '1234567890.123456',
            threadTs: '1234567890.123456'
          }
        ],
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getReplies('test_msg_123');
      expect(result).toEqual([
        {
          text: 'Reply message',
          user: 'U01UBCD06BB',
          ts: '1234567890.123456',
          threadTs: '1234567890.123456'
        }
      ]);
    });
  });
}); 