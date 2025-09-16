import 'dotenv/config';
import { SirenClient, SirenError, SirenAPIError, SirenValidationError } from '../src';

const apiToken = process.env.SIREN_API_KEY;
if (!apiToken) {
  console.error('Error: SIREN_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'dev' });

async function chatExamples() {
  try {
    const chatNodeId = 'chat_Dr-CrE'; // Replace with a valid chatNodeId
    const workflowExecutionId = '78713239-9b84-48f1-8f71-8b260255882d'; // Replace with a valid workflowExecutionId

    // 1. Send a chat message using a template
    const templateMessageRes = await client.chat.message({
      chatNodeId,
      workflowExecutionId,
      templateId: '07e9fef6-7f04-4269-9d2f-d019ec92fd7f', // Replace with a valid templateId
      templateVariables: {
        data: 'Hello from example',
      },
    });
    console.log('Send Template Message Response:', templateMessageRes);

    // 2. Send a chat message using body and subject
    const bodyMessageRes = await client.chat.message({
      chatNodeId,
      workflowExecutionId,
      body: 'This is a test message from the example.',
      subject: 'Test Message'
    });
    console.log('Send Body Message Response:', bodyMessageRes);

    // 3. End the chat
    const endChatRes = await client.chat.end({
      chatNodeId,
      workflowExecutionId,
    });
    console.log('End Chat Response:', endChatRes ? 'Chat ended successfully' : 'Failed to end chat');

  } catch (error) {
    if (error instanceof SirenValidationError) {
      console.error('Validation Error:', error.message);
    } else if (error instanceof SirenAPIError) {
      console.error('API Error:', {
        code: error.errorCode,
        message: error.message,
        statusCode: error.statusCode
      });
    } else if (error instanceof SirenError) {
      console.error('Siren Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

chatExamples();
