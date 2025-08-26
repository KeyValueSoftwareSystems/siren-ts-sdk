import 'dotenv/config';
import { SirenClient, SirenError, SirenAPIError, SirenValidationError, ProviderCode } from '../src';

const apiToken = process.env.SIREN_API_KEY;
if (!apiToken) {
  console.error('Error: SIREN_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'dev' });

async function providerExamples() {
  try {
    // 1. Create a provider
    const providerData = {
      providerCode: ProviderCode.SLACK,
      name: 'MySlack',
      configuration: {
        botAuthToken: 'xoxb-your-token',
        appId: 'A12345BCDE',
      },
    };
    const createRes = await client.provider.add(providerData);
    console.log('Create Provider Response:', createRes);

    if (!createRes?.id) {
      throw new Error('Failed to create provider: No provider ID returned');
    }
    const providerId = createRes.id;

    // 2. Update the provider
    const updatedProviderData = {
        ...providerData,
        name: 'UpdatedSlack',
    };
    const updateRes = await client.provider.update(providerId, updatedProviderData);
    console.log('Update Provider Response:', updateRes);

    // 3. Delete the provider
    const deleteRes = await client.provider.delete(providerId);
    console.log('Delete Provider Response:', deleteRes ? 'Provider deleted successfully' : 'Failed to delete provider');

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

providerExamples();