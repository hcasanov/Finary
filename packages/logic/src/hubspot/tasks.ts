import type { CreateHubSpotTask } from '@finary/types';
import type { HubSpotClient } from './client';

export async function createContactTask(
  client: HubSpotClient,
  task: CreateHubSpotTask,
): Promise<string> {
  // 1. Create the task object
  const result = await client.request<{ id: string }>('/crm/v3/objects/tasks', {
    method: 'POST',
    body: {
      properties: {
        hs_task_subject: task.subject,
        hs_task_body: task.body ?? '',
        hs_task_status: 'NOT_STARTED',
        hs_task_priority: task.priority,
        hs_task_type: 'TODO',
        hs_timestamp: task.dueDate,
        ...(task.ownerId !== undefined ? { hubspot_owner_id: task.ownerId } : {}),
      },
    },
  });

  // 2. Associate task → contact
  await client.request('/crm/v3/associations/tasks/contacts/batch/create', {
    method: 'POST',
    body: {
      inputs: [
        {
          from: { id: result.id },
          to: { id: task.contactId },
          type: 'task_to_contact',
        },
      ],
    },
  });

  return result.id;
}

export async function createContactTasks(
  client: HubSpotClient,
  tasks: CreateHubSpotTask[],
): Promise<string[]> {
  return Promise.all(tasks.map((t) => createContactTask(client, t)));
}
