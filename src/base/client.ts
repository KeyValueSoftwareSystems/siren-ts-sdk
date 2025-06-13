import { SirenConfig } from '../common/types';
import { handleAPIResponse, SirenValidationError, APIResponse } from '../common/errors';

const BASE_URLS = {
  prod: 'https://api.trysiren.io',
  dev: 'https://api.dev.trysiren.io',
};

export class BaseClient {
  protected apiToken: string;
  protected baseUrl: string;

  constructor(config: SirenConfig) {
    if (!config.apiToken) {
      throw new SirenValidationError('API token is required');
    }
    this.apiToken = config.apiToken;
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    } else if (config.env === 'dev') {
      this.baseUrl = BASE_URLS.dev;
    } else {
      this.baseUrl = BASE_URLS.prod;
    }
  }

  protected async makeRequest<TRequest, TResponse>(
    method: string,
    endpoint: string,
    data?: TRequest
  ): Promise<APIResponse<TResponse>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiToken}`,
    };

    if (data) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleAPIResponse<TResponse>(response);
  }
} 