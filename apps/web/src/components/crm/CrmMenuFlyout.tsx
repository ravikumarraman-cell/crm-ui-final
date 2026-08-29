import { ArrowUpRight } from 'lucide-react';

interface CrmMenuFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onSelectItem: (item: string) => void;
}

export function CrmMenuFlyout({ isOpen, onClose, activeItem = 'Contacts', onSelectItem }: CrmMenuFlyoutProps) {
  if (!isOpen) return null;

  const topGroup = [
    { id: 'Contacts', label: 'Contacts' },
    { id: 'Companies', label: 'Companies' },
    { id: 'Deals', label: 'Deals' },
    { id: 'Tickets', label: 'Tickets' },
    { id: 'Products', label: 'Products' },
    { id: 'Orders', label: 'Orders' },
  ];

  const bottomGroup = [
    { id: 'Segments (Lists)', label: 'Segments (Lists)' },
    { id: 'Inbox', label: 'Inbox' },
    { id: 'Calls', label: 'Calls' },
    { id: 'Meetings', label: 'Meetings' },
    { id: 'Tasks', label: 'Tasks' },
    { id: 'Playbooks', label: 'Playbooks', badge: true },
    { id: 'Message Templates', label: 'Message Templates' },
    { id: 'Snippets', label: 'Snippets' },
  ];

  return (
    <>
      {/* Click outside backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          background: 'transparent',
        }}
      />

      {/* Screenshot 1 Exact CRM Flyout Menu Panel */}
      <div
        style={{
          position: 'fixed',
          top: '40px',
          left: '60px',
          width: '240px',
          backgroundColor: '#384d62', // Exact HubSpot/Oneness blue-gray slate color
          color: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          zIndex: 100,
          padding: '0.75rem 0',
          animation: 'fadeIn 0.15s ease-out',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            padding: '0.4rem 1.25rem 0.6rem',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: '#ffffff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '0.4rem',
          }}
        >
          CRM
        </div>

        {/* Top Items Group */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topGroup.map((item) => {
            const isSelected = activeItem.toLowerCase() === item.id.toLowerCase();
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectItem(item.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 1.25rem',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 400,
                  color: '#ffffff',
                  background: isSelected ? '#4b637c' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider matching Screenshot 1 */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            margin: '0.5rem 1.25rem',
          }}
        />

        {/* Bottom Items Group */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {bottomGroup.map((item) => {
            const isSelected = activeItem.toLowerCase() === item.id.toLowerCase();
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectItem(item.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 1.25rem',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 400,
                  color: '#ffffff',
                  background: isSelected ? '#4b637c' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#ff5c35',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                    }}
                  >
                    <ArrowUpRight size={10} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
