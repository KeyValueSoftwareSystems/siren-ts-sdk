import {
  WorkflowTriggerRequest,
  WorkflowBulkTriggerRequest,
  WorkflowTriggerResponse,
  WorkflowBulkTriggerResponse,
  ScheduleWorkflowRequest,
  ScheduleWorkflowResponse,
} from './types';
import { SirenConfig } from '../common/types';
import { BaseClient } from '../base/client';
import { SirenValidationError } from '../common/errors';

/**
 * Client for Siren workflow APIs.
 */
export class WorkflowClient extends BaseClient {
  constructor(config: SirenConfig) {
    super(config);
  }

  /**
   * Trigger a workflow execution.
   */
  async trigger(request: WorkflowTriggerRequest) {
    if (!request.workflowName) {
      throw new SirenValidationError('Workflow name is required');
    }
    if (!request.notify) {
      throw new SirenValidationError('Notification configuration is required');
    }
    return this.makeRequest<WorkflowTriggerRequest, WorkflowTriggerResponse>(
      'POST',
      '/api/v2/workflows/trigger',
      request
    );
  }

  /**
   * Trigger multiple workflow executions in bulk.
   */
  async triggerBulk(request: WorkflowBulkTriggerRequest) {
    if (!request.workflowName) {
      throw new SirenValidationError('Workflow name is required');
    }
    if (!request.notify || request.notify.length === 0) {
      throw new SirenValidationError('At least one notification configuration is required');
    }
    return this.makeRequest<WorkflowBulkTriggerRequest, WorkflowBulkTriggerResponse>(
      'POST',
      '/api/v2/workflows/trigger/bulk',
      request
    );
  }

  /**
   * Schedule a workflow to run at a future time or on a recurring basis.
   * @param req ScheduleWorkflowRequest
   * @returns ScheduleWorkflowResponse
   */
  async schedule(req: ScheduleWorkflowRequest): Promise<ScheduleWorkflowResponse> {
    if (!req.name) {
      throw new SirenValidationError('Workflow name is required');
    }
    if (!req.workflowId) {
      throw new SirenValidationError('Workflow ID is required');
    }

    // API expects camelCase with specific format
    const apiRequest = {
      name: req.name,
      scheduleTime: req.scheduleTime,
      timezoneId: req.timezoneId,
      startDate: req.startDate,
      type: req.workflowType,
      workflowId: req.workflowId,
      inputData: req.inputData,
      endDate: req.endDate || '' // Default to empty string if not provided
    };

    const response = await this.makeRequest<typeof apiRequest, ScheduleWorkflowResponse>(
      'POST',
      '/api/v1/public/schedules',
      apiRequest
    );
    if (!response.data) {
      throw new Error('No data returned from workflow schedule response');
    }
    return response.data;
  }
} 