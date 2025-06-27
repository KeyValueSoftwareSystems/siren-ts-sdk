# Siren TypeScript SDK

This is the official TypeScript SDK for the [Siren notification platform](https://docs.trysiren.io).

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [SDK Methods](#sdk-methods)
- [Examples](#examples)
- [For Package Developers](#for-package-developers)

## Installation

```bash
npm install @trysiren/node
# or
yarn add @trysiren/node
```

## Basic Usage

```typescript
import { SirenClient, ProviderCode } from '@trysiren/node';

// Initialize using environment variables SIREN_API_KEY (and optional SIREN_ENV)
const client = new SirenClient();

// --- Send a direct message (no template) ---
const directMessageId = await client.message.send(
  'alice@company.com',
  'EMAIL',
  'Your account has been successfully verified. You can now access all features.'
);
console.log('Sent direct message:', directMessageId);

// --- Send a message using a template ---
const templatedMessageId = await client.message.send(
  'U01UBCD06BB',
  'SLACK',
  undefined,                       // body
  'welcome_template',              // template name
  { user_name: 'John' }
);
console.log('Sent template message:', templatedMessageId);

// --- Send with a specific provider ---
const providerMessageId = await client.message.send(
  'alice@company.com',
  'EMAIL',
  'Your account has been successfully verified.',
  undefined,
  undefined,
  'email-provider',                // provider name
  ProviderCode.EMAIL_SENDGRID      // provider code
);
console.log('Sent with provider:', providerMessageId);

// --- Send using an awesome template identifier ---
const awesomeMessageId = await client.message.sendAwesomeTemplate(
  'U01UBCD06BB',
  'SLACK',
  'awesome-templates/customer-support/escalation_required/official/casual.yaml',
  {
    ticket_id: '123456',
    customer_name: 'John',
    issue_summary: 'Payment processing issue',
    ticket_url: 'https://support.company.com/ticket/123456',
    sender_name: 'Support Team'
  },
  'slack-provider',
  ProviderCode.SLACK
);
console.log('Sent awesome template:', awesomeMessageId);
```

## SDK Methods

The Siren TypeScript SDK provides a clean, namespaced interface to interact with the Siren API.

**Templates** (`client.template.*`)
- **`client.template.get()`** - Retrieves a list of notification templates with optional filtering, sorting, and pagination
- **`client.template.create()`** - Creates a new notification template
- **`client.template.update()`** - Updates an existing notification template
- **`client.template.delete()`** - Deletes an existing notification template
- **`client.template.publish()`** - Publishes a template, making its latest draft version live

**Channel Templates** (`client.template.*`)
- **`client.template.createChannelTemplate()`** - Creates or updates channel-specific templates (EMAIL, SMS, etc.)
- **`client.template.getChannelTemplates()`** - Retrieves channel templates for a specific template version

**Messaging** (`client.message.*`)
- **`client.message.send()`** - Sends a message (with or without using a template) to a recipient via a chosen channel
- **`client.message.send_awesome_template()`** - Sends a message using a template path/identifier
- **`client.message.getReplies()`** - Retrieves replies for a specific message ID
- **`client.message.getStatus()`** - Retrieves the status of a specific message (SENT, DELIVERED, FAILED, etc.)

**Workflows** (`client.workflow.*`)
- **`client.workflow.trigger()`** - Triggers a workflow with given data and notification payloads
- **`client.workflow.triggerBulk()`** - Triggers a workflow in bulk for multiple recipients
- **`client.workflow.schedule()`** - Schedules a workflow to run at a future time (once or recurring)

**Webhooks** (`client.webhook.*`)
- **`client.webhook.configureNotifications()`** - Configures webhook URL for receiving status updates
- **`client.webhook.configureInbound()`** - Configures webhook URL for receiving inbound messages

**Users** (`client.user.*`)
- **`client.user.add()`** - Creates a new user or updates existing user with given unique_id
- **`client.user.update()`** - Updates an existing user's information
- **`client.user.delete()`** - Deletes an existing user

## Examples

For detailed usage examples of all SDK methods, see the [examples](./examples/) folder.

## For Package Developers

### Environment Configuration

For testing the SDK, set these environment variables:

- **`SIREN_API_KEY`**: Your API key from the Siren dashboard
- **`SIREN_ENV`**: Set to `dev` for development/testing (defaults to `prod`)

### Prerequisites

*   Git
*   Node.js 14 or higher
*   npm or yarn

### Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/KeyValueSoftwareSystems/siren-ts-sdk.git
    cd siren-ts-sdk
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up pre-commit hooks:**
    (Ensures code quality before commits)
    ```bash
    npm run prepare
    # or
    yarn prepare
    ```

    You are now ready to contribute to the `@trysiren/node`!

### Code Style & Linting

*   Code style is enforced by ESLint and Prettier
*   TypeScript type checking is handled by the TypeScript compiler
*   These tools are automatically run via pre-commit hooks

### Running Tests

To run the test suite, use the following command from the project root directory:

```bash
npm test
# or
yarn test
```

This will execute all tests defined in the `src/__tests__/` directory.

### Submitting Changes

*   Create a feature branch for your changes
*   Commit your changes (pre-commit hooks will run)
*   Push your branch and open a Pull Request against the `develop` repository branch 
