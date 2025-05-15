import {
  WorkflowTriggerRequest,
  WorkflowBulkTriggerRequest,
  WorkflowTriggerResponse,
  WorkflowBulkTriggerResponse,
} from './types';
import { SirenConfig } from '../common/types';
import { handleAPIResponse, SirenValidationError, APIResponse } from '../common/errors';

const BASE_URLS = {
  prod: 'https://api.trysiren.io/api/v2',
  dev: 'https://api.dev.trysiren.io/api/v2',
};

/**
 * Client for Siren workflow APIs.
 */
export class WorkflowClient {
  private apiToken: string;
  private baseUrl: string;

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

  /**
   * Trigger a workflow execution.
   */
  async triggerWorkflow(request: WorkflowTriggerRequest): Promise<APIResponse<WorkflowTriggerResponse['data']>> {
    if (!request.workflowName) {
      throw new SirenValidationError('Workflow name is required');
    }
    if (!request.notify) {
      throw new SirenValidationError('Notification configuration is required');
    }

    const response = await fetch(`${this.baseUrl}/workflows/trigger`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleAPIResponse<WorkflowTriggerResponse['data']>(response);
  }

  /**
   * Trigger multiple workflow executions in bulk.
   */
  async triggerBulkWorkflow(request: WorkflowBulkTriggerRequest): Promise<APIResponse<WorkflowBulkTriggerResponse['data']>> {
    if (!request.workflowName) {
      throw new SirenValidationError('Workflow name is required');
    }
    if (!request.notify || request.notify.length === 0) {
      throw new SirenValidationError('At least one notification configuration is required');
    }

    const response = await fetch(`${this.baseUrl}/workflows/trigger/bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return handleAPIResponse<WorkflowBulkTriggerResponse['data']>(response);
  }
} 