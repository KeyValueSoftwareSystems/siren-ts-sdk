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
  data: {
    requestId: string;
    workflowExecutionId: string;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}

export interface WorkflowBulkTriggerResponse {
  data: {
    requestId: string;
    workflowExecutionIds: string[];
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}
export {}; 