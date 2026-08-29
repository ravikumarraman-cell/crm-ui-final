import { useState } from 'react';
import '../styles/oneness-theme.css';
import { SidebarRail } from '../components/crm/SidebarRail';
import { TopNavbar } from '../components/crm/TopNavbar';
import { ContactsHeaderToolbar } from '../components/crm/ContactsHeaderToolbar';
import { ContactsFilterBar } from '../components/crm/ContactsFilterBar';
import { ContactsDataTable } from '../components/crm/ContactsDataTable';
import { ContactsPagination } from '../components/crm/ContactsPagination';
import { ContactDetailPane } from '../components/crm/ContactDetailPane';
import { ContactPreviewDrawer } from '../components/crm/ContactPreviewDrawer';
import { ContactFormModal } from '../components/crm/ContactFormModal';
import { BreezeAiModal } from '../components/crm/BreezeAiModal';
import { Contact, ContactsFilterState, ContactsPaginationState } from '../core/crm/types';
import {
  useContactsQuery,
  useContactDetailQuery,
  createContactApi,
  updateContactApi,
  deleteContactApi,
  summarizeContactApi,
} from '../core/crm/contactsApi';

export function CrmContactsPage() {
  // Navigation active module state (Screenshot 1 CRM menu items)
  const [activeModule, setActiveModule] = useState('Contacts');

  // Filter state
  const [filters, setFilters] = useState<ContactsFilterState>({
    search: '',
    contactOwner: 'All',
    createDateRange: '',
    lastActivityRange: '',
    leadStatus: 'All',
    advancedFilters: false,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Pagination state
  const [pagination, setPagination] = useState<ContactsPaginationState>({
    pageIndex: 0,
    pageSize: 25,
    totalCount: 526895,
  });

  // Full Record Detail Contact (Screenshots 3 & 4)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // Quick Preview Drawer Contact (Screenshot 2)
  const [previewContact, setPreviewContact] = useState<Contact | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBreezeAiOpen, setIsBreezeAiOpen] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState('');

  // Queries
  const { data: contactsData, isLoading, refetch } = useContactsQuery(filters, pagination);
  const { data: detailContact, refetch: refetchDetail } = useContactDetailQuery(selectedContactId);

  const contactsList = contactsData?.contacts || [];
  const currentTotalCount = contactsData?.totalCount ?? 526895;

  // Handlers
  const handleCreateContact = async (data: Omit<Contact, 'id' | 'createDate'>) => {
    await createContactApi(data);
    refetch();
  };

  const handleUpdateContact = async (updates: Partial<Contact>) => {
    const idToUpdate = selectedContactId || previewContact?.id;
    if (!idToUpdate) return;
    await updateContactApi(idToUpdate, updates);
    refetchDetail();
    refetch();
    if (previewContact) {
      setPreviewContact((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContactApi(id);
    if (selectedContactId === id) {
      setSelectedContactId(null);
    }
    if (previewContact?.id === id) {
      setPreviewContact(null);
    }
    refetch();
  };

  const handleBulkDelete = async (ids: string[]) => {
    for (const id of ids) {
      await deleteContactApi(id);
    }
    refetch();
  };

  const handleSummarizeContact = async (contact: Contact) => {
    const summary = await summarizeContactApi(contact);
    setAiSummaryText(summary);
    setIsBreezeAiOpen(true);
  };

  return (
    <div className="oneness-app">
      {/* Dark Navigation Sidebar Rail with CRM Flyout (Screenshot 1) */}
      <SidebarRail activeModule={activeModule} onSelectModule={setActiveModule} />

      {/* Main Container Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Global Dark Top Navbar */}
        <TopNavbar
          onSearchChange={(term) => setFilters((prev) => ({ ...prev, search: term }))}
          onOpenQuickAdd={() => setIsAddModalOpen(true)}
          onOpenBreezeAI={() => {
            setAiSummaryText('');
            setIsBreezeAiOpen(true);
          }}
        />

        {/* Dynamic Main Workspace View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedContactId && detailContact ? (
            /* Screenshots 3 & 4: Contact Full Record Detail View */
            <ContactDetailPane
              contact={detailContact}
              onBack={() => setSelectedContactId(null)}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
              onSummarizeContact={handleSummarizeContact}
            />
          ) : (
            /* Screenshot 2 & List View: Contacts List View */
            <>
              {/* Header & Tabs */}
              <ContactsHeaderToolbar
                onAddContactClick={() => setIsAddModalOpen(true)}
              />

              {/* Filter Bar */}
              <ContactsFilterBar
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() =>
                  setFilters({
                    search: '',
                    contactOwner: 'All',
                    createDateRange: '',
                    lastActivityRange: '',
                    leadStatus: 'All',
                    advancedFilters: false,
                    sortBy: 'name',
                    sortOrder: 'asc',
                  })
                }
              />

              {/* TanStack Contacts Data Table */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <ContactsDataTable
                  contacts={contactsList}
                  onSelectContact={(c) => setSelectedContactId(c.id)}
                  onPreviewContact={(c) => setPreviewContact(c)}
                  onDeleteContact={handleDeleteContact}
                  onBulkDelete={handleBulkDelete}
                  onSummarizeContact={handleSummarizeContact}
                  isLoading={isLoading}
                />
              </div>

              {/* Bottom Pagination Bar */}
              <ContactsPagination
                pagination={{ ...pagination, totalCount: currentTotalCount }}
                onPageChange={(pageIndex) => setPagination((prev) => ({ ...prev, pageIndex }))}
                onPageSizeChange={(pageSize) => setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }))}
                onRefresh={() => refetch()}
                onExport={() => alert('Exporting contacts dataset to CSV...')}
                onClone={() => alert('Cloned contact views configuration.')}
              />
            </>
          )}
        </div>
      </div>

      {/* Screenshot 2: Quick Preview Slide-Over Drawer */}
      <ContactPreviewDrawer
        contact={previewContact}
        isOpen={!!previewContact}
        onClose={() => setPreviewContact(null)}
        onOpenFullRecord={(c) => setSelectedContactId(c.id)}
        onUpdateContact={handleUpdateContact}
        onSummarizeContact={handleSummarizeContact}
      />

      {/* Modals */}
      <ContactFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateContact}
      />

      <BreezeAiModal
        isOpen={isBreezeAiOpen}
        onClose={() => setIsBreezeAiOpen(false)}
        initialSummary={aiSummaryText}
        selectedContactName={detailContact?.name || previewContact?.name}
      />
    </div>
  );
}
export default CrmContactsPage;
