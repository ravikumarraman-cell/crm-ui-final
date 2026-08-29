import {
  Search,
  Plus,
  ArrowUp,
  Phone,
  ShoppingBag,
  HelpCircle,
  Settings,
  Bell,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface TopNavbarProps {
  onSearchChange?: (term: string) => void;
  onOpenQuickAdd?: () => void;
  onOpenBreezeAI?: () => void;
}

export function TopNavbar({ onSearchChange, onOpenQuickAdd, onOpenBreezeAI }: TopNavbarProps) {
  return (
    <header className="oneness-topbar">
      {/* Left Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="oneness-topbar__search">
          <Search size={15} style={{ opacity: 0.7 }} />
          <input
            type="text"
            placeholder="Find or Ask"
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <div
            className="hide-on-mobile"
            style={{
              fontSize: 10,
              background: 'rgba(255,255,255,0.2)',
              padding: '1px 5px',
              borderRadius: 3,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            ⌘K
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenQuickAdd}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Quick Create"
        >
          <Plus size={16} />
        </button>

        <button
          type="button"
          className="hide-on-mobile"
          style={{
            background: '#ff5c35',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 12,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <ArrowUp size={12} /> Upgrade
        </button>
      </div>

      {/* Right Navbar Utility Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          type="button"
          className="hide-on-mobile"
          style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
          title="Calling Center"
        >
          <Phone size={16} />
        </button>

        <button
          type="button"
          className="hide-on-mobile"
          style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
          title="App Marketplace"
        >
          <ShoppingBag size={16} />
        </button>

        <button
          type="button"
          className="hide-on-mobile"
          style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
          title="Help & Support"
        >
          <HelpCircle size={16} />
        </button>

        <button
          type="button"
          className="hide-on-mobile"
          style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
          title="Settings"
        >
          <Settings size={16} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            title="Notifications"
          >
            <Bell size={16} />
          </button>
          <span
            style={{
              position: 'absolute',
              top: -3,
              right: -5,
              background: '#ff5c35',
              color: '#fff',
              fontSize: 10,
              width: 15,
              height: 15,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            2
          </span>
        </div>

        {/* Breeze Assistant AI Button */}
        <button
          type="button"
          onClick={onOpenBreezeAI}
          style={{
            background: 'rgba(0, 164, 189, 0.25)',
            border: '1px solid rgba(0, 164, 189, 0.5)',
            color: '#ffffff',
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            cursor: 'pointer',
          }}
        >
          <Sparkles size={13} style={{ color: '#00a4bd' }} /> 
          <span className="hide-on-mobile">Breeze Assistant</span>
        </button>

        {/* User Profile Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', paddingLeft: '0.25rem' }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#00a4bd',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 2px rgba(255,255,255,0.1)',
            }}
          >
            NU
          </div>
          <span className="hide-on-mobile" style={{ fontSize: 13, fontWeight: 500, color: '#f8fafc' }}>Nithyananda University</span>
          <ChevronDown className="hide-on-mobile" size={14} style={{ color: '#94a3b8' }} />
        </div>
      </div>
    </header>
  );
}
