import { SirenClient } from '../src';

// Get API token from environment variable
const apiToken = process.env.SIREN_API_TOKEN || '<your-api-token>';

if (!apiToken) {
  console.error('Error: SIREN_API_TOKEN environment variable is not set');
  process.exit(1);
}

// Initialize the SDK with your API token
const client = new SirenClient({ apiToken, env: 'dev' });

async function triggerBulkOTPWorkflow() {
  try {
    const response = await client.workflow.triggerBulkWorkflow({
      workflowName: 'otp',
      data: {
        subject: 'OTP Verification',
        template: 'otp-verification'
      },
      notify: [
        {
          notificationType: 'email',
          recipient: 'user1@example.com',
          metadata: {
            otp: '123456',
            expiry: '10 minutes'
          }
        },
        {
          notificationType: 'sms',
          recipient: '+1234567890',
          metadata: {
            otp: '789012',
            expiry: '10 minutes'
          }
        }
      ]
    });

    if (response.error) {
      console.error('Error:', response.error);
      return;
    }

    console.log('Bulk workflow triggered successfully!');
    console.log('Request ID:', response.data?.requestId);
    console.log('Workflow Execution IDs:', response.data?.workflowExecutionIds);
  } catch (error) {
    console.error('Failed to trigger bulk workflow:', error);
  }
}

// Run the example
triggerBulkOTPWorkflow(); 