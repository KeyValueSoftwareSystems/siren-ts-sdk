import { TemplateClient } from './client';
import { SirenConfig } from '../common/types';
import { SirenValidationError } from '../common/errors';
import { CreateTemplateRequest } from './types';

const API_TOKEN = 'test_api_token';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('TemplateClient', () => {
  let client: TemplateClient;

  beforeEach(() => {
    client = new TemplateClient({
      apiToken: API_TOKEN,
      env: 'dev',
    });
  });

  describe('get', () => {
    it('should get templates successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 'tpl_123',
            name: 'Test Template',
            variables: [],
            tags: ['test'],
            draftVersion: {
              id: 'ver_123',
              version: 1,
              status: 'DRAFT',
              publishedAt: null,
            },
            templateVersions: [],
          },
        ],
        error: null,
        meta: {
          totalElements: 1,
          totalPages: 1,
          currentPage: 0,
          pageSize: 10,
        },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.get();
      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
          body: undefined,
        }
      );
    });

    it('should get templates with query parameters', async () => {
      const mockResponse = {
        data: [],
        error: null,
        meta: {
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
          pageSize: 5,
        },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.get({
        tagNames: 'test,example',
        search: 'template',
        sort: 'name,asc',
        page: 0,
        size: 5,
      });
      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template?tagNames=test%2Cexample&search=template&sort=name%2Casc&page=0&size=5`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
          body: undefined,
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Invalid request' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(client.get()).rejects.toThrow('Invalid request');
    });
  });

  describe('create', () => {
    it('should create a template successfully', async () => {
      const mockResponse = {
        data: {
          templateId: 'tpl_123',
          templateName: 'Test Template',
          draftVersionId: 'ver_123',
          channelTemplateList: [
            {
              id: 'ct_123',
              channel: 'EMAIL',
              configuration: {
                subject: 'Test Subject',
                body: '<p>Test Body</p>',
                channel: 'EMAIL',
                isRawHTML: true,
                isPlainText: false,
                attachments: [],
              },
              templateVersionId: 'ver_123',
            },
          ],
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.create({
        name: 'Test Template',
        description: 'A test template',
        tagNames: ['test'],
        variables: [{ name: 'user_name', defaultValue: 'Guest' }],
        configurations: {
          EMAIL: {
            subject: 'Welcome {{user_name}}!',
            body: '<p>Hello {{user_name}}, welcome!</p>',
            channel: 'EMAIL',
            isRawHTML: true,
            isPlainText: false,
            attachments: [],
          },
        },
      });
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test Template',
            description: 'A test template',
            tagNames: ['test'],
            variables: [{ name: 'user_name', defaultValue: 'Guest' }],
            configurations: {
              EMAIL: {
                subject: 'Welcome {{user_name}}!',
                body: '<p>Hello {{user_name}}, welcome!</p>',
                channel: 'EMAIL',
                isRawHTML: true,
                isPlainText: false,
                attachments: [],
              },
            },
          }),
        }
      );
    });

    it('should throw validation error for missing required fields', async () => {
      const invalidRequest = {
        name: 'Test Template',
        tagNames: [],
        variables: [],
        configurations: {
          EMAIL: {
            subject: 'Test Subject',
            body: 'Test Body',
            channel: 'EMAIL',
            isRawHTML: false,
            isPlainText: true,
            attachments: [],
          },
        },
      } as Partial<CreateTemplateRequest>;

      await expect(client.create(invalidRequest as CreateTemplateRequest)).rejects.toThrow('Template description is required');
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Invalid template data' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(
        client.create({
          name: 'Test Template',
          description: 'Test Description',
          tagNames: [],
          variables: [],
          configurations: {
            EMAIL: {
              subject: 'Test Subject',
              body: 'Test Body',
              channel: 'EMAIL',
              isRawHTML: false,
              isPlainText: true,
              attachments: [],
            },
          },
        })
      ).rejects.toThrow('Invalid template data');
    });
  });

  describe('update', () => {
    it('should update a template successfully', async () => {
      const mockResponse = {
        data: {
          id: 'tpl_123',
          name: 'Updated Template',
          variables: [{ name: 'user_name', defaultValue: 'Updated Guest' }],
          tags: ['test', 'updated'],
          draftVersion: {
            id: 'ver_123',
            version: 2,
            status: 'DRAFT',
            publishedAt: null,
          },
          templateVersions: [],
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.update('tpl_123', {
        name: 'Updated Template',
        description: 'An updated test template',
        tagNames: ['test', 'updated'],
        variables: [{ name: 'user_name', defaultValue: 'Updated Guest' }],
      });
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template/tpl_123`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Updated Template',
            description: 'An updated test template',
            tagNames: ['test', 'updated'],
            variables: [{ name: 'user_name', defaultValue: 'Updated Guest' }],
          }),
        }
      );
    });

    it('should throw validation error when templateId is missing', async () => {
      await expect(
        client.update('', {
          name: 'Updated Template',
        })
      ).rejects.toThrow(SirenValidationError);
    });

    it('should throw validation error when name is missing', async () => {
      await expect(
        client.update('tpl_123', {
          description: 'An updated test template',
        } as any)
      ).rejects.toThrow(SirenValidationError);
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Invalid template data' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(
        client.update('tpl_123', {
          name: 'Test Template',
          description: 'Test Description',
          tagNames: [],
          variables: [],
          configurations: {
            EMAIL: {
              subject: 'Test Subject',
              body: 'Test Body',
              channel: 'EMAIL',
              isRawHTML: false,
              isPlainText: true,
              attachments: [],
            },
          },
        })
      ).rejects.toThrow('Invalid template data');
    });
  });

  describe('delete', () => {
    it('should delete a template successfully', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });
      const result = await client.delete('tpl_123');
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template/tpl_123`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
          body: undefined,
        }
      );
    });

    it('should throw validation error when templateId is missing', async () => {
      await expect(client.delete('')).rejects.toThrow(SirenValidationError);
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Template not found' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(client.delete('tpl_123')).rejects.toThrow('Template not found');
    });
  });

  describe('publish', () => {
    it('should publish a template successfully', async () => {
      const mockResponse = {
        data: {
          id: 'tpl_123',
          name: 'Published Template',
          variables: [],
          tags: [],
          draftVersion: {
            id: 'ver_123',
            version: 2,
            status: 'DRAFT',
            publishedAt: null,
          },
          publishedVersion: {
            id: 'ver_456',
            version: 1,
            status: 'PUBLISHED_LATEST',
            publishedAt: '2023-01-01T00:00:00Z',
          },
          templateVersions: [],
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.publish('tpl_123');
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template/tpl_123/publish`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
          body: undefined,
        }
      );
    });

    it('should throw validation error when templateId is missing', async () => {
      await expect(client.publish('')).rejects.toThrow(SirenValidationError);
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Template not found' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(client.publish('tpl_123')).rejects.toThrow('Template not found');
    });
  });

  describe('getChannelTemplates', () => {
    it('should get channel templates successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 'ct_123',
            channel: 'EMAIL',
            configuration: {
              subject: 'Test Subject',
              body: '<p>Test Body</p>',
              channel: 'EMAIL',
              isRawHTML: true,
              isPlainText: false,
              attachments: [],
            },
            templateVersionId: 'ver_123',
          },
        ],
        error: null,
        meta: {
          totalElements: 1,
          totalPages: 1,
          currentPage: 0,
          pageSize: 10,
        },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.getChannelTemplates('tpl_123');
      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template/versions/tpl_123/channel-templates`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
          body: undefined,
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Template not found' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(client.getChannelTemplates('tpl_123')).rejects.toThrow('Template not found');
    });
  });

  describe('createChannelTemplate', () => {
    it('should create a channel template successfully', async () => {
      const mockResponse = {
        data: {
          id: 'ct_123',
          channel: 'EMAIL',
          configuration: {
            subject: 'Test Subject',
            body: '<p>Test Body</p>',
            channel: 'EMAIL',
            isRawHTML: true,
            isPlainText: false,
            attachments: [],
          },
          templateVersionId: 'ver_123',
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.createChannelTemplate('tpl_123', {
        EMAIL: {
          subject: 'Test Subject',
          body: 'Test Body',
          channel: 'EMAIL',
          isRawHTML: false,
          isPlainText: true,
          attachments: [],
        },
      });
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/template/tpl_123/channel-templates`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            EMAIL: {
              subject: 'Test Subject',
              body: 'Test Body',
              channel: 'EMAIL',
              isRawHTML: false,
              isPlainText: true,
              attachments: [],
            },
          }),
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'BAD_REQUEST', message: 'Invalid channel template data' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(
        client.createChannelTemplate('tpl_123', {
          SMS: undefined,
          EMAIL: undefined,
        })
      ).rejects.toThrow('At least one channel configuration is required');
    });
  });
}); 