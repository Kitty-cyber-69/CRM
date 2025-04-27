export type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  tags?: string[];
  notes?: string;
  projects?: Project[];
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  start_date: string;
  deadline?: string;
  end_date?: string;
  budget?: number;
  customer_id: string;
  description?: string;
  milestones?: Milestone[];
};

export type Milestone = {
  id: string;
  name: string;
  status: MilestoneStatus;
  deadline?: string;
  project_id: string;
};

export enum ProjectStatus {
  INQUIRY = 'inquiry',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
}

export enum MilestoneStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export type KPIData = {
  totalCustomers: number;
  totalProjects: number;
  projectsByStatus: Record<ProjectStatus, number>;
  upcomingDeadlines: Project[];
  totalBudget: number;
};

export type Filter = {
  search: string;
  status: ProjectStatus | '';
  tags: string[];
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
};