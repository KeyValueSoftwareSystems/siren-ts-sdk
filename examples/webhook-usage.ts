import { config } from 'dotenv';
import { SirenClient } from '../src/client';

config();

async function webhookExamples() {
  const client = new SirenClient({
    apiToken: process.env.SIREN_API_KEY || '',
    env: 'dev',
  });

  try {
    // Configure status notification webhook
    const notifResult = await client.webhook.configureNotifications({
      url: 'https://example.com/webhook/notifications',
      secret: 'supersecret',
    });
    if (notifResult.webhookConfig) {
      console.log('Notification webhook configured:', notifResult.webhookConfig.url, '(key:', notifResult.webhookConfig.verificationKey, ')');
    } else {
      console.log('Notification webhook response:', notifResult);
    }

    // Configure inbound webhook
    const inboundResult = await client.webhook.configureInbound({
      url: 'https://example.com/webhook/inbound',
      secret: 'supersecret',
    });
    if (inboundResult.inboundWebhookConfig) {
      console.log('Inbound webhook configured:', inboundResult.inboundWebhookConfig.url, '(key:', inboundResult.inboundWebhookConfig.verificationKey, ')');
    } else {
      console.log('Inbound webhook response:', inboundResult);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

webhookExamples().catch(console.error); 