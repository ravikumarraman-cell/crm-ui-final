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
} from 'lucide-react';
import { Contact, LifecycleStage, LeadStatus } from '../../core/crm/types';

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
  const [activeTab, setActiveTab] = useState<'Overview' | 'Activities' | 'Notes' | 'Associations'>('Overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newAct = {
      id: `act-${Date.now()}`,
      type: 'note' as const,
      title: 'Sales Note Added',
      content: newNoteText,
      createdAt: new Date().toLocaleString(),
      author: 'Current User',
    };
    const updatedActivities = [newAct, ...(contact.activities || [])];
    onUpdateContact({ activities: updatedActivities, notes: newNoteText });
    setNewNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
      {/* Top Header & Actions Bar matching Screenshot 2 */}
      <div
        style={{
          padding: '0.85rem 1.5rem',
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

        {/* Actions Dropdown Trigger matching Screenshot 2 */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowActionsDropdown(!showActionsDropdown)}
            style={{
              background: '#ffffff',
              border: '2px solid #00a4bd',
              borderRadius: '4px',
              padding: '0.45rem 1rem',
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

          {/* Screenshot 2 Exact Actions Dropdown Menu */}
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
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>Review associations</span>
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
                  <Sparkles size={14} /> Summarize
                </span>
              </div>

              <div className="oneness-dropdown-divider" />
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Search in Google <ExternalLink size={12} />
                </span>
              </div>
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>Opt out of email</span>
              </div>
              <div className="oneness-dropdown-divider" />
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Restore activity <ExternalLink size={12} />
                </span>
              </div>
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>Merge</span>
              </div>
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>Clone</span>
              </div>
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
              <div className="oneness-dropdown-divider" />
              <div className="oneness-dropdown-item" onClick={() => setShowActionsDropdown(false)}>
                <span>Export contact data</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Detail Body Grid */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Column: Contact Summary & About accordion (Screenshot 2) */}
        <div
          style={{
            width: 340,
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
          {/* Status Alert Banner matching Screenshot 2 ("Contact has bounced.") */}
          {contact.bounced && (
            <div className="oneness-bounced-banner">
              <AlertCircle size={16} style={{ color: '#00a4bd' }} />
              <span>{contact.statusBanner || 'Contact has bounced.'}</span>
            </div>
          )}

          {/* Contact Avatar & Header Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: contact.avatarBg || '#00a4bd',
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                {contact.name}
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: 2 }}>{contact.email}</div>
            </div>
          </div>

          {/* Quick Actions Buttons Row matching Screenshot 2 */}
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setIsAddingNote(!isAddingNote)}
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
              <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <Edit3 size={15} style={{ color: '#00a4bd' }} />
              </div>
              Note
            </button>
            <button
              type="button"
              onClick={() => window.open(`mailto:${contact.email}`)}
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
              <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <Mail size={15} style={{ color: '#00a4bd' }} />
              </div>
              Email
            </button>
            <button
              type="button"
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
              <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <Phone size={15} style={{ color: '#00a4bd' }} />
              </div>
              Call
            </button>
            <button
              type="button"
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
              <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <CheckSquare size={15} style={{ color: '#00a4bd' }} />
              </div>
              Task
            </button>
            <button
              type="button"
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
              <div style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <Calendar size={15} style={{ color: '#00a4bd' }} />
              </div>
              Meeting
            </button>
          </div>

          {/* Inline Add Note Composer */}
          {isAddingNote && (
            <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <textarea
                placeholder="Type note content..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                style={{ width: '100%', height: 60, border: '1px solid #cbd5e1', borderRadius: 4, padding: 6, fontSize: 12 }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="oneness-btn-secondary" onClick={() => setIsAddingNote(false)} style={{ fontSize: 11 }}>Cancel</button>
                <button type="button" className="oneness-btn-teal" onClick={handleAddNote} style={{ fontSize: 11 }}>Save Note</button>
              </div>
            </div>
          )}

          {/* Section: About this contact (Screenshot 2 Accordion) */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChevronDown size={14} style={{ color: '#00a4bd' }} /> About this contact
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '12px' }}>
              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Email</label>
                <div style={{ color: '#0f172a', fontWeight: 500 }}>{contact.email}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Phone Number</label>
                <div style={{ color: '#0f172a' }}>{contact.phoneNumber || '--'}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Lifecycle Stage</label>
                <select
                  value={contact.lifecycleStage || 'Lead'}
                  onChange={(e) => onUpdateContact({ lifecycleStage: e.target.value as LifecycleStage })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 4, padding: '3px 6px', fontSize: 12, marginTop: 2, background: '#fff' }}
                >
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
                  value={contact.leadStatus || 'New'}
                  onChange={(e) => onUpdateContact({ leadStatus: e.target.value as LeadStatus })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 4, padding: '3px 6px', fontSize: 12, marginTop: 2, background: '#fff' }}
                >
                  {['New', 'Open', 'In Progress', 'Open Deal', 'Connected', 'Attempted to Contact'].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Gender</label>
                <div style={{ color: '#0f172a' }}>{contact.gender || '--'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Overview, Activity Feed & Tabs Pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Tab Navigation Row */}
          <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 1.5rem', display: 'flex', gap: '1rem' }}>
            {(['Overview', 'Activities', 'Notes', 'Associations'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 0.5rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === tab ? '2px solid #00a4bd' : '2px solid transparent',
                  color: activeTab === tab ? '#00a4bd' : '#64748b',
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Activity Timeline Stream Content */}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>Activity History Highlights</h4>
                <span style={{ fontSize: 11, color: '#64748b' }}>Updated 2026-08-29</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                {contact.notes || 'No recent notes recorded. Use the Quick Action Note button above to log sales activity.'}
              </p>
            </div>

            {/* List of activity items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(contact.activities || []).map((act) => (
                <div key={act.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{act.title}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{act.createdAt}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#334155' }}>{act.content}</div>
                  <div style={{ fontSize: 11, color: '#00a4bd', marginTop: 4 }}>Logged by {act.author}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
