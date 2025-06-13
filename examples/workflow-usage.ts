import { SirenClient } from '../src';

async function main() {
  const client = new SirenClient({
    apiToken: process.env.SIREN_API_KEY || '',
    env: 'dev' as const
  });

  try {
    // 1. Trigger a single workflow
    const execution = await client.workflow.trigger({
      workflowName: 'sampleWorkflow',
      data: { subject: 'Welcome' },
      notify: { email: 'user@example.com' }
    });
    if (execution.data) {
      console.log('Workflow triggered:', execution.data.workflowExecutionId);
    }

    // 2. Trigger a bulk workflow
    const bulkExecution = await client.workflow.triggerBulk({
      workflowName: 'sampleWorkflow',
      notify: [
        { email: 'user1@example.com' },
        { email: 'user2@example.com' }
      ],
      data: { template: 'welcome' }
    });
    if (bulkExecution.data) {
      console.log('Bulk workflow triggered:', bulkExecution.data.workflowExecutionIds);
    }

    // 3. Schedule a workflow
    const schedule = await client.workflow.schedule({
      name: 'sampleWorkflow',
      scheduleTime: '19:40:00',
      timezoneId: 'Asia/Kolkata',
      startDate: '2025-05-22',
      workflowType: 'ONCE',
      workflowId: 'acd59a55-1072-41a7-90d9-5554b21aef1b',
      inputData: { data: {} },
      endDate: ''
    });
    console.log('Workflow scheduled:', schedule.scheduleId);

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

main(); 