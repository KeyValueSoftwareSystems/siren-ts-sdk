export interface WebhookConfigRequest {
  url: string;
  secret?: string;
}

export interface WebhookConfig {
  url: string;
  headers?: Record<string, any>[];
  verificationKey: string;
}

export interface WebhookConfigResponse {
  webhookConfig?: WebhookConfig;
  inboundWebhookConfig?: WebhookConfig;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  environment?: string;
} 