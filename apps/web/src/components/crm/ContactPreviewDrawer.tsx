import { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronDown,
  Edit3,
  Mail,
  Phone,
  CheckSquare,
  Calendar,
  MoreHorizontal,
  ExternalLink,
  Copy,
  AlertCircle,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Contact, LifecycleStage } from '../../core/crm/types';

interface ContactPreviewDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullRecord: (contact: Contact) => void;
  onUpdateContact?: (updates: Partial<Contact>) => void;
  onSummarizeContact?: (contact: Contact) => void;
}

export function ContactPreviewDrawer({
  contact,
  isOpen,
  onClose,
  onOpenFullRecord,
  onUpdateContact,
  onSummarizeContact,
}: ContactPreviewDrawerProps) {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  if (!isOpen || !contact) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (!noteText.trim() || !onUpdateContact) return;
    const newAct = {
      id: `act-${Date.now()}`,
      type: 'note' as const,
      title: 'Quick Note Added',
      content: noteText,
      createdAt: new Date().toLocaleString(),
      author: 'Current User',
    };
    onUpdateContact({
      activities: [newAct, ...(contact.activities || [])],
      notes: noteText,
    });
    setNoteText('');
    setIsAddingNote(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.25)',
          zIndex: 90,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Screenshot 2 Slide-over Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          maxWidth: '90vw',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.15)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-label="Contact Preview Panel"
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Preview</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
            }}
            title="Close Preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Record & Actions Sub-Header */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa',
          }}
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFullRecord(contact);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#00a4bd',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            <ChevronLeft size={16} /> View record
          </button>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '0.25rem 0.65rem',
                color: '#00a4bd',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Actions <ChevronDown size={13} />
            </button>

            {showActionsDropdown && (
              <div
                className="oneness-dropdown"
                style={{
                  position: 'absolute',
                  top: '105%',
                  right: 0,
                  width: 200,
                  zIndex: 110,
                }}
              >
                <div
                  className="oneness-dropdown-item"
                  onClick={() => {
                    setShowActionsDropdown(false);
                    onClose();
                    onOpenFullRecord(contact);
                  }}
                >
                  View full record
                </div>
                {onSummarizeContact && (
                  <div
                    className="oneness-dropdown-item"
                    style={{ color: '#00a4bd', fontWeight: 600 }}
                    onClick={() => {
                      setShowActionsDropdown(false);
                      onSummarizeContact(contact);
                    }}
                  >
                    <Sparkles size={13} style={{ marginRight: 6 }} /> Summarize with AI
                  </div>
                )}
                <div className="oneness-dropdown-item" onClick={handleCopyEmail}>
                  Copy email address
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Body Content */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Bounced Alert Card matching Screenshot 2 */}
          {(contact.bounced || contact.statusBanner) && (
            <div
              style={{
                background: '#f0fdfa',
                border: '1px solid #99f6e4',
                borderRadius: '6px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '13px',
                color: '#0f766e',
              }}
            >
              <AlertCircle size={16} style={{ color: '#00a4bd', flexShrink: 0 }} />
              <span>{contact.statusBanner || 'Contact has bounced.'}</span>
            </div>
          )}

          {/* Contact Card Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h3
                  onClick={() => {
                    onClose();
                    onOpenFullRecord(contact);
                  }}
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#00a4bd',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationColor: 'transparent',
                    transition: 'text-decoration-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecorationColor = '#00a4bd')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecorationColor = 'transparent')}
                >
                  {contact.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{contact.email}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                    title={isCopied ? 'Copied!' : 'Copy email'}
                  >
                    <Copy size={12} />
                  </button>
                  <a
                    href={`mailto:${contact.email}`}
                    style={{ color: '#94a3b8' }}
                    title="Open mail app"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Round Action Buttons Row matching Screenshot 2 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.4rem',
                marginTop: '0.5rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              {[
                { id: 'note', label: 'Note', icon: Edit3, action: () => setIsAddingNote(!isAddingNote) },
                { id: 'email', label: 'Email', icon: Mail, action: () => window.open(`mailto:${contact.email}`) },
                { id: 'call', label: 'Call', icon: Phone, action: () => alert(`Calling ${contact.name}...`) },
                { id: 'task', label: 'Task', icon: CheckSquare, action: () => alert('Created task for contact.') },
                { id: 'meeting', label: 'Meeting', icon: Calendar, action: () => alert('Scheduled meeting.') },
                { id: 'more', label: 'More', icon: MoreHorizontal, action: () => setShowActionsDropdown(true) },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={act.action}
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
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#00a4bd';
                        e.currentTarget.style.background = '#e0f2fe';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.background = '#f8fafc';
                      }}
                    >
                      <Icon size={16} style={{ color: '#00a4bd' }} />
                    </div>
                    {act.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Note Input */}
            {isAddingNote && (
              <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.65rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <textarea
                  placeholder="Add note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{ width: '100%', height: 50, border: '1px solid #cbd5e1', borderRadius: 4, padding: 6, fontSize: 12 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                  <button type="button" className="oneness-btn-secondary" onClick={() => setIsAddingNote(false)} style={{ fontSize: 11, padding: '2px 6px' }}>Cancel</button>
                  <button type="button" className="oneness-btn-teal" onClick={handleSaveNote} style={{ fontSize: 11, padding: '2px 8px' }}>Save</button>
                </div>
              </div>
            )}
          </div>

          {/* Section: About this contact Accordion (Screenshot 2) */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChevronDown size={14} style={{ color: '#00a4bd' }} /> About this contact
              </h4>
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
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Contact owner</label>
                <div style={{ color: '#0f172a' }}>{contact.owner || 'No owner'}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Last Contacted</label>
                <div style={{ color: '#0f172a' }}>{contact.lastActivityDate || '2026-08-29 5:58 AM EDT'}</div>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Lifecycle Stage</label>
                <select
                  value={contact.lifecycleStage || ''}
                  onChange={(e) => onUpdateContact && onUpdateContact({ lifecycleStage: e.target.value as LifecycleStage })}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    padding: '4px 6px',
                    fontSize: 12,
                    marginTop: 2,
                    background: '#ffffff',
                    color: contact.lifecycleStage ? '#0f172a' : '#94a3b8',
                  }}
                >
                  <option value="">Select a stage</option>
                  {['Subscriber', 'Lead', 'Marketing Qualified Lead', 'Sales Qualified Lead', 'Opportunity', 'Customer', 'Evangelist'].map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: '#64748b', display: 'block', fontSize: 11, fontWeight: 600 }}>Lead Status</label>
                <div style={{ color: '#64748b' }}>{contact.leadStatus || '--'}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
