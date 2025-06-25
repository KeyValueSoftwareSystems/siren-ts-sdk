import { WorkflowClient } from './client';
import { ScheduleWorkflowRequest } from './types';

const API_TOKEN = 'test_api_token';
const BASE_URL = 'https://api.dev.trysiren.io';

describe('WorkflowClient', () => {
  let client: WorkflowClient;

  beforeEach(() => {
    client = new WorkflowClient({
      apiToken: API_TOKEN,
      env: 'dev',
    });
  });

  describe('schedule', () => {
    it('should schedule a one-time workflow successfully', async () => {
      const mockResponse = {
        data: {
          scheduleId: 'schedule_123',
          status: 'ACTIVE',
          workflowName: 'example_workflow',
          runAt: '2023-01-01T00:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.schedule({
        name: 'example_workflow',
        scheduleTime: '00:00:00',
        timezoneId: 'UTC',
        startDate: '2023-01-01',
        workflowType: 'ONCE',
        workflowId: 'workflow_123',
        inputData: { data: {} },
        endDate: ''
      });
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/schedules`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'example_workflow',
            scheduleTime: '00:00:00',
            timezoneId: 'UTC',
            startDate: '2023-01-01',
            type: 'ONCE',
            workflowId: 'workflow_123',
            inputData: { data: {} },
            endDate: ''
          }),
        }
      );
    });

    it('should schedule a daily workflow successfully', async () => {
      const mockResponse = {
        data: {
          scheduleId: 'schedule_456',
          status: 'ACTIVE',
          workflowName: 'example_workflow',
          runAt: '2023-01-01T00:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
        },
        error: null,
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      const result = await client.schedule({
        name: 'example_workflow',
        scheduleTime: '00:00:00',
        timezoneId: 'UTC',
        startDate: '2023-01-01',
        workflowType: 'DAILY',
        workflowId: 'workflow_123',
        inputData: { data: {} },
        endDate: '2023-01-31'
      });
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/api/v1/public/schedules`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'example_workflow',
            scheduleTime: '00:00:00',
            timezoneId: 'UTC',
            startDate: '2023-01-01',
            type: 'DAILY',
            workflowId: 'workflow_123',
            inputData: { data: {} },
            endDate: '2023-01-31'
          }),
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        data: null,
        error: { code: 'INVALID_WORKFLOW', message: 'Invalid workflow name' },
      };
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      });
      await expect(
        client.schedule({
          name: 'invalid_workflow',
          scheduleTime: '00:00:00',
          timezoneId: 'UTC',
          startDate: '2023-01-01',
          workflowType: 'ONCE',
          workflowId: 'workflow_123',
          inputData: { data: {} },
          endDate: ''
        })
      ).rejects.toThrow('Invalid workflow name');
    });
  });
}); 