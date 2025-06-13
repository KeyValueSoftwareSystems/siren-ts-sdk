import { UserClient } from './client';
import { User } from './types';

const API_TOKEN = 'test_api_token';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('UserClient', () => {
  let client: UserClient;

  beforeEach(() => {
    client = new UserClient({
      apiToken: API_TOKEN,
      env: 'dev',
    });
  });

  describe('add', () => {
    it('should create a user successfully', async () => {
      const mockResponse = {
        data: {
          id: 'user_api_generated_id_001',
          uniqueId: 'john_doe_008',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          activeChannels: ['EMAIL', 'SMS'],
          active: true,
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z',
        },
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.add({
        uniqueId: 'john_doe_008',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        activeChannels: ['EMAIL', 'SMS'],
        active: true,
      });

      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uniqueId: 'john_doe_008',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            activeChannels: ['EMAIL', 'SMS'],
            active: true,
          }),
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: {
          code: 'INVALID_USER_DATA',
          message: 'Invalid user data provided',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });

      await expect(
        client.add({
          uniqueId: 'invalid_user',
          email: 'invalid-email',
        })
      ).rejects.toThrow('Invalid user data provided');
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const mockResponse = {
        data: {
          id: 'user_api_generated_id_001',
          uniqueId: 'john_doe_008',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@company.com',
          activeChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
          active: true,
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-02T12:00:00Z',
        },
        error: null,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.update('john_doe_008', {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        activeChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
      });

      expect(result).toEqual(mockResponse.data);
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toBe(`${BASE_URL}/api/v1/public/users/john_doe_008`);
      expect(fetchCall[1].method).toBe('PUT');
      expect(fetchCall[1].headers).toEqual({
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(fetchCall[1].body)).toEqual({
        uniqueId: 'john_doe_008',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        activeChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
      });
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(mockError),
      });

      await expect(
        client.update('nonexistent_user', {
          firstName: 'Jane',
        })
      ).rejects.toThrow('User not found');
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await client.delete('john_doe_008');

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/users/john_doe_008`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(mockError),
      });

      await expect(client.delete('nonexistent_user')).rejects.toThrow('User not found');
    });
  });
}); 