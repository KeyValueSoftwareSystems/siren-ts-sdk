import { MessageClient } from './client';
import { RecipientChannel } from './types';

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
          notificationId: 'test_msg_123'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const sendParams = {
        recipientValue: 'alice@company.com',
        channel: RecipientChannel.EMAIL,
        body: 'Your account has been successfully verified.',
        subject: 'Account Verification'
      };
      const result = await client.send(sendParams);

      expect(result).toBe('test_msg_123');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            recipient: { email: 'alice@company.com' },
            channel: 'EMAIL',
            body: 'Your account has been successfully verified.',
            subject: 'Account Verification'
          })
        })
      );
    });

    it('should send a template message successfully', async () => {
      const mockResponse = {
        data: {
          notificationId: 'test_msg_456'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const sendParams = {
        recipientValue: 'U01UBCD06BB',
        channel: RecipientChannel.SLACK,
        templateName: 'welcome_template',
        templateVariables: { user_name: 'John' }
      };
      const result = await client.send(sendParams);

      expect(result).toBe('test_msg_456');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            recipient: { slack: 'U01UBCD06BB' },
            channel: 'SLACK',
            template: { name: 'welcome_template' },
            templateVariables: { user_name: 'John' }
          })
        })
      );
    });

    it('should throw error if neither body nor template is provided', async () => {
      const sendParams = {
        recipientValue: 'U01UBCD06BB',
        channel: RecipientChannel.SLACK
      };
      await expect(client.send(sendParams)).rejects.toThrow(
        'Either body or templateName must be provided'
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: {
          errorCode: 'INVALID_TEMPLATE',
          message: 'Template not found'
        }
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(mockError)
      });

      const sendParams = {
        recipientValue: 'U01UBCD06BB',
        channel: RecipientChannel.SLACK,
        templateName: 'nonexistent'
      };
      await expect(client.send(sendParams)).rejects.toThrow(
        'Template not found'
      );
    });
  });

  describe('sendAwesomeTemplate', () => {
    it('should send awesome template successfully', async () => {
      const mockResponse = {
        data: {
          notificationId: 'awesome_msg_123'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const sendAwesomeTemplateParams = {
        recipientValue: 'U08FK1G6DGE',
        channel: RecipientChannel.SLACK,
        templateIdentifier:
          'awesome-templates/customer-support/escalation_required/official/casual.yaml',
        templateVariables: {
          ticket_id: '123',
          customer_name: 'John'
        }
      };

      const result = await client.sendAwesomeTemplate(
        sendAwesomeTemplateParams
      );

      expect(result).toBe('awesome_msg_123');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-awesome-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            channel: 'SLACK',
            templateIdentifier:
              'awesome-templates/customer-support/escalation_required/official/casual.yaml',
            recipient: { slack: 'U08FK1G6DGE' },
            templateVariables: {
              ticket_id: '123',
              customer_name: 'John'
            }
          })
        })
      );
    });
  });

  describe('getStatus', () => {
    it('should get message status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'DELIVERED'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
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
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
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
