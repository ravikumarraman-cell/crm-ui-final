import { useState } from 'react';
import { Mail, Phone, Eye, Trash2, Sparkles, Building } from 'lucide-react';
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

// Dynamic Workspace Views
import { HomeDashboardView } from '../components/crm/views/HomeDashboardView';
import { AnalyticsView } from '../components/crm/views/AnalyticsView';
import { DealsView } from '../components/crm/views/DealsView';
import { CompaniesView } from '../components/crm/views/CompaniesView';

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

  // View Mode: 'list' (Table) or 'grid' (Cards)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
            (() => {
              const mod = activeModule.toLowerCase();
              if (mod === 'home') {
                return <HomeDashboardView contacts={contactsList} onSelectModule={setActiveModule} />;
              }
              if (mod === 'analytics') {
                return <AnalyticsView contacts={contactsList} />;
              }
              if (mod === 'deals') {
                return <DealsView />;
              }
              if (mod === 'companies') {
                return <CompaniesView />;
              }
              
              // Fallback to traditional contacts list
              return (
                /* Screenshot 2 & List View: Contacts List View / Card Grid View */
                <>
                  {/* Header & Tabs */}
                  <ContactsHeaderToolbar
                    onAddContactClick={() => setIsAddModalOpen(true)}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
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

                  {/* Dynamically Swapped Layouts */}
                  {viewMode === 'list' ? (
                    /* Traditional Table View */
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
                  ) : (
                    /* Spectacular Premium Card Grid View (100% Responsive) */
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem 1.5rem 1.5rem' }}>
                      {isLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b' }}>
                          Loading contacts...
                        </div>
                      ) : contactsList.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b' }}>
                          No contacts found matching the selected filters.
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '1rem',
                            paddingTop: '0.5rem',
                          }}
                        >
                          {contactsList.map((contact) => {
                            const initial = contact.name.charAt(0).toUpperCase();
                            
                            // Lead status pill colors
                            let statusBg = '#e2e8f0';
                            let statusColor = '#475569';
                            const statusStr = (contact.leadStatus || '') as string;
                            if (statusStr === 'New') {
                              statusBg = '#e0f2fe';
                              statusColor = '#0369a1';
                            } else if (statusStr === 'Attempted to Contact') {
                              statusBg = '#fef3c7';
                              statusColor = '#b45309';
                            } else if (statusStr === 'Connected') {
                              statusBg = '#dcfce7';
                              statusColor = '#15803d';
                            } else if (statusStr === 'Qualified') {
                              statusBg = '#f0fdf4';
                              statusColor = '#16a34a';
                            } else if (statusStr === 'Unqualified') {
                              statusBg = '#fee2e2';
                              statusColor = '#b91c1c';
                            }

                            return (
                              <div
                                key={contact.id}
                                className="oneness-card"
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  padding: '1.25rem',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0',
                                  background: '#ffffff',
                                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                  cursor: 'default',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'none';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div>
                                  {/* Card Header (Avatar + Name + Company) */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div
                                      className="oneness-avatar"
                                      style={{
                                        backgroundColor: contact.avatarBg || '#00a4bd',
                                        color: '#ffffff',
                                        width: '40px',
                                        height: '40px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                      }}
                                    >
                                      {initial}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedContactId(contact.id)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: '#0f172a',
                                          fontWeight: 700,
                                          fontSize: '14px',
                                          cursor: 'pointer',
                                          padding: 0,
                                          textAlign: 'left',
                                          display: 'block',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          width: '100%',
                                        }}
                                        title="View Full Profile"
                                      >
                                        {contact.name}
                                      </button>
                                      {contact.company ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                          <Building size={11} />
                                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {contact.company}
                                          </span>
                                        </div>
                                      ) : (
                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                          No company associated
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div style={{ height: '1px', background: '#f1f5f9', margin: '0.75rem 0' }} />

                                  {/* Contact Details */}
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                                      <Mail size={13} style={{ color: '#00a4bd', flexShrink: 0 }} />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {contact.email || 'N/A'}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                                      <Phone size={13} style={{ color: '#00a4bd', flexShrink: 0 }} />
                                      <span>{contact.phoneNumber || 'N/A'}</span>
                                    </div>
                                    <div style={{ marginTop: '0.25rem' }}>
                                      <span
                                        style={{
                                          backgroundColor: statusBg,
                                          color: statusColor,
                                          fontSize: '10px',
                                          fontWeight: 600,
                                          padding: '2px 8px',
                                          borderRadius: '9999px',
                                          textTransform: 'capitalize',
                                          display: 'inline-block',
                                        }}
                                      >
                                        {contact.leadStatus}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Card Actions Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: 'auto' }}>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewContact(contact)}
                                    style={{
                                      background: '#f8fafc',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '4px',
                                      color: '#0f172a',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      padding: '4px 10px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                    title="Quick Preview"
                                  >
                                    <Eye size={12} style={{ color: '#00a4bd' }} /> Preview
                                  </button>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleSummarizeContact(contact)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#00a4bd',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                      title="AI Summarize Contact"
                                    >
                                      <Sparkles size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteContact(contact.id)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                      title="Delete Contact"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

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
              );
            })()
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
