import { config } from 'dotenv';
import { SirenClient } from '../src/client';

// Load environment variables from .env file
config();

async function userExamples() {
  // Initialize the client with your API token
  const client = new SirenClient({
    apiToken: process.env.SIREN_API_KEY || '',
    env: 'dev',
  });

  try {
    // Add a new user
    const user = await client.user.add({
      uniqueId: 'john_doe_008',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      activeChannels: ['EMAIL', 'SMS'],
      active: true,
    });
    console.log('Created user:', user.id);

    // Update the user
    const updatedUser = await client.user.update('john_doe_008', {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      activeChannels: ['EMAIL', 'SMS', 'WHATSAPP'],
    });
    console.log('Updated user:', updatedUser.id);

    // Delete the user
    const deleted = await client.user.delete('john_doe_008');
    console.log('Deleted user:', deleted);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Run the examples
userExamples().catch(console.error); 