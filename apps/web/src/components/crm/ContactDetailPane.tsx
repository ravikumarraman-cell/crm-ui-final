import { useState } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  Edit3,
  Mail,
  Phone,
  CheckSquare,
  Calendar,
  Sparkles,
  ExternalLink,
  AlertCircle,
  MoreHorizontal,
  Settings,
  Search,
  Plus,
  Minimize2,
  Facebook,
  Linkedin,
  Twitter,
  Copy,
  User,
  Building,
} from 'lucide-react';
import { Contact, LifecycleStage, LeadStatus } from '../../core/crm/types';
import { toast } from '../../lib/toast';

interface ContactDetailPaneProps {
  contact: Contact;
  onBack: () => void;
  onUpdateContact: (updates: Partial<Contact>) => void;
  onDeleteContact: (id: string) => void;
  onSummarizeContact: (contact: Contact) => void;
}

export function ContactDetailPane({
  contact,
  onBack,
  onUpdateContact,
  onDeleteContact,
  onSummarizeContact,
}: ContactDetailPaneProps) {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Activities' | 'Intelligence'>('Overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activitySearch, setActivitySearch] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newAct = {
      id: `act-${Date.now()}`,
      type: 'note' as const,
      title: 'Sales Note Logged',
      content: newNoteText,
      createdAt: new Date().toLocaleString(),
      author: 'Current User',
    };
    const updatedActivities = [newAct, ...(contact.activities || [])];
    onUpdateContact({ activities: updatedActivities, notes: newNoteText });
    setNewNoteText('');
    setIsAddingNote(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* Top Bar Header with Navigation & Dropdown Actions */}
      <div
        style={{
          padding: '0.75rem 1.5rem',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#00a4bd',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            <ChevronLeft size={18} /> Contacts
          </button>
        </div>

        {/* Actions Dropdown Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowActionsDropdown(!showActionsDropdown)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '0.35rem 0.85rem',
              color: '#00a4bd',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Actions <ChevronDown size={14} />
          </button>

          {showActionsDropdown && (
            <div
              className="oneness-dropdown"
              style={{
                position: 'absolute',
                top: '105%',
                right: 0,
                width: 240,
                zIndex: 100,
              }}
            >
              <div
                className="oneness-dropdown-item"
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  setShowActionsDropdown(false);
                }}
              >
                <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
              </div>
              <div className="oneness-dropdown-divider" />
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>View all properties</span>
              </div>
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>View property history</span>
              </div>
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>View association history</span>
              </div>
              <div className="oneness-dropdown-divider" />

              {/* ✨ Summarize AI Feature */}
              <div
                className="oneness-dropdown-item"
                style={{ color: '#00a4bd', fontWeight: 600 }}
                onClick={() => {
                  setShowActionsDropdown(false);
                  onSummarizeContact(contact);
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} /> Summarize with AI
                </span>
              </div>

              <div className="oneness-dropdown-divider" />
              <div
                className="oneness-dropdown-item"
                style={{ color: '#ef4444' }}
                onClick={() => {
                  setShowActionsDropdown(false);
                  if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
                    onDeleteContact(contact.id);
                  }
                }}
              >
                <span>Delete</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Panel + Right Content Pane */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Column (Persistent Profile & Properties Pane - Screenshots 2, 3, 4) */}
        <div
          style={{
            width: 320,
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            flexShrink: 0,
          }}
        >
          {/* Bounced Banner Card (Screenshots 2, 3, 4) */}
          {(contact.bounced || contact.statusBanner) && (
            <div className="oneness-bounced-banner">
              <AlertCircle size={16} style={{ color: '#00a4bd', flexShrink: 0 }} />
              <span>{contact.statusBanner || 'Contact has bounced.'}</span>
            </div>
          )}

          {/* Profile Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: contact.avatarBg || '#e2e8f0',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                <User size={22} style={{ color: '#64748b' }} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  {contact.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: '12px', color: '#64748b', wordBreak: 'break-all' }}>{contact.email}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                    title={copiedEmail ? 'Copied!' : 'Copy email'}
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Round Icon Buttons (Screenshots 2, 3, 4) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.3rem',
                marginTop: '0.5rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              {[
                { id: 'note', label: 'Note', icon: Edit3, act: () => setIsAddingNote(!isAddingNote) },
                { id: 'email', label: 'Email', icon: Mail, act: () => window.open(`mailto:${contact.email}`) },
                { id: 'call', label: 'Call', icon: Phone, act: () => toast.info(`Calling ${contact.name}...`) },
                { id: 'task', label: 'Task', icon: CheckSquare, act: () => toast.success('Created task for contact.') },
                { id: 'meeting', label: 'Meeting', icon: Calendar, act: () => toast.success('Scheduled meeting.') },
                { id: 'more', label: 'More', icon: MoreHorizontal, act: () => setShowActionsDropdown(true) },
              ].map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={btn.act}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      background: 'none',
                      border: 'none',
                      color: '#475569',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                      }}
                    >
                      <Icon size={15} style={{ color: '#00a4bd' }} />
                    </div>
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Inline Note Composer */}
            {isAddingNote && (
              <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.65rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <textarea
                  placeholder="Type note content..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  style={{ width: '100%', height: 50, border: '1px solid #cbd5e1', borderRadius: 4, padding: 6, fontSize: 12 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                  <button type="button" className="oneness-btn-secondary" onClick={() => setIsAddingNote(false)} style={{ fontSize: 11, padding: '2px 6px' }}>Cancel</button>
                  <button type="button" className="oneness-btn-teal" onClick={handleAddNote} style={{ fontSize: 11, padding: '2px 8px' }}>Save Note</button>
                </div>
              </div>
            )}
          </div>

          {/* About This Contact Accordion (Screenshots 2, 3, 4) */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChevronDown size={14} style={{ color: '#00a4bd' }} /> About this contact
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowActionsDropdown(true)}
                  style={{ background: 'none', border: 'none', color: '#00a4bd', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  Actions <ChevronDown size={12} />
                </button>
                <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <Settings size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '12px' }}>
              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Email</label>
                <div style={{ color: '#0f172a', fontWeight: 500 }}>{contact.email}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Phone Number</label>
                <div style={{ color: '#64748b' }}>{contact.phoneNumber || '--'}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Lifecycle Stage</label>
                <select
                  value={contact.lifecycleStage || ''}
                  onChange={(e) => onUpdateContact({ lifecycleStage: e.target.value as LifecycleStage })}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    padding: '4px 6px',
                    fontSize: 12,
                    marginTop: 2,
                    background: '#ffffff',
                    color: contact.lifecycleStage ? '#0f172a' : '#64748b',
                  }}
                >
                  <option value="">Select a stage</option>
                  {['Subscriber', 'Lead', 'Marketing Qualified Lead', 'Sales Qualified Lead', 'Opportunity', 'Customer', 'Evangelist'].map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Contact owner</label>
                <div style={{ color: '#0f172a' }}>{contact.owner || 'No owner'}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Last Contacted</label>
                <div style={{ color: '#0f172a' }}>{contact.lastActivityDate || '2026-08-29 5:58 AM EDT'}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Lead Status</label>
                <select
                  value={contact.leadStatus || ''}
                  onChange={(e) => onUpdateContact({ leadStatus: e.target.value as LeadStatus })}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    padding: '4px 6px',
                    fontSize: 12,
                    marginTop: 2,
                    background: '#ffffff',
                    color: contact.leadStatus ? '#0f172a' : '#64748b',
                  }}
                >
                  <option value="">Select status</option>
                  {['New', 'Open', 'In Progress', 'Open Deal', 'Connected', 'Attempted to Contact'].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Gender</label>
                <div style={{ color: '#64748b' }}>{contact.gender || '--'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Body: Top Tab Header & Tab View Contents (Screenshots 3 & 4) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Top Tab Headers matching Screenshots 3 & 4 */}
          <div
            style={{
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              padding: '0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['Overview', 'Activities', 'Intelligence'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.85rem 1.25rem',
                      border: 'none',
                      background: 'none',
                      borderBottom: isActive ? '3px solid #00a4bd' : '3px solid transparent',
                      color: isActive ? '#00a4bd' : '#64748b',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => toast.info('Customizing tab layout & widgets...')}
              style={{
                background: 'none',
                border: 'none',
                color: '#00a4bd',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              ⚙ Customize
            </button>
          </div>

          {/* TAB 1: OVERVIEW (Exact Screenshot 4 Layout) */}
          {activeTab === 'Overview' && (
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Card 1: Data Highlights */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Data highlights</h3>
                  <div style={{ display: 'flex', gap: 8, color: '#94a3b8' }}>
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <Settings size={14} />
                    </button>
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <Minimize2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 700, fontSize: 10, letterSpacing: '0.5px' }}>CREATE DATE</span>
                    <div style={{ color: '#0f172a', marginTop: 4 }}>{contact.createDate || '2026-08-29 5:22 AM EDT'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 700, fontSize: 10, letterSpacing: '0.5px' }}>LIFECYCLE STAGE</span>
                    <div style={{ color: '#64748b', marginTop: 4 }}>{contact.lifecycleStage || '--'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 700, fontSize: 10, letterSpacing: '0.5px' }}>LAST ACTIVITY DATE</span>
                    <div style={{ color: '#0f172a', marginTop: 4 }}>{contact.lastActivityDate || '2026-08-29 5:21 AM EDT'}</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Recent Activities Timeline (Screenshot 4) */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Recent activities</h3>
                  <button type="button" style={{ background: 'none', border: 'none', color: '#00a4bd', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Collapse all v
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={14} style={{ position: 'absolute', left: 8, top: 8, color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search activities"
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '5px 8px 5px 28px',
                        fontSize: 12,
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        background: '#fff',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 4,
                      padding: '4px 10px',
                      fontSize: 12,
                      color: '#00a4bd',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Add activities <ChevronDown size={12} />
                  </button>

                  {/* Filter Chips matching Screenshot 4 */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 11, fontWeight: 600, borderRadius: 12, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Activity (5/9) <span style={{ cursor: 'pointer' }}>×</span>
                    </span>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 11, fontWeight: 600, borderRadius: 12, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      All time so far <span style={{ cursor: 'pointer' }}>×</span>
                    </span>
                  </div>
                </div>

                {/* Timeline Stream */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>August 2026</div>

                  {/* Timeline Event 1: Contact Created (Screenshot 4) */}
                  <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <User size={14} style={{ color: '#00a4bd' }} />
                      </div>
                      <div style={{ width: 2, flex: 1, background: '#e2e8f0', marginTop: 4 }} />
                    </div>

                    <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>Created</span>
                        <span style={{ color: '#64748b', fontSize: 11 }}>Aug 29, 2026 at 5:22 AM EDT</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#334155' }}>
                        This contact was created from Organic Search from{' '}
                        <a href="#search" onClick={(e) => e.preventDefault()} style={{ color: '#00a4bd', textDecoration: 'none', fontWeight: 600 }}>
                          Unknown keywords (SSL) (GOOGLE) <ExternalLink size={11} style={{ display: 'inline' }} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Additional Dynamic Logged Activities */}
                  {(contact.activities || []).map((act) => (
                    <div key={act.id} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Edit3 size={14} style={{ color: '#00a4bd' }} />
                        </div>
                      </div>
                      <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '12px' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{act.title}</span>
                          <span style={{ color: '#64748b', fontSize: 11 }}>{act.createdAt}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569' }}>{act.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Contacts Associations */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Contacts</h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" className="oneness-btn-secondary" style={{ fontSize: 11, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Plus size={12} /> Add
                    </button>
                    <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  No associated objects of this type exist or you don't have permission to view them.
                </div>
              </div>

              {/* Card 4: Companies Associations */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Companies</h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" className="oneness-btn-secondary" style={{ fontSize: 11, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Plus size={12} /> Add
                    </button>
                    <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  No associated objects of this type exist or you don't have permission to view them.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITIES TAB */}
          {activeTab === 'Activities' && (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: 14, color: '#0f172a', marginBottom: '0.5rem' }}>Logged Sales Notes & Timeline</h4>
                <div style={{ fontSize: 13, color: '#475569' }}>
                  {contact.notes || 'No recent notes logged. Click "Note" in the left sidebar to add a note.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTELLIGENCE (Exact Screenshot 3 Layout) */}
          {activeTab === 'Intelligence' && (
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Card 1: Enrichment Data Notice */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  HubSpot does not have enrichment data for this record, yet.
                </span>
                <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <Minimize2 size={14} />
                </button>
              </div>

              {/* Card 2: Contact Demographic & Region Grid (Screenshot 3) */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', fontSize: '12px', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Lifecycle stage</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Related company</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Employment role</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>City</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>State</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Region</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 4, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Facebook size={14} />
                  </button>
                  <button type="button" style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 4, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Linkedin size={14} />
                  </button>
                  <button type="button" style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 4, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <Twitter size={14} />
                  </button>
                </div>
              </div>

              {/* Card 3: Company Attributes Grid (Screenshot 3) */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr)', gap: '1rem', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Company description</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Industry</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Country</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Employees</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: 11 }}>Founded year</span>
                    <div style={{ color: '#94a3b8', marginTop: 4 }}>--</div>
                  </div>
                </div>
              </div>

              {/* Card 4: Upgrade Banner (Screenshot 3) */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 8,
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a4bd' }}>
                  <Building size={22} />
                </div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                  Upgrade to access Data Agent and Enrichment
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', maxWidth: 440 }}>
                  Access available data for over 200 million contact and company profiles.
                </p>
                <button
                  type="button"
                  className="oneness-btn-teal"
                  onClick={() => toast.info('Opening Breeze Data Agent upgrade window...')}
                  style={{ marginTop: '0.5rem', fontSize: '13px', padding: '0.5rem 1.25rem' }}
                >
                  Upgrade Data Agent
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
