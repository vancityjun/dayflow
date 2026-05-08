const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5-nano';

export type AiGeneratedTask = {
  title: string;
  durationMinutes: number;
};

type OpenAIResponse = {
  output_text?: string;
  output?: {
    content?: {
      type?: string;
      text?: string;
    }[];
  }[];
};

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['tasks'],
  properties: {
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'durationMinutes'],
        properties: {
          title: { type: 'string' },
          durationMinutes: { type: 'integer' },
        },
      },
    },
  },
};

export async function generateScheduleFromText(
  apiKey: string,
  roughPlan: string,
): Promise<AiGeneratedTask[]> {
  const trimmed = roughPlan.trim();
  if (!apiKey.trim()) throw new Error('Add your OpenAI API key in Settings first.');
  if (!trimmed) throw new Error('Enter a rough plan first.');

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: [
        {
          role: 'system',
          content:
            'You are a scheduling assistant. Convert rough plans into clear tasks. Estimate realistic durations in minutes. Return structured data only.',
        },
        {
          role: 'user',
          content: `Create a sequential schedule task list from this rough plan: ${trimmed}`,
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'dayflow_schedule',
          strict: true,
          schema: responseSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `OpenAI request failed with ${response.status}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const output = getResponseText(data);
  if (!output) throw new Error('OpenAI returned an empty response.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(output);
  } catch {
    throw new Error('OpenAI returned invalid JSON.');
  }

  return validateGeneratedTasks(parsed);
}

function getResponseText(data: OpenAIResponse): string | null {
  if (data.output_text) return data.output_text;

  const texts = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter((text): text is string => Boolean(text));

  return texts?.join('\n') || null;
}

function validateGeneratedTasks(value: unknown): AiGeneratedTask[] {
  if (!value || typeof value !== 'object' || !('tasks' in value)) {
    throw new Error('AI response did not include tasks.');
  }

  const tasks = (value as { tasks: unknown }).tasks;
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new Error('AI response did not include any tasks.');
  }

  return tasks.map((task) => {
    if (!task || typeof task !== 'object') {
      throw new Error('AI response included an invalid task.');
    }

    const raw = task as { title?: unknown; durationMinutes?: unknown };
    if (typeof raw.title !== 'string' || !raw.title.trim()) {
      throw new Error('AI response included a task without a title.');
    }
    if (typeof raw.durationMinutes !== 'number' || !Number.isFinite(raw.durationMinutes)) {
      throw new Error('AI response included an invalid duration.');
    }

    return {
      title: raw.title.trim(),
      durationMinutes: Math.round(raw.durationMinutes),
    };
  });
}
