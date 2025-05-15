import { SirenClient, SirenError, SirenAPIError, SirenValidationError } from '../src';

const apiToken = process.env.SIREN_API_TOKEN;
if (!apiToken) {
  console.error('Error: SIREN_API_TOKEN environment variable is not set');
  process.exit(1);
}

const client = new SirenClient({ apiToken, env: 'dev' });

async function templateExamples() {
  try {
    // Create a template
    const createRes = await client.template.createTemplate({
      name: 'Sample_Template1',
      description: 'sample template description',
      tagNames: ['sample_tag_1', 'sample_tag_2'],
      variables: [{ name: 'var1', defaultValue: 'var1 value' }],
      configurations: {
        SMS: {
          body: 'sample message body',
          channel: 'SMS',
          isFlash: false,
          isUnicode: false
        },
        EMAIL: {
          subject: 'test email subject',
          channel: 'EMAIL',
          body: '<p>test body</p>',
          attachments: [],
          isRawHTML: false,
          isPlainText: false
        }
      }
    });
    console.log('Create Template Response:', createRes);

    if (!createRes.data?.templateId) {
      throw new Error('Failed to create template: No template ID returned');
    }

    // Publish a template
    const publishRes = await client.template.publishTemplate(createRes.data.templateId);
    console.log('Publish Template Response:', publishRes);

    // Get all templates
    const getRes = await client.template.getTemplates();
    console.log('Get Templates Response:', getRes);

    // Update a template
    const updateRes = await client.template.updateTemplate(createRes.data.templateId, {
      name: 'Sample_Template1_Updated',
      description: 'updated template description',
      tagNames: ['sample_tag_1', 'sample_tag_2', 'sample_tag_3'],
      variables: [{ name: 'var1', defaultValue: 'updated var1 value' }],
      configurations: {
        SMS: {
          body: 'updated message body',
          channel: 'SMS',
          isFlash: false,
          isUnicode: false
        },
        EMAIL: {
          subject: 'updated email subject',
          channel: 'EMAIL',
          body: '<p>updated body</p>',
          attachments: [],
          isRawHTML: false,
          isPlainText: false
        }
      }
    });
    console.log('Update Template Response:', updateRes);

    // Delete a template
    const deleteRes = await client.template.deleteTemplate(createRes.data.templateId);
    console.log('Delete Template Response:', deleteRes);

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