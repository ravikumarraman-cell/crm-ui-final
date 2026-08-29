export type LifecycleStage =
  | 'Subscriber'
  | 'Lead'
  | 'Marketing Qualified Lead'
  | 'Sales Qualified Lead'
  | 'Opportunity'
  | 'Customer'
  | 'Evangelist'
  | 'Other';

export type LeadStatus =
  | 'New'
  | 'Open'
  | 'In Progress'
  | 'Open Deal'
  | 'Unqualified'
  | 'Attempted to Contact'
  | 'Connected'
  | 'Bad Timing';

export type ContactPriority = 'high' | 'medium' | 'low';

export interface ContactActivity {
  id: string;
  type: 'note' | 'email' | 'call' | 'task' | 'meeting';
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  owner?: string;
  lifecycleStage?: LifecycleStage;
  leadStatus?: LeadStatus;
  priority?: ContactPriority;
  lastActivityDate?: string;
  createDate: string;
  company?: string;
  gender?: string;
  avatarBg?: string;
  statusBanner?: string;
  bounced?: boolean;
  activities?: ContactActivity[];
  notes?: string;
}

export interface ContactsFilterState {
  search: string;
  contactOwner: string;
  createDateRange: string;
  lastActivityRange: string;
  leadStatus: string;
  advancedFilters: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ContactsPaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}
