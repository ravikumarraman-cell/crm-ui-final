import {
  Compass,
  Home,
  Bookmark,
  Users,
  Megaphone,
  BarChart3,
  Filter,
  CreditCard,
  Bell,
  Database,
  GitFork,
  Workflow,
  PieChart,
  ChevronLeft,
  ArrowUpCircle,
} from 'lucide-react';

interface SidebarRailProps {
  activeModule?: string;
  onSelectModule?: (module: string) => void;
}

export function SidebarRail({ activeModule = 'contacts', onSelectModule }: SidebarRailProps) {
  const items = [
    { id: 'premium', icon: Compass, label: 'Feature Portal' },
    { id: 'home', icon: Home, label: 'Home Dashboard' },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved Views' },
    { id: 'contacts', icon: Users, label: 'Contacts', highlight: true },
    { id: 'marketing', icon: Megaphone, label: 'Marketing' },
    { id: 'analytics', icon: BarChart3, label: 'Reports & Analytics' },
    { id: 'funnel', icon: Filter, label: 'Sales Funnels' },
    { id: 'commerce', icon: CreditCard, label: 'Commerce & Billing' },
    { id: 'notifications', icon: Bell, label: 'Activity Center' },
    { id: 'database', icon: Database, label: 'Data Hub' },
    { id: 'integrations', icon: GitFork, label: 'App Integrations' },
    { id: 'workflows', icon: Workflow, label: 'Automation Workflows' },
    { id: 'reports', icon: PieChart, label: 'Custom Dashboards' },
  ];

  return (
    <aside className="oneness-sidebar" aria-label="CRM Navigation Rail">
      {/* Top Brand Sprocket Logo */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #ff5c35, #00a4bd)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: 16,
          marginBottom: '0.5rem',
          cursor: 'pointer',
        }}
        title="Causing Portal CRM"
      >
        ❖
      </div>

      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectModule && onSelectModule(item.id)}
            title={item.label}
            className={`oneness-sidebar__item ${isActive ? 'oneness-sidebar__item--active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={18} />
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          className="oneness-sidebar__item"
          title="Upgrade Plan"
          style={{ color: '#00a4bd' }}
        >
          <ArrowUpCircle size={20} />
        </button>
        <button type="button" className="oneness-sidebar__item" title="Collapse Rail">
          <ChevronLeft size={16} />
        </button>
      </div>
    </aside>
  );
}
