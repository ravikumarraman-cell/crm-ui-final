import { ChevronDown, Plus, Info, LayoutGrid, List } from 'lucide-react';

interface ContactsHeaderToolbarProps {
  onAddContactClick: () => void;
  selectedTab?: string;
  onSelectTab?: (tab: string) => void;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
}

export function ContactsHeaderToolbar({
  onAddContactClick,
  selectedTab = 'All contacts',
  onSelectTab,
  viewMode = 'list',
  onViewModeChange,
}: ContactsHeaderToolbarProps) {
  return (
    <div
      id="contacts-header-toolbar"
      style={{ padding: '1rem 1.5rem 0.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
    >
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

          {/* Premium View Mode Toggler Button Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px', background: '#f8fafc' }}>
            <button
              type="button"
              onClick={() => onViewModeChange && onViewModeChange('list')}
              style={{
                padding: '0.3rem 0.6rem',
                background: viewMode === 'list' ? '#ffffff' : 'none',
                border: 'none',
                borderRadius: '4px',
                color: viewMode === 'list' ? '#00a4bd' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
              title="List View"
            >
              <List size={14} />
              <span className="hide-on-mobile">List</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange && onViewModeChange('grid')}
              style={{
                padding: '0.3rem 0.6rem',
                background: viewMode === 'grid' ? '#ffffff' : 'none',
                border: 'none',
                borderRadius: '4px',
                color: viewMode === 'grid' ? '#00a4bd' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
              <span className="hide-on-mobile">Cards</span>
            </button>
          </div>

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
