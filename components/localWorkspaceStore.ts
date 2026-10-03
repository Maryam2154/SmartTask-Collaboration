export type ProjectRecord = {
  id: string;
  name: string;
  desc: string;
  progress: number;
  color: string;
  due: string;
  tasks: string;
  done: string;
  assignees: string[];
};

export type TaskRecord = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  due: string;
  description: string;
  project: string;
};

export type LocalSettings = {
  compactNavigation: boolean;
  taskReminders: boolean;
  activityNotifications: boolean;
};

export const defaultLocalSettings: LocalSettings = {
  compactNavigation: false,
  taskReminders: true,
  activityNotifications: true,
};

export type LocalWorkspaceData = {
  projects: ProjectRecord[];
  tasks: TaskRecord[];
  taskStatuses: Record<string, string>;
  deletedProjectIds: string[];
  deletedTaskIds: string[];
  settings: LocalSettings;
};

const emptyWorkspace: LocalWorkspaceData = {
  projects: [],
  tasks: [],
  taskStatuses: {},
  deletedProjectIds: [],
  deletedTaskIds: [],
  settings: defaultLocalSettings,
};

function storageKey(email: string): string {
  return `smarttask.workspace.v1.${encodeURIComponent(email.trim().toLowerCase())}`;
}

export function readLocalWorkspace(email: string): LocalWorkspaceData {
  try {
    const stored = localStorage.getItem(storageKey(email));
    if (!stored) return emptyWorkspace;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return emptyWorkspace;
    const data = parsed as Partial<LocalWorkspaceData>;
    return {
      projects: Array.isArray(data.projects) ? data.projects : [],
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      taskStatuses: typeof data.taskStatuses === 'object' && data.taskStatuses !== null ? data.taskStatuses : {},
      deletedProjectIds: Array.isArray(data.deletedProjectIds) ? data.deletedProjectIds : [],
      deletedTaskIds: Array.isArray(data.deletedTaskIds) ? data.deletedTaskIds : [],
      settings: {
        compactNavigation: data.settings?.compactNavigation === true,
        taskReminders: data.settings?.taskReminders !== false,
        activityNotifications: data.settings?.activityNotifications !== false,
      },
    };
  } catch {
    return emptyWorkspace;
  }
}

export function writeLocalWorkspace(email: string, data: LocalWorkspaceData): void {
  localStorage.setItem(storageKey(email), JSON.stringify(data));
}