export interface ProviderRequest {
  providerCode: string;
  name: string;
  configuration: Record<string, any>;
}

export interface Provider extends ProviderRequest {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
