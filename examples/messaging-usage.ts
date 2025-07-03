import 'dotenv/config';
import { SirenClient, ProviderCode, RecipientChannel } from '../src';
import { SirenAPIError, SirenError } from '../src/common/errors';

const apiToken = process.env.SIREN_API_KEY;
if (!apiToken) {
  console.error('Error: SIREN_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'prod' });

async function messagingExamples() {
  try {
    // Send direct message without template
    const directMessageWithoutTemplateParams = {
      recipientValue: 'U01UBCD06BB',
      channel: RecipientChannel.SLACK,
      body: 'Hello! This is a direct message without specifying template/provider.'
    };
    const simpleMessageId = await client.message.send(
      directMessageWithoutTemplateParams
    );
    console.log('Message sent:', simpleMessageId);

    // Send direct message without template but with provider
    const directMessageWithProviderParams = {
      recipientValue: 'U01UBCD06BB',
      channel: RecipientChannel.SLACK,
      body: 'Hello! This is a direct message without template.',
      providerName: 'slack-test-py-sdk', // optional
      providerCode: ProviderCode.SLACK // optional
    };
    const messageId = await client.message.send(
      directMessageWithProviderParams
    );

    console.log('Message sent:', messageId);

    // Send message using template
    const messageWithTemplateParams = {
      recipientValue: 'U01UBCD06BB',
      channel: RecipientChannel.SLACK,
      templateName: 'sampleTemplate',
      templateVariables: { user_name: 'Alan' }
    };
    const templateMessageId = await client.message.send(
      messageWithTemplateParams
    );
    console.log('Template message sent:', templateMessageId);

    // Send message using awesome template identifier
    const SendAwesomeTemplateParams = {
      recipientValue: 'U01UBCD06BB',
      channel: RecipientChannel.SLACK,
      templateIdentifier:
        'awesome-templates/customer-support/refund_complete/official/default.yaml',
      templateVariables: {
        reference_id: '123456',
        customer_name: 'John'
      },
      providerName: 'slack-test-py-sdk',
      providerCode: ProviderCode.SLACK
    };

    const awesomeMessageId = await client.message.sendAwesomeTemplate(
      SendAwesomeTemplateParams
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
