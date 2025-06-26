import 'dotenv/config';
import { SirenClient, ProviderCode } from '../src';
import { SirenAPIError, SirenError } from '../src/common/errors';

const apiToken = process.env.SIREN_API_KEY;
if (!apiToken) {
  console.error('Error: SIREN_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'dev' });

async function messagingExamples() {
  try {
    // Send direct message without template
    const simpleMessageId = await client.message.send(
      'U01UBCD06BB', // Slack user ID
      'SLACK',
      'Hello! This is a direct message without specifying template/provider.',
    );
    console.log('Message sent:', simpleMessageId);


    // Send direct message without template
    const messageId = await client.message.send(
      'U01UBCD06BB', // Slack user ID
      'SLACK',
      'Hello! This is a direct message without template.',
      undefined, // templateName
      undefined, // templateVariables
      'slack-test-py-sdk', // provider name (optional)
      ProviderCode.SLACK // provider code (optional)
    );
    console.log('Message sent:', messageId);

    // Send message using template
    const templateMessageId = await client.message.send(
      'U01UBCD06BB',
      'SLACK',
      undefined,
      'sampleTemplate',
      { user_name: 'Alan' },
    );
    console.log('Template message sent:', templateMessageId);

    // // Send message using awesome template identifier
    const awesomeMessageId = await client.message.sendAwesomeTemplate(
      'U01UBCD06BB',
      'SLACK',
      'awesome-templates/customer-support/refund_complete/official/default.yaml',
      {
        "reference_id": "123456",
        "customer_name": "John"
      },
      'slack-test-py-sdk',
      ProviderCode.SLACK
    );
    console.log('Awesome template message sent:', awesomeMessageId);

    // Get message status
    const status = await client.message.getStatus(awesomeMessageId);
    console.log('Message status:', status);

    // Get message replies
    const replies = await client.message.getReplies(awesomeMessageId);
    console.log('Message replies:', replies);
  } catch (error) {
    if (error instanceof SirenAPIError) {
      console.error(`API Error: ${error.errorCode} - ${error.message}`);
    } else if (error instanceof SirenError) {
      console.error(`SDK Error: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

messagingExamples(); 