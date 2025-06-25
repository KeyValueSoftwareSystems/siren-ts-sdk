import 'dotenv/config';
import { SirenClient } from '../src';
import { SirenAPIError, SirenError } from '../src/common/errors';

const apiToken = process.env.SIREN_API_KEY;
if (!apiToken) {
  console.error('Error: SIREN_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'dev' });

async function userExamples() {
  try {
    // Add user
    const user = await client.user.add({
      uniqueId: 'john_doe_008',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      activeChannels: ['EMAIL', 'SMS'],
      active: true
    });
    console.log('Created user:', user.id);

    // Update user
    const updatedUser = await client.user.update('john_doe_008', {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      activeChannels: ['EMAIL', 'SMS', 'WHATSAPP']
    });
    console.log('Updated user:', updatedUser.id);

    // Delete user
    const deleted = await client.user.delete('john_doe_008');
    console.log('Deleted user:', deleted);
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

userExamples(); 