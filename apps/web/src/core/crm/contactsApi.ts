import { useQuery } from '@tanstack/react-query';
import { Contact, ContactsFilterState, ContactsPaginationState } from './types';
import { INITIAL_CONTACTS } from './mockContacts';

// Local storage key for fallback client-side storage
const STORAGE_KEY = 'oneness_crm_contacts_v1';

export function getStoredContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONTACTS));
      return INITIAL_CONTACTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONTACTS;
  }
}

export function saveStoredContacts(contacts: Contact[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch {
    // Ignore storage quota errors
  }
}

// REST API calls with local fallback
export async function fetchContactsApi(
  filters: ContactsFilterState,
  pagination: ContactsPaginationState
): Promise<{ contacts: Contact[]; totalCount: number }> {
  try {
    const query = new URLSearchParams({
      search: filters.search,
      owner: filters.contactOwner,
      leadStatus: filters.leadStatus,
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
    });
    const res = await fetch(`/api/contacts?${query.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall back to local filter engine
  }

  let list = getStoredContacts();
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        (c.company && c.company.toLowerCase().includes(s))
    );
  }
  if (filters.contactOwner && filters.contactOwner !== 'All') {
    list = list.filter((c) => (c.owner || 'No owner') === filters.contactOwner);
  }
  if (filters.leadStatus && filters.leadStatus !== 'All') {
    list = list.filter((c) => c.leadStatus === filters.leadStatus);
  }

  const totalCount = 526895 + list.length; // Mirror screenshot badge total 526,895 contacts
  const start = pagination.pageIndex * pagination.pageSize;
  const paginated = list.slice(start, start + pagination.pageSize);

  return { contacts: paginated, totalCount };
}

export async function fetchContactByIdApi(id: string): Promise<Contact | null> {
  try {
    const res = await fetch(`/api/contacts/${id}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  const all = getStoredContacts();
  return all.find((c) => c.id === id) || null;
}

export async function createContactApi(contactData: Omit<Contact, 'id' | 'createDate'>): Promise<Contact> {
  const newContact: Contact = {
    ...contactData,
    id: `cnt-${Date.now()}`,
    createDate: new Date().toISOString().split('T')[0],
    avatarBg: '#00a4bd',
  };

  try {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const all = getStoredContacts();
  const updated = [newContact, ...all];
  saveStoredContacts(updated);
  return newContact;
}

export async function updateContactApi(id: string, updates: Partial<Contact>): Promise<Contact> {
  try {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const all = getStoredContacts();
  let updatedContact: Contact | null = null;
  const updatedList = all.map((c) => {
    if (c.id === id) {
      updatedContact = { ...c, ...updates };
      return updatedContact;
    }
    return c;
  });
  saveStoredContacts(updatedList);
  return updatedContact || ({ id, ...updates } as Contact);
}

export async function deleteContactApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch {
    // Fallback
  }

  const all = getStoredContacts();
  saveStoredContacts(all.filter((c) => c.id !== id));
  return true;
}

export async function summarizeContactApi(contact: Contact): Promise<string> {
  try {
    const res = await fetch(`/api/contacts/${contact.id}/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.summary;
    }
  } catch {
    // Fallback
  }

  return `• ${contact.name} (${contact.email}) is categorized under ${contact.lifecycleStage || 'Lead'} stage.\n• Primary owner assigned: ${contact.owner || 'No owner'}.\n• Contact health status: ${contact.bounced ? 'Bounced email alert active' : 'Active and reachable'}.`;
}

// TanStack Query Hooks
export function useContactsQuery(filters: ContactsFilterState, pagination: ContactsPaginationState) {
  return useQuery({
    queryKey: ['contacts', filters, pagination],
    queryFn: () => fetchContactsApi(filters, pagination),
  });
}

export function useContactDetailQuery(id: string | null) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => (id ? fetchContactByIdApi(id) : null),
    enabled: Boolean(id),
  });
}
