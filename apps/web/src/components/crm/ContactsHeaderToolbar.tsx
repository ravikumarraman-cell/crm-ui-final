import { ChevronDown, Plus, Info, LayoutGrid } from 'lucide-react';

interface ContactsHeaderToolbarProps {
  onAddContactClick: () => void;
  selectedTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function ContactsHeaderToolbar({
  onAddContactClick,
  selectedTab = 'All contacts',
  onSelectTab,
}: ContactsHeaderToolbarProps) {
  return (
    <div style={{ padding: '1rem 1.5rem 0.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            Contacts
          </h1>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#00a4bd', cursor: 'pointer', padding: 2 }}
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Right Side Utility Controls & Add Contact Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            className="oneness-btn-secondary"
            style={{ padding: '0.4rem 0.6rem', color: '#64748b' }}
            title="Feedback & Info"
          >
            <Info size={16} />
          </button>
          <button
            type="button"
            className="oneness-btn-secondary"
            style={{ padding: '0.4rem 0.6rem', color: '#00a4bd', borderColor: '#ff7a59' }}
            title="View Mode"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            className="oneness-btn-primary"
            onClick={onAddContactClick}
          >
            Add contacts <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* View Tabs Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('All contacts')}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderBottom: '2px solid #00a4bd',
            borderRadius: '6px 6px 0 0',
            padding: '0.4rem 0.9rem',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0f172a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
          }}
        >
          <span>🏢</span> All contacts
        </button>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: '#00a4bd',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0.3rem 0.5rem',
          }}
          title="Create custom view tab"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
