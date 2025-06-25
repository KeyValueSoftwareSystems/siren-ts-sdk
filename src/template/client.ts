import {
  CreateTemplateRequest,
  GetTemplatesQuery,
  CreateChannelTemplateRequest,
  GetChannelTemplatesQuery,
  TemplateData,
  Template,
  UpdateTemplateRequest,
  ChannelTemplateSMSConfig,
  ChannelTemplateEmailConfig,
  ChannelTemplate,
} from './types';
import { SirenConfig } from '../common/types';
import { SirenValidationError, APIResponse, SirenError } from '../common/errors';
import { BaseClient } from '../base/client';

/**
 * Client for Siren template and channel-template APIs.
 */
export class TemplateClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Create a new template.
   */
  async create(request: CreateTemplateRequest): Promise<TemplateData> {
    if (!request.name) {
      throw new SirenValidationError('Template name is required');
    }
    if (!request.description) {
      throw new SirenValidationError('Template description is required');
    }
    if (!request.tagNames) {
      throw new SirenValidationError('Template tags are required');
    }
    if (!request.variables) {
      throw new SirenValidationError('Template variables are required');
    }
    if (!request.configurations || Object.keys(request.configurations).length === 0) {
      throw new SirenValidationError('At least one channel configuration is required');
    }

    const response = await this.makeRequest<CreateTemplateRequest, TemplateData>(
      'POST',
      '/api/v1/public/template',
      request
    );
    if (!response.data) {
      throw new SirenError('TEMPLATE_CREATE_ERROR', 'Failed to create template: No data returned');
    }
    return response.data;
  }

  /**
   * Update an existing template by ID.
   */
  async update(templateId: string, request: UpdateTemplateRequest): Promise<Template> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }
    if (!request.name) {
      throw new SirenValidationError('Template name is required');
    }

    const response = await this.makeRequest<UpdateTemplateRequest, Template>(
      'PUT',
      `/api/v1/public/template/${templateId}`,
      request
    );
    if (!response.data) {
      throw new SirenError('TEMPLATE_UPDATE_ERROR', 'Failed to update template: No data returned');
    }
    return response.data;
  }

  /**
   * Get all templates, optionally filtered and paginated.
   */
  async get(query?: GetTemplatesQuery): Promise<APIResponse<Template[]>> {
    const params = new URLSearchParams();
    if (query) {
      if (query.tagNames) params.append('tagNames', query.tagNames);
      if (query.search) params.append('search', query.search);
      if (query.sort) params.append('sort', query.sort);
      if (query.page !== undefined) params.append('page', String(query.page));
      if (query.size !== undefined) params.append('size', String(query.size));
    }
    const url = `/api/v1/public/template${params.toString() ? '?' + params.toString() : ''}`;
    return this.makeRequest<undefined, Template[]>('GET', url);
  }

  /**
   * Delete a template by ID.
   * @returns A boolean indicating whether the deletion was successful.
   */
  async delete(templateId: string): Promise<boolean> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }

    await this.makeRequest<undefined, boolean>(
      'DELETE',
      `/api/v1/public/template/${templateId}`
    );
    return true;
  }

  /**
   * Publish a template by ID.
   */
  async publish(templateId: string): Promise<Template> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }

    const response = await this.makeRequest<undefined, Template>(
      'PATCH',
      `/api/v1/public/template/${templateId}/publish`
    );
    if (!response.data) {
      throw new SirenError('TEMPLATE_PUBLISH_ERROR', 'Failed to publish template: No data returned');
    }
    return response.data;
  }

  /**
   * Create a channel template for a given template ID.
   */
  async createChannelTemplate(templateId: string, request: CreateChannelTemplateRequest): Promise<{
    SMS?: ChannelTemplateSMSConfig;
    EMAIL?: ChannelTemplateEmailConfig;
    [key: string]: any;
  }> {
    if (!templateId) {
      throw new SirenValidationError('Template ID is required');
    }
    if (!request.SMS && !request.EMAIL) {
      throw new SirenValidationError('At least one channel configuration is required');
    }

    const response = await this.makeRequest<CreateChannelTemplateRequest, {
      SMS?: ChannelTemplateSMSConfig;
      EMAIL?: ChannelTemplateEmailConfig;
      [key: string]: any;
    }>(
      'POST',
      `/api/v1/public/template/${templateId}/channel-templates`,
      request
    );
    if (!response.data) {
      throw new SirenError('CHANNEL_TEMPLATE_CREATE_ERROR', 'Failed to create channel template: No data returned');
    }
    return response.data;
  }

  /**
   * Get all channel templates for a template version.
   */
  async getChannelTemplates(versionId: string, query?: GetChannelTemplatesQuery): Promise<APIResponse<ChannelTemplate[]>> {
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
    const url = `/api/v1/public/template/versions/${versionId}/channel-templates${params.toString() ? '?' + params.toString() : ''}`;
    return this.makeRequest<undefined, ChannelTemplate[]>('GET', url);
  }
} 