export const previewScenarios = [
  { id: 'home-empty', title: 'Home · Empty day' },
  { id: 'home-active', title: 'Home · Active task' },
  { id: 'home-completed', title: 'Home · Completed-heavy' },
  { id: 'task-create', title: 'Task form · Create' },
  { id: 'task-edit', title: 'Task form · Edit' },
  { id: 'ai-no-key', title: 'AI schedule · No API key' },
  { id: 'ai-empty-list', title: 'AI schedule · Empty list' },
  { id: 'ai-preview', title: 'AI schedule · Generated preview' },
  { id: 'settings-empty', title: 'Settings · Empty key' },
  { id: 'settings-validating', title: 'Settings · Validating key' },
  { id: 'settings-invalid', title: 'Settings · Invalid key' },
  { id: 'settings-saved', title: 'Settings · Saved key' },
] as const;
