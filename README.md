# Siren TypeScript SDK

A TypeScript SDK for interacting with the Siren API. This SDK provides a simple and type-safe way to interact with Siren's template and workflow APIs.

## Installation

```bash
npm install siren-ts-sdk
# or
yarn add siren-ts-sdk
```

## Quick Start

```typescript
import { SirenClient } from 'siren-ts-sdk';

// Initialize the client
const client = new SirenClient({
  apiToken: 'your-api-token',
  env: 'prod' // or 'dev' for development environment
});

// Create a template
const template = await client.template.createTemplate({
  name: 'Welcome_Email',
  description: 'Welcome email template',
  tagNames: ['welcome', 'email'],
  variables: [
    { name: 'userName', defaultValue: 'User' }
  ],
  configurations: {
    EMAIL: {
      subject: 'Welcome to our platform!',
      channel: 'EMAIL',
      body: '<p>Hello {{userName}}, welcome to our platform!</p>',
      attachments: [],
      isRawHTML: true,
      isPlainText: false
    }
  }
});

// Trigger a workflow
const workflow = await client.workflow.triggerWorkflow({
  workflowName: 'welcome-email',
  data: {
    userName: 'John Doe'
  },
  notify: {
    notificationType: 'email',
    recipient: 'john@example.com'
  }
});
```

## API Reference

### Configuration

```typescript
interface SirenConfig {
  apiToken: string;      // Required: Your Siren API token
  baseUrl?: string;      // Optional: Override default API URL
  env?: 'prod' | 'dev';  // Optional: Select environment
}
```

### Template API

#### Create Template
```typescript
const template = await client.template.createTemplate({
  name: string;
  description: string;
  tagNames: string[];
  variables: Array<{
    name: string;
    defaultValue: string;
  }>;
  configurations: {
    SMS?: {
      body: string;
      channel: 'SMS';
      isFlash: boolean;
      isUnicode: boolean;
    };
    EMAIL?: {
      subject: string;
      channel: 'EMAIL';
      body: string;
      attachments: any[];
      isRawHTML: boolean;
      isPlainText: boolean;
    };
  };
});
```

#### Get Templates
```typescript
const templates = await client.template.getTemplates({
  tagNames?: string;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
});
```

#### Update Template
```typescript
const updatedTemplate = await client.template.updateTemplate(
  templateId: string,
  request: CreateTemplateRequest
);
```

#### Delete Template
```typescript
await client.template.deleteTemplate(templateId: string);
```

#### Publish Template
```typescript
await client.template.publishTemplate(templateId: string);
```

### Workflow API

#### Trigger Workflow
```typescript
const workflow = await client.workflow.triggerWorkflow({
  workflowName: string;
  data: Record<string, any>;
  notify: {
    notificationType: string;
    recipient: string;
    metadata?: Record<string, any>;
  };
});
```

#### Trigger Bulk Workflow
```typescript
const workflows = await client.workflow.triggerBulkWorkflow({
  workflowName: string;
  data: Record<string, any>;
  notify: Array<{
    notificationType: string;
    recipient: string;
    metadata?: Record<string, any>;
  }>;
});
```

## Error Handling

The SDK throws specific error types for different scenarios:

```typescript
try {
  await client.template.createTemplate({...});
} catch (error) {
  if (error instanceof SirenError) {
    console.error('Siren Error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Environment Variables

The SDK uses the following environment variables:

- `SIREN_API_TOKEN`: Your Siren API token (required)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 