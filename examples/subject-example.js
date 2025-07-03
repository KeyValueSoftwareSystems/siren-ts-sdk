const { SirenClient, ProviderCode } = require('@trysiren/node');

// Initialize client
const client = new SirenClient({
  apiToken: process.env.SIREN_API_KEY || 'your-api-key-here',
  baseUrl: process.env.SIREN_ENV === 'dev' ? 'https://api.dev.trysiren.io' : 'https://api.trysiren.io'
});

async function demonstrateSubjectFunctionality() {
  try {
    console.log('📧 Demonstrating subject functionality for email messages...\n');

    // Example 1: Send a direct email with subject
    console.log('1. Sending direct email with subject...');
    const directEmailId = await client.message.send(
      'alice@company.com',
      'EMAIL',
      'Your account has been successfully verified. You can now access all features.',
      undefined,                       // template name
      undefined,                       // template variables
      undefined,                       // provider name
      undefined,                       // provider code
      'Account Verification Complete'  // subject
    );
    console.log(`✅ Direct email sent with ID: ${directEmailId}\n`);

    // Example 2: Send a template email with subject
    console.log('2. Sending template email with subject...');
    const templateEmailId = await client.message.send(
      'alice@company.com',
      'EMAIL',
      undefined,                       // body
      'welcome_template',              // template name
      { user_name: 'John' },           // template variables
      undefined,                       // provider name
      undefined,                       // provider code
      'Welcome to Our Platform'        // subject
    );
    console.log(`✅ Template email sent with ID: ${templateEmailId}\n`);

    // Example 3: Send awesome template email with subject
    console.log('3. Sending awesome template email with subject...');
    const awesomeTemplateEmailId = await client.message.sendAwesomeTemplate(
      'alice@company.com',
      'EMAIL',
      'awesome-templates/customer-support/escalation_required/official/casual.yaml',
      {
        ticket_id: '123456',
        customer_name: 'John',
        issue_summary: 'Payment processing issue',
        ticket_url: 'https://support.company.com/ticket/123456',
        sender_name: 'Support Team'
      },
      'email-provider',
      ProviderCode.EMAIL_SENDGRID,
      'Ticket Escalation Required'     // subject
    );
    console.log(`✅ Awesome template email sent with ID: ${awesomeTemplateEmailId}\n`);

    // Example 4: Send email without subject (backward compatibility)
    console.log('4. Sending email without subject (backward compatibility)...');
    const emailWithoutSubjectId = await client.message.send(
      'alice@company.com',
      'EMAIL',
      'This is an email without a subject line.'
    );
    console.log(`✅ Email without subject sent with ID: ${emailWithoutSubjectId}\n`);

    console.log('🎉 All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the demonstration
demonstrateSubjectFunctionality();