import { useState } from 'react';
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
  DollarSign,
  Building2,
  Menu,
} from 'lucide-react';
import { CrmMenuFlyout } from './CrmMenuFlyout';

interface SidebarRailProps {
  activeModule?: string;
  onSelectModule?: (module: string) => void;
}

export function SidebarRail({ activeModule = 'contacts', onSelectModule }: SidebarRailProps) {
  const [isCrmFlyoutOpen, setIsCrmFlyoutOpen] = useState(false);

  const items = [
    { id: 'home', icon: Home, label: 'Home Dashboard' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'deals', icon: DollarSign, label: 'Deals Pipeline' },
    { id: 'companies', icon: Building2, label: 'Companies Directory' },
    { id: 'analytics', icon: BarChart3, label: 'Reports & Analytics' },
    
    // Non-essential items hidden on mobile screen sizes
    { id: 'premium', icon: Compass, label: 'Feature Portal', hideOnMobile: true },
    { id: 'bookmarks', icon: Bookmark, label: 'Saved Views', hideOnMobile: true },
    { id: 'marketing', icon: Megaphone, label: 'Marketing', hideOnMobile: true },
    { id: 'funnel', icon: Filter, label: 'Sales Funnels', hideOnMobile: true },
    { id: 'commerce', icon: CreditCard, label: 'Commerce & Billing', hideOnMobile: true },
    { id: 'notifications', icon: Bell, label: 'Activity Center', hideOnMobile: true },
    { id: 'database', icon: Database, label: 'Data Hub', hideOnMobile: true },
    { id: 'integrations', icon: GitFork, label: 'App Integrations', hideOnMobile: true },
    { id: 'workflows', icon: Workflow, label: 'Automation Workflows', hideOnMobile: true },
    { id: 'reports', icon: PieChart, label: 'Custom Dashboards', hideOnMobile: true },
  ];

  return (
    <>
      <aside className="oneness-sidebar" aria-label="CRM Navigation Rail">
        {/* Top Brand Sprocket Logo (Hidden on mobile) */}
        <div
          onClick={() => setIsCrmFlyoutOpen(!isCrmFlyoutOpen)}
          className="hide-on-mobile"
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
          title="CRM Menu (Click to toggle)"
        >
          ❖
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule.toLowerCase() === item.id.toLowerCase();
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (onSelectModule) {
                  onSelectModule(item.id);
                }
              }}
              title={`${item.label}`}
              className={`oneness-sidebar__item ${isActive ? 'oneness-sidebar__item--active' : ''} ${item.hideOnMobile ? 'hide-on-mobile' : ''}`}
              aria-label={item.label}
            >
              <Icon size={18} />
            </button>
          );
        })}

        {/* Mobile menu trigger button shown only on bottom bar */}
        <button
          type="button"
          className="oneness-sidebar__item show-only-on-mobile"
          onClick={() => setIsCrmFlyoutOpen(!isCrmFlyoutOpen)}
          title="More modules"
          style={{ display: 'none' }}
        >
          <Menu size={18} />
        </button>

        <div className="hide-on-mobile" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            className="oneness-sidebar__item"
            title="Upgrade Plan"
            style={{ color: '#00a4bd' }}
          >
            <ArrowUpCircle size={20} />
          </button>
          <button
            type="button"
            className="oneness-sidebar__item"
            title="Toggle CRM Flyout Menu"
            onClick={() => setIsCrmFlyoutOpen(!isCrmFlyoutOpen)}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </aside>

      {/* Screenshot 1 CRM Navigation Flyout Menu */}
      <CrmMenuFlyout
        isOpen={isCrmFlyoutOpen}
        onClose={() => setIsCrmFlyoutOpen(false)}
        activeItem={activeModule}
        onSelectItem={(moduleName) => {
          if (onSelectModule) {
            onSelectModule(moduleName);
          }
        }}
      />
    </>
  );
}
