import 'dotenv/config';
import { SirenClient, SirenError, SirenAPIError, SirenValidationError } from '../src';

const apiToken = process.env.SIREN_API_KEY;
if (!apiToken) {
  console.error('Error: SIREN_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'dev' });

async function templateExamples() {
  try {
    // 1. Create the template
    const createRes = await client.template.create({
      name: 'Welcome_Email_Example',
      description: 'A welcome email template',
      tagNames: ['welcome'],
      variables: [{ name: 'user_name', defaultValue: 'Guest' }],
      configurations: {
        SMS: {
          body: 'Hi {{user_name}}! Welcome aboard!',
          channel: 'SMS',
          isFlash: false,
          isUnicode: false
        },
        EMAIL: {
          subject: 'Welcome {{user_name}}!',
          channel: 'EMAIL',
          body: '<h1>Hello {{user_name}}!</h1>',
          attachments: [],
          isRawHTML: true,
          isPlainText: false
        }
      }
    });
    console.log('Create Template Response:', createRes);

    if (!createRes.data?.templateId) {
      throw new Error('Failed to create template: No template ID returned');
    }

    // 2. Create channel templates
    const channelTemplateRes = await client.template.createChannelTemplate(createRes.data.templateId, {
      EMAIL: {
        subject: 'Welcome {{user_name}}!',
        channel: 'EMAIL',
        body: '<h1>Hello {{user_name}}!</h1>',
        attachments: [],
        isRawHTML: true,
        isPlainText: false
      },
      SMS: {
        body: 'Hi {{user_name}}! Welcome aboard!',
        channel: 'SMS',
        isFlash: false,
        isUnicode: false
      }
    });
    console.log('Create Channel Templates Response:', channelTemplateRes);

    // 3. Update the template
    const updateRes = await client.template.update(createRes.data.templateId, {
      name: 'Updated_Welcome_Template',
      description: 'Updated welcome email template',
      tagNames: ['welcome', 'updated']
    });
    console.log('Update Template Response:', updateRes);

    // 4. Publish the template
    const publishRes = await client.template.publish(createRes.data.templateId);
    console.log('Publish Template Response:', publishRes);

    // 5. Get channel templates for the published version
    const publishedVersionId = publishRes.data?.publishedVersion?.id;
    if (publishedVersionId) {
      const getChannelTemplatesRes = await client.template.getChannelTemplates(publishedVersionId);
      console.log('Get Channel Templates Response:', getChannelTemplatesRes);
    }

    // 6. Get all templates
    const getRes = await client.template.get();
    console.log('Get Templates Response:', getRes);

    // 7. Delete the template
    const deleteRes = await client.template.delete(createRes.data.templateId);
    console.log('Delete Template Response:', deleteRes.data ? 'Template deleted successfully' : 'Failed to delete template');

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

templateExamples(); 