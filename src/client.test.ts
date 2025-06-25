import { SirenClient } from './client';
import { SirenValidationError } from './common/errors';
import { SirenConfig } from './common/types';

const API_TOKEN = 'test_api_token';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('SirenClient', () => {
  describe('Initialization', () => {
    it('should initialize with valid config', () => {
      const client = new SirenClient({
        apiToken: API_TOKEN,
        env: 'dev',
      });
      expect(client).toBeDefined();
      expect(client.template).toBeDefined();
      expect(client.workflow).toBeDefined();
      expect(client.message).toBeDefined();
      expect(client.user).toBeDefined();
      expect(client.webhook).toBeDefined();
    });

    it('should throw error when API token is missing', () => {
      const config = { env: 'dev' } as SirenConfig;
      expect(() => new SirenClient(config)).toThrow('API token is required');
    });

    it('should use prod environment by default', () => {
      const client = new SirenClient({ apiToken: API_TOKEN });
      expect(client.workflow['baseUrl']).toBe('https://api.trysiren.io');
    });

    it('should use custom base URL when provided', () => {
      const customUrl = 'https://custom.api.url';
      const client = new SirenClient({
        apiToken: API_TOKEN,
        baseUrl: customUrl,
      });
      expect(client.workflow['baseUrl']).toBe(customUrl);
    });
  });

  describe('Client Properties', () => {
    let client: SirenClient;

    beforeEach(() => {
      client = new SirenClient({
        apiToken: API_TOKEN,
        env: 'dev',
      });
    });

    it('should have template client with required methods', () => {
      expect(client.template).toBeDefined();
      expect(typeof client.template.get).toBe('function');
      expect(typeof client.template.create).toBe('function');
      expect(typeof client.template.update).toBe('function');
      expect(typeof client.template.delete).toBe('function');
      expect(typeof client.template.publish).toBe('function');
    });

    it('should have workflow client with required methods', () => {
      expect(client.workflow).toBeDefined();
      expect(typeof client.workflow.trigger).toBe('function');
      expect(typeof client.workflow.triggerBulk).toBe('function');
      expect(typeof client.workflow.schedule).toBe('function');
    });

    it('should have messaging client with required methods', () => {
      expect(client.message).toBeDefined();
      expect(typeof client.message.send).toBe('function');
      expect(typeof client.message.getReplies).toBe('function');
      expect(typeof client.message.getStatus).toBe('function');
    });

    it('should have user client with required methods', () => {
      expect(client.user).toBeDefined();
      expect(typeof client.user.add).toBe('function');
      expect(typeof client.user.update).toBe('function');
      expect(typeof client.user.delete).toBe('function');
    });

    it('should have webhook client with required methods', () => {
      expect(client.webhook).toBeDefined();
      expect(typeof client.webhook.configureNotifications).toBe('function');
      expect(typeof client.webhook.configureInbound).toBe('function');
    });
  });

  describe('Environment Handling', () => {
    it('should use dev environment', () => {
      const client = new SirenClient({
        apiToken: API_TOKEN,
        env: 'dev',
      });
      expect(client.workflow['baseUrl']).toBe('https://api.dev.trysiren.io');
    });

    it('should use prod environment', () => {
      const client = new SirenClient({
        apiToken: API_TOKEN,
        env: 'prod',
      });
      expect(client.workflow['baseUrl']).toBe('https://api.trysiren.io');
    });

    it('should throw error for invalid environment', () => {
      expect(() => new SirenClient({
        apiToken: API_TOKEN,
        env: 'invalid' as any,
      })).toThrow('Invalid environment');
    });
  });
}); 