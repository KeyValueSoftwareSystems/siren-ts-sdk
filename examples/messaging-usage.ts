import 'dotenv/config';
import { SirenClient } from '../src';
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
    const messageId = await client.message.send(
      'direct',
      'U01UBCD06BB',
      'SLACK',
      'Hello! This is a direct message without template.'
    );
    console.log('Message sent:', messageId);

    // Send message using template
    const templateMessageId = await client.message.send(
      'direct',
      'U01UBCD06BB',
      'SLACK',
      undefined,
      'sampleTemplate',
      { user_name: 'Alan' }
    );
    console.log('Template message sent:', templateMessageId);

    // Get message status
    const status = await client.message.getStatus(messageId);
    console.log('Message status:', status);

    // Get message replies
    const replies = await client.message.getReplies(messageId);
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