import { useState, useMemo } from 'react';
import { Home, ArrowRight, UserPlus, FileText } from 'lucide-react';
import { Contact } from '../../../core/crm/types';

interface HomeDashboardViewProps {
  contacts: Contact[];
  onSelectModule?: (module: string) => void;
}

export function HomeDashboardView({ contacts, onSelectModule }: HomeDashboardViewProps) {
  const [tasks, setTasks] = useState([
    { id: 'task-1', text: 'Follow up with Ravi Kumar regarding Proposal Sent', checked: false },
    { id: 'task-2', text: 'Prepare slides for Nithyananda University demo', checked: true },
    { id: 'task-3', text: 'Clean up inactive email bounces from system logs', checked: false },
    { id: 'task-4', text: 'Audit database backup and verification flags', checked: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: `task-${Date.now()}`, text: newTask, checked: false }
    ]);
    setNewTask('');
  };

  const recentContacts = useMemo(() => {
    return contacts.slice(0, 4);
  }, [contacts]);

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc', height: '100%', overflowY: 'auto' }} id="home-dashboard-view">
      {/* Dynamic Greetings Card with nice Gradient */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '2rem 1.75rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '10rem', opacity: 0.05, userSelect: 'none', pointerEvents: 'none' }}>
          ❖
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#00a4bd', letterSpacing: '1px' }}>WELCOME TO ONENESS CRM</span>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Good morning, Executive Director</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', maxWidth: '540px', lineHeight: 1.5 }}>
            Here is your daily commercial summary. The contact verification process verified 100% of records.
            You have {tasks.filter(t => !t.checked).length} pending tasks to tackle today.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="oneness-btn-teal"
              onClick={() => onSelectModule && onSelectModule('Contacts')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '12px', padding: '6px 14px' }}
            >
              Manage Contacts <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="oneness-btn-secondary"
              onClick={() => onSelectModule && onSelectModule('analytics')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '12px', padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Analyze Reports
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Actions & Recent Elements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Interactive Checklist Tasks Widget */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>My Commercial Tasks Checklist</h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Check off tasks to maintain ideal pipeline speed</span>
          </div>

          <form onSubmit={addTask} style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              placeholder="e.g. Schedule meeting with sales lead"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}
            />
            <button type="submit" className="oneness-btn-teal" style={{ padding: '4px 10px', fontSize: 12 }}>
              Add
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto' }}>
            {tasks.map((task) => (
              <label
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '12.5px',
                  color: task.checked ? '#94a3b8' : '#334155',
                  textDecoration: task.checked ? 'line-through' : 'none',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => toggleTask(task.id)}
                  style={{ width: '14px', height: '14px', accentColor: '#00a4bd' }}
                />
                <span style={{ flex: 1 }}>{task.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Contacts Directory & Interactions Widget */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Recent Direct Contacts</h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Quickly view or contact fresh lead acquisitions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentContacts.length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                No active contacts in directory
              </div>
            ) : (
              recentContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectModule && onSelectModule('Contacts')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.avatarBg || '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569', fontSize: 11 }}>
                    {c.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</div>
                  </div>
                  <div style={{ fontSize: '10px', background: '#e0f2fe', color: '#0369a1', fontWeight: 700, padding: '2px 6px', borderRadius: '10px' }}>
                    {c.lifecycleStage || 'Lead'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Quick Action Shortcuts Panel */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Quick Management Portals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {[
            { id: 'Contacts', label: 'Create Contact', icon: UserPlus, act: () => onSelectModule && onSelectModule('Contacts') },
            { id: 'Deals', label: 'Manage Pipeline', icon: FileText, act: () => onSelectModule && onSelectModule('Deals') },
            { id: 'analytics', label: 'Executive Analytics', icon: Home, act: () => onSelectModule && onSelectModule('analytics') },
          ].map((btn, idx) => {
            const Icon = btn.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={btn.act}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.65rem 1rem',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#00a4bd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                <Icon size={16} style={{ color: '#00a4bd' }} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default HomeDashboardView;
