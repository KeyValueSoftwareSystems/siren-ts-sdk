import { BaseClient } from '../base/client';
import { SirenConfig } from '../common/types';
import { User, UserAPIResponse, UserRequest } from './types';

export class UserClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Create a user.
   * @param userData User attributes matching the UserRequest interface fields.
   * @returns A User object representing the created user.
   */
  async add(userData: UserRequest): Promise<User> {
    const response = await this.makeRequest<UserRequest, UserAPIResponse>(
      'POST',
      '/api/v1/public/users',
      userData
    );
    return response.data;
  }

  /**
   * Update a user.
   * @param uniqueId The unique ID of the user to update.
   * @param userData User attributes matching the UserRequest interface fields.
   * @returns A User object representing the updated user.
   */
  async update(uniqueId: string, userData: UserRequest): Promise<User> {
    const response = await this.makeRequest<UserRequest, UserAPIResponse>(
      'PUT',
      `/api/v1/public/users/${uniqueId}`,
      { ...userData, uniqueId }
    );
    return response.data;
  }

  /**
   * Delete a user.
   * @param uniqueId The unique ID of the user to delete.
   * @returns True if the user was successfully deleted.
   */
  async delete(uniqueId: string): Promise<boolean> {
    await this.makeRequest<undefined, undefined>(
      'DELETE',
      `/api/v1/public/users/${uniqueId}`
    );
    return true;
  }
} 