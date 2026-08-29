import { useState } from 'react';
import { X } from 'lucide-react';
import { Contact, LifecycleStage, LeadStatus, ContactPriority } from '../../core/crm/types';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Contact, 'id' | 'createDate'>) => void;
  initialData?: Partial<Contact>;
}

export function ContactFormModal({ isOpen, onClose, onSubmit, initialData }: ContactFormModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [owner, setOwner] = useState(initialData?.owner || 'No owner');
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage>(initialData?.lifecycleStage || 'Lead');
  const [leadStatus, setLeadStatus] = useState<LeadStatus>(initialData?.leadStatus || 'New');
  const [priority, setPriority] = useState<ContactPriority>(initialData?.priority || 'medium');
  const [gender, setGender] = useState(initialData?.gender || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please fill in Name and Email fields.');
      return;
    }
    onSubmit({
      name,
      email,
      phoneNumber: phoneNumber || '--',
      company,
      owner,
      lifecycleStage,
      leadStatus,
      priority,
      gender,
      bounced: false,
      lastActivityDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 8,
          width: '100%',
          maxWidth: 540,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
            {initialData ? 'Edit Contact' : 'Create Contact'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Company / Org
              </label>
              <input
                type="text"
                placeholder="Nithyananda University"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Lifecycle Stage
              </label>
              <select
                value={lifecycleStage}
                onChange={(e) => setLifecycleStage(e.target.value as LifecycleStage)}
                style={{ width: '100%', padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13, background: '#fff' }}
              >
                {['Subscriber', 'Lead', 'Marketing Qualified Lead', 'Sales Qualified Lead', 'Opportunity', 'Customer', 'Evangelist'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Lead Status
              </label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                style={{ width: '100%', padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 13, background: '#fff' }}
              >
                {['New', 'Open', 'In Progress', 'Open Deal', 'Connected', 'Attempted to Contact'].map((ls) => (
                  <option key={ls} value={ls}>{ls}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Owner
              </label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12, background: '#fff' }}
              >
                {['No owner', 'Rahul Sharma', 'Admissions Agent', 'Sales Manager'].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ContactPriority)}
                style={{ width: '100%', padding: '0.45rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12, background: '#fff' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Gender
              </label>
              <input
                type="text"
                placeholder="e.g. Male"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: 12 }}
              />
            </div>
          </div>

          <div
            style={{
              padding: '1rem 0 0 0',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.6rem',
            }}
          >
            <button type="button" className="oneness-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="oneness-btn-primary">
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
