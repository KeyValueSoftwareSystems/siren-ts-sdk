export interface ChatMessageRequest {
  chatNodeId: string;
  workflowExecutionId: string;
  templateId?: string;
  templateVariables?: Record<string, unknown>;
  body?: string;
  subject?: string;
  buttons?: { text: string; value: string }[];
}

export interface ChatMessageResponse {
  messageId: string;
  status: string;
}

export interface ChatEndRequest {
  chatNodeId: string;
  workflowExecutionId: string;
}
