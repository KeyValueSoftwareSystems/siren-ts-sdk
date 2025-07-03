import { MessageClient } from './client';

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

      const result = await client.send(
        'alice@company.com',
        'EMAIL',
        'Your account has been successfully verified.'
      );

      expect(result).toBe('test_msg_123');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            recipient: { email: 'alice@company.com' },
            channel: 'EMAIL',
            body: 'Your account has been successfully verified.'
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

      const result = await client.send(
        'U01UBCD06BB',
        'SLACK',
        undefined,
        'welcome_template',
        { user_name: 'John' }
      );

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

    it('should send a direct message with subject successfully', async () => {
      const mockResponse = {
        data: {
          notificationId: 'test_msg_with_subject_123'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.send(
        'alice@company.com',
        'EMAIL',
        'Your account has been successfully verified.',
        undefined,
        undefined,
        undefined,
        undefined,
        'Account Verification Complete'
      );

      expect(result).toBe('test_msg_with_subject_123');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            recipient: { email: 'alice@company.com' },
            channel: 'EMAIL',
            body: 'Your account has been successfully verified.',
            subject: 'Account Verification Complete'
          })
        })
      );
    });

    it('should send a template message with subject successfully', async () => {
      const mockResponse = {
        data: {
          notificationId: 'test_msg_template_subject_456'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.send(
        'alice@company.com',
        'EMAIL',
        undefined,
        'welcome_template',
        { user_name: 'John' },
        undefined,
        undefined,
        'Welcome to Our Platform'
      );

      expect(result).toBe('test_msg_template_subject_456');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            recipient: { email: 'alice@company.com' },
            channel: 'EMAIL',
            template: { name: 'welcome_template' },
            subject: 'Welcome to Our Platform',
            templateVariables: { user_name: 'John' }
          })
        })
      );
    });

    it('should send a message without subject (existing behavior)', async () => {
      const mockResponse = {
        data: {
          notificationId: 'test_msg_no_subject_789'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.send(
        'alice@company.com',
        'EMAIL',
        'Your account has been successfully verified.'
      );

      expect(result).toBe('test_msg_no_subject_789');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            recipient: { email: 'alice@company.com' },
            channel: 'EMAIL',
            body: 'Your account has been successfully verified.'
          })
        })
      );
    });

    it('should throw error if neither body nor template is provided', async () => {
      await expect(client.send('U01UBCD06BB', 'SLACK')).rejects.toThrow(
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

      await expect(
        client.send('U01UBCD06BB', 'SLACK', undefined, 'nonexistent')
      ).rejects.toThrow('Template not found');
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

      const result = await client.sendAwesomeTemplate(
        'U08FK1G6DGE',
        'SLACK',
        'awesome-templates/customer-support/escalation_required/official/casual.yaml',
        {
          ticket_id: '123',
          customer_name: 'John'
        }
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

    it('should send awesome template with subject successfully', async () => {
      const mockResponse = {
        data: {
          notificationId: 'awesome_msg_subject_456'
        },
        error: null
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.sendAwesomeTemplate(
        'alice@company.com',
        'EMAIL',
        'awesome-templates/customer-support/escalation_required/official/casual.yaml',
        {
          ticket_id: '123',
          customer_name: 'John'
        },
        undefined,
        undefined,
        'Ticket Escalation Required'
      );

      expect(result).toBe('awesome_msg_subject_456');
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/send-awesome-messages`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            channel: 'EMAIL',
            templateIdentifier:
              'awesome-templates/customer-support/escalation_required/official/casual.yaml',
            recipient: { email: 'alice@company.com' },
            subject: 'Ticket Escalation Required',
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