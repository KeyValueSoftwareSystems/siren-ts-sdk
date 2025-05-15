import {
  CreateTemplateRequest,
  CreateTemplateResponse,
  GetTemplatesQuery,
  GetTemplatesResponse,
  DeleteTemplateResponse,
  PublishTemplateResponse,
  CreateChannelTemplateRequest,
  CreateChannelTemplateResponse,
  GetChannelTemplatesQuery,
  GetChannelTemplatesResponse,
  TemplateData,
  Template,
} from './types';
import { SirenConfig } from '../common/types';
import { handleAPIResponse, SirenValidationError, APIResponse } from '../common/errors';

const TEMPLATE_BASE_URLS = {
  prod: 'https://api.trysiren.io/api/v1',
  dev: 'https://api.dev.trysiren.io/api/v1',
};

/**
 * Client for Siren template and channel-template APIs.
 */
export class TemplateClient {
  private apiToken: string;
  private templateBaseUrl: string;

  constructor(config: SirenConfig) {
    if (!config.apiToken) {
      throw new SirenValidationError('API token is required');
    }
    this.apiToken = config.apiToken;
    if (config.baseUrl) {
      this.templateBaseUrl = config.baseUrl.replace('/api/v2', '/api/v1');
    } else if (config.env === 'dev') {
      this.templateBaseUrl = TEMPLATE_BASE_URLS.dev;
    } else {
      this.templateBaseUrl = TEMPLATE_BASE_URLS.prod;
    }
  }

  /**
   * Create a new template.
   */
  async createTemplate(request: CreateTemplateRequest): Promise<APIResponse<TemplateData>> {
    if (!request.name) {
      throw new SirenValidationError('Template name is required');
    }

    const response = await fetch(`${this.templateBaseUrl}/public/template`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleAPIResponse<TemplateData>(response);
  }

  /**
   * Update an existing template by ID.
   */
  async updateTemplate(templateId: string, request: CreateTemplateRequest): Promise<APIResponse<TemplateData>> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }
    if (!request.name) {
      throw new SirenValidationError('Template name is required');
    }

    const response = await fetch(`${this.templateBaseUrl}/public/template/${templateId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleAPIResponse<TemplateData>(response);
  }

  /**
   * Get all templates, optionally filtered and paginated.
   */
  async getTemplates(query?: GetTemplatesQuery): Promise<APIResponse<GetTemplatesResponse['data']>> {
    const params = new URLSearchParams();
    if (query) {
      if (query.tagNames) params.append('tagNames', query.tagNames);
      if (query.search) params.append('search', query.search);
      if (query.sort) params.append('sort', query.sort);
      if (query.page !== undefined) params.append('page', String(query.page));
      if (query.size !== undefined) params.append('size', String(query.size));
    }
    const url = `${this.templateBaseUrl}/public/template${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
    return handleAPIResponse<GetTemplatesResponse['data']>(response);
  }

  /**
   * Delete a template by ID.
   */
  async deleteTemplate(templateId: string): Promise<APIResponse<DeleteTemplateResponse['data']>> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }

    const response = await fetch(`${this.templateBaseUrl}/public/template/${templateId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
    return handleAPIResponse<DeleteTemplateResponse['data']>(response);
  }

  /**
   * Publish a template by ID.
   */
  async publishTemplate(templateId: string): Promise<APIResponse<Template>> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }

    const response = await fetch(`${this.templateBaseUrl}/public/template/${templateId}/publish`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
    return handleAPIResponse<Template>(response);
  }

  /**
   * Create a channel template for a given template ID.
   */
  async createChannelTemplate(templateId: string, request: CreateChannelTemplateRequest): Promise<APIResponse<CreateChannelTemplateResponse['data']>> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }
    if (!request.SMS && !request.EMAIL) {
      throw new SirenValidationError('At least one channel configuration is required');
    }

    const response = await fetch(`${this.templateBaseUrl}/public/template/${templateId}/channel-templates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleAPIResponse<CreateChannelTemplateResponse['data']>(response);
  }

  /**
   * Get all channel templates for a template version.
   */
  async getChannelTemplates(versionId: string, query?: GetChannelTemplatesQuery): Promise<APIResponse<GetChannelTemplatesResponse['data']>> {
    if (!versionId) {
      throw new SirenValidationError('Version ID is required');
    }

    const params = new URLSearchParams();
    if (query) {
      if (query.channel) params.append('channel', query.channel);
      if (query.search) params.append('search', query.search);
      if (query.sort) params.append('sort', query.sort);
      if (query.page !== undefined) params.append('page', String(query.page));
      if (query.size !== undefined) params.append('size', String(query.size));
    }
    const url = `${this.templateBaseUrl}/public/template/versions/${versionId}/channel-templates${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
    return handleAPIResponse<GetChannelTemplatesResponse['data']>(response);
  }
} 