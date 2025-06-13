import { WebhookClient } from './client';
import { WebhookConfigRequest } from './types';

const API_TOKEN = 'test_api_token';
const BASE_URL = 'https://api.dev.trysiren.io';

const WEBHOOK_URL = 'https://example.com/webhook';

describe('WebhookClient', () => {
  let client: WebhookClient;

  beforeEach(() => {
    client = new WebhookClient({
      apiToken: API_TOKEN,
      env: 'dev',
    });
  });

  describe('configureNotifications', () => {
    it('should configure notification webhook successfully', async () => {
      const mockResponse = {
        data: {
          webhookConfig: {
            url: WEBHOOK_URL,
            headers: [],
            verificationKey: 'test_key_123',
          },
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.configureNotifications({
        url: WEBHOOK_URL,
        secret: 'supersecret',
      });
      expect(result.webhookConfig).toEqual({ url: WEBHOOK_URL, headers: [], verificationKey: 'test_key_123' });
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/webhooks`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webhookConfig: { url: WEBHOOK_URL, secret: 'supersecret' },
          }),
        }
      );
    });
    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'INVALID_URL', message: 'Invalid webhook URL' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(
        client.configureNotifications({ url: 'bad-url' })
      ).rejects.toThrow('Invalid webhook URL');
    });
  });

  describe('configureInbound', () => {
    it('should configure inbound webhook successfully', async () => {
      const mockResponse = {
        data: {
          inboundWebhookConfig: {
            url: WEBHOOK_URL,
            headers: [],
            verificationKey: 'test_key_456',
          },
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.configureInbound({
        url: WEBHOOK_URL,
        secret: 'supersecret',
      });
      expect(result.inboundWebhookConfig).toEqual({ url: WEBHOOK_URL, headers: [], verificationKey: 'test_key_456' });
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/webhooks`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inboundWebhookConfig: { url: WEBHOOK_URL, secret: 'supersecret' },
          }),
        }
      );
    });
    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'INVALID_URL', message: 'Invalid webhook URL' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(
        client.configureInbound({ url: 'bad-url' })
      ).rejects.toThrow('Invalid webhook URL');
    });
  });
}); 