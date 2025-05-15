import { SirenClient } from '../index';
import { TemplateClient } from '../template/client';
import { WorkflowClient } from '../workflow/client';
import { SirenConfig } from '../common/types';
import { SirenError, SirenAPIError, SirenValidationError } from '../common/errors';

global.fetch = jest.fn();

describe('SirenClient', () => {
  const apiToken = process.env.SIREN_API_TOKEN || 'test-token';
  const config: SirenConfig = { apiToken, env: 'dev' };
  let client: SirenClient;

  beforeEach(() => {
    client = new SirenClient(config);
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Initialization', () => {
    it('should instantiate template and workflow sub-clients', () => {
      expect(client.template).toBeInstanceOf(TemplateClient);
      expect(client.workflow).toBeInstanceOf(WorkflowClient);
    });

    it('should throw error when apiToken is missing', () => {
      expect(() => new SirenClient({ env: 'dev' } as SirenConfig)).toThrow('API token is required');
    });
  });

  describe('Workflow API', () => {
    it('should call workflow.triggerWorkflow and return data', async () => {
      const mockResponse = { data: { requestId: '1', workflowExecutionId: '2' }, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.workflow.triggerWorkflow({ workflowName: 'otp', data: {}, notify: {} });
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when workflowName is missing', async () => {
      await expect(client.workflow.triggerWorkflow({ data: {}, notify: {} } as any))
        .rejects.toThrow(SirenValidationError);
    });

    it('should call workflow.triggerBulkWorkflow and return data', async () => {
      const mockResponse = { data: { requestId: '1', workflowExecutionIds: ['2', '3'] }, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.workflow.triggerBulkWorkflow({ workflowName: 'otp', data: {}, notify: [{}] });
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when notify array is empty', async () => {
      await expect(client.workflow.triggerBulkWorkflow({ workflowName: 'otp', data: {}, notify: [] }))
        .rejects.toThrow(SirenValidationError);
    });

    it('should handle API errors', async () => {
      const mockError = { data: null, error: { errorCode: 'INVALID_REQUEST', message: 'Invalid request' }, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve(mockError)
      });
      await expect(client.workflow.triggerWorkflow({ workflowName: 'otp', data: {}, notify: {} }))
        .rejects.toThrow(SirenAPIError);
    });
  });

  describe('Template API', () => {
    it('should call template.createTemplate and return data', async () => {
      const mockResponse = { data: { templateId: '1', templateName: 't', draftVersionId: 'd', channelTemplateList: [] }, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.template.createTemplate({
        name: 't',
        description: 'desc',
        tagNames: [],
        variables: [],
        configurations: {}
      });
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when template name is missing', async () => {
      await expect(client.template.createTemplate({
        description: 'desc',
        tagNames: [],
        variables: [],
        configurations: {}
      } as any)).rejects.toThrow(SirenValidationError);
    });

    it('should call template.getTemplates and return data', async () => {
      const mockResponse = { data: { totalElements: 1, totalPages: 1, size: 1, content: [], number: 0, sort: {}, numberOfElements: 1, first: true, last: true, pageable: {}, empty: false }, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.template.getTemplates();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should call template.updateTemplate and return data', async () => {
      const mockResponse = { data: { templateId: '1', templateName: 't', draftVersionId: 'd', channelTemplateList: [] }, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.template.updateTemplate('1', {
        name: 't',
        description: 'desc',
        tagNames: [],
        variables: [],
        configurations: {}
      });
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when templateId is missing in updateTemplate', async () => {
      await expect(client.template.updateTemplate('', {
        name: 't',
        description: 'desc',
        tagNames: [],
        variables: [],
        configurations: {}
      })).rejects.toThrow(SirenValidationError);
    });

    it('should call template.deleteTemplate and return data', async () => {
      const mockResponse = { data: null, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.template.deleteTemplate('1');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when templateId is missing in deleteTemplate', async () => {
      await expect(client.template.deleteTemplate('')).rejects.toThrow(SirenValidationError);
    });

    it('should call template.publishTemplate and return data', async () => {
      const mockResponse = { data: {}, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.template.publishTemplate('1');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when templateId is missing in publishTemplate', async () => {
      await expect(client.template.publishTemplate('')).rejects.toThrow(SirenValidationError);
    });

    it('should call template.createChannelTemplate and return data', async () => {
      const mockResponse = { data: {}, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.template.createChannelTemplate('1', { SMS: { body: '', channel: 'SMS', isFlash: false, isUnicode: false } });
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when versionId is missing in createChannelTemplate', async () => {
      await expect(client.template.createChannelTemplate('', { SMS: { body: '', channel: 'SMS', isFlash: false, isUnicode: false } }))
        .rejects.toThrow(SirenValidationError);
    });

    it('should call template.getChannelTemplates and return data', async () => {
      const mockResponse = { data: { totalElements: 1, totalPages: 1, size: 1, content: [], number: 0, sort: {}, numberOfElements: 1, first: true, last: true, pageable: {}, empty: false }, error: null, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      const result = await client.template.getChannelTemplates('1');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should throw validation error when versionId is missing in getChannelTemplates', async () => {
      await expect(client.template.getChannelTemplates('')).rejects.toThrow(SirenValidationError);
    });

    it('should handle API errors', async () => {
      const mockError = { data: null, error: { errorCode: 'INVALID_REQUEST', message: 'Invalid request' }, errors: null, meta: null };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve(mockError)
      });
      await expect(client.template.createTemplate({
        name: 't',
        description: 'desc',
        tagNames: [],
        variables: [],
        configurations: {}
      })).rejects.toThrow(SirenAPIError);
    });
  });
}); 