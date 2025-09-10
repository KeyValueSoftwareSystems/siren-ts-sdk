import { BaseClient } from '../base/client';
import { SirenConfig } from '../common/types';
import { Provider, ProviderRequest } from './types';

export class ProviderClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Create a provider integration.
   * @param providerData Provider attributes matching the ProviderRequest interface fields.
   * @returns A Provider object representing the created provider.
   */
  async add(providerData: ProviderRequest): Promise<Provider> {
    const response = await this.makeRequest<ProviderRequest, Provider>(
      'POST',
      '/api/v1/public/provider-integrations',
      providerData
    );
    return response.data as Provider;
  }

  /**
   * Update a provider integration.
   * @param providerId The ID of the provider to update.
   * @param providerData Provider attributes matching the ProviderRequest interface fields.
   * @returns A Provider object representing the updated provider.
   */
  async update(providerId: string, providerData: ProviderRequest): Promise<Provider> {
    const response = await this.makeRequest<ProviderRequest, Provider>(
      'PUT',
      `/api/v1/public/provider-integrations/${providerId}`,
      providerData
    );
    return response.data as Provider;
  }

  /**
   * Delete a provider integration.
   * @param providerId The ID of the provider to delete.
   * @returns True if the provider was successfully deleted.
   */
  async delete(providerId: string): Promise<boolean> {
    await this.makeRequest<undefined, undefined>(
      'DELETE',
      `/api/v1/public/provider-integrations/${providerId}`
    );
    return true;
  }
}
