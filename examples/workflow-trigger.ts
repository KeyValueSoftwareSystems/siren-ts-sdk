import { SirenClient } from '../src';

// Get API token from environment variable
const apiToken = process.env.SIREN_API_TOKEN || '<your-api-token>';

if (!apiToken) {
    console.error('Error: SIREN_API_TOKEN environment variable is not set');
    process.exit(1);
}

// Initialize the SDK with your API token
const client = new SirenClient({ apiToken, env: 'dev' });

async function triggerOTPWorkflow() {
    try {
        const response = await client.workflow.triggerWorkflow({
            workflowName: 'otp',
            data: {
                subject: 'OTP Verification',
                template: 'otp-verification'
            },
            notify: {
                notificationType: 'email',
                recipient: 'user@example.com',
                metadata: {
                    otp: '123456',
                    expiry: '10 minutes'
                }
            }
        });

        if (response.error) {
            console.error('Error:', response.error);
            return;
        }

        console.log('Workflow triggered successfully!');
        console.log('Request ID:', response.data?.requestId);
        console.log('Workflow Execution ID:', response.data?.workflowExecutionId);
    } catch (error) {
        console.error('Failed to trigger workflow:', error);
    }
}

// Run the example
triggerOTPWorkflow(); 