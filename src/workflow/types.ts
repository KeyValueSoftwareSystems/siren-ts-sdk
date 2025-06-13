// Workflow Types

export interface WorkflowTriggerRequest {
  workflowName: string;
  data: Record<string, any>;
  notify: Record<string, any>;
}

export interface WorkflowBulkTriggerRequest {
  workflowName: string;
  data: Record<string, any>;
  notify: Array<Record<string, any>>;
}

export interface WorkflowTriggerResponse {
  requestId: string;
  workflowExecutionId: string;
}

export interface WorkflowBulkTriggerResponse {
  requestId: string;
  workflowExecutionIds: string[];
}

export interface ScheduleWorkflowRequest {
  name: string;
  scheduleTime: string;
  timezoneId: string;
  startDate: string;
  workflowType: string;
  workflowId: string;
  inputData: Record<string, any>;
  endDate?: string;
}

export interface ScheduleWorkflowResponse {
  scheduleId: string;
  status: string;
  workflowName: string;
  runAt?: string;
  cron?: string;
  timezone?: string;
  createdAt: string;
}

export {}; 