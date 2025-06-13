import 'dotenv/config';
import { SirenClient } from '../src';

const apiToken = process.env.SIREN_API_KEY;
if (!apiToken) {
  console.error('Error: SIREN_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'dev' });

async function messagingExamples() {
  try {
    // 1. Send a message
    const messageId = await client.message.send(
      'sampleTemplate',
      'SLACK',
      'direct',
      'U01UBCD06BB',
      { user_name: 'John' }
    );
    console.log('Message sent with ID:', messageId);

    // 2. Get message status
    const status = await client.message.getStatus(messageId);
    console.log('Message status:', status);

    // 3. Get message replies
    const replies = await client.message.getReplies(messageId);
    console.log('Message replies:', replies);

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

messagingExamples(); 