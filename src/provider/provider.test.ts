import { ProviderClient } from './client';
import { ProviderRequest, Provider } from './types';

const API_TOKEN = 'test_api_key';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('ProviderClient', () => {
  let client: ProviderClient;

  beforeEach(() => {
    client = new ProviderClient({ apiToken: API_TOKEN, baseUrl: BASE_URL });
  });

  describe('add', () => {
    it('should create a provider integration successfully', async () => {
      const providerData: ProviderRequest = {
        providerCode: 'SLACK',
        name: 'provider-integrations-name',
        configuration: {
          botAuthToken: 'your-auth-token',
          appId: 'your-app-id',
        },
      };

      const mockResponse: { data: Provider } = {
        data: {
          ...providerData,
          id: '5fa8f864-5717-4542-b3fc-2c963f66afae',
          status: 'ACTIVE',
          createdAt: '2025-07-29T12:00:00Z',
          updatedAt: '2025-07-29T12:00:00Z',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.add(providerData);

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/provider-integrations`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(providerData),
        })
      );
    });
  });

  describe('update', () => {
    it('should update a provider integration successfully', async () => {
      const providerId = 'abf37791-60ec-45a4-beb9-ead8f8d05faf';
      const providerData: ProviderRequest = {
        providerCode: 'SLACK',
        name: 'provider-integrations-name',
        configuration: {
          botAuthToken: 'your-auth-token',
          appId: 'your-app-id',
        },
      };

      const mockResponse: { data: Provider } = {
        data: {
          ...providerData,
          id: providerId,
          status: 'ACTIVE',
          createdAt: '2025-07-29T12:00:00Z',
          updatedAt: '2025-07-29T12:00:00Z',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.update(providerId, providerData);

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/provider-integrations/${providerId}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(providerData),
        })
      );
    });
  });

  describe('delete', () => {
    it('should delete a provider integration successfully', async () => {
      const providerId = 'a8f39791-a0ec-45a4-beb9-ead8ff6d55af';
      const mockResponse = {
        data: {
          success: true,
          message: 'Provider integration deleted successfully',
          data: {
            id: providerId,
            name: 'provider-integrations-name',
            providerCode: 'SLACK',
          },
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.delete(providerId);

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/provider-integrations/${providerId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
