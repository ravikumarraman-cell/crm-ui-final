import { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Edit2,
  SlidersHorizontal,
  Flag,
  Calendar,
  Settings,
  ChevronUp,
  X,
} from 'lucide-react';
import { ContactsFilterState } from '../../core/crm/types';

interface ContactsFilterBarProps {
  filters: ContactsFilterState;
  onFilterChange: (filters: ContactsFilterState) => void;
  onResetFilters: () => void;
}

export function ContactsFilterBar({ filters, onFilterChange, onResetFilters }: ContactsFilterBarProps) {
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleSearchChange = (val: string) => {
    onFilterChange({ ...filters, search: val });
  };

  const handleOwnerSelect = (owner: string) => {
    onFilterChange({ ...filters, contactOwner: owner });
    setShowOwnerDropdown(false);
  };

  const handleStatusSelect = (status: string) => {
    onFilterChange({ ...filters, leadStatus: status });
    setShowStatusDropdown(false);
  };

  return (
    <div
      id="contacts-filter-bar"
      style={{
        padding: '0.65rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {/* Left Filter & Search Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Search Input Box */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            padding: '0.3rem 0.75rem',
            width: 220,
          }}
        >
          <Search size={14} style={{ color: '#64748b', marginRight: 6 }} />
          <input
            type="text"
            placeholder="Search ( / )"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '12px',
              color: '#0f172a',
            }}
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter & Sort Pill Buttons */}
        <button type="button" className="oneness-btn-secondary" style={{ borderRadius: '9999px', fontSize: '12px' }}>
          <Filter size={13} style={{ color: '#00a4bd' }} /> Filter
        </button>

        <button type="button" className="oneness-btn-secondary" style={{ borderRadius: '9999px', fontSize: '12px' }}>
          <ArrowUpDown size={13} style={{ color: '#64748b' }} /> Sort by
        </button>

        {/* Quick Filter Dropdowns */}
        {/* Contact Owner */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
            className="oneness-filter-pill"
          >
            Contact owner: <strong>{filters.contactOwner || 'All'}</strong> ▾
          </button>

          {showOwnerDropdown && (
            <div className="oneness-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4 }}>
              {['All', 'No owner', 'Rahul Sharma', 'Admissions Agent', 'Sales Lead'].map((owner) => (
                <div
                  key={owner}
                  className="oneness-dropdown-item"
                  onClick={() => handleOwnerSelect(owner)}
                >
                  {owner}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Date */}
        <button type="button" className="oneness-filter-pill">
          Create date ▾
        </button>

        {/* Last Activity Date */}
        <button type="button" className="oneness-filter-pill">
          Last activity date ▾
        </button>

        {/* Lead Status */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="oneness-filter-pill"
          >
            Lead status: <strong>{filters.leadStatus || 'All'}</strong> ▾
          </button>

          {showStatusDropdown && (
            <div className="oneness-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4 }}>
              {['All', 'New', 'Open', 'In Progress', 'Open Deal', 'Connected', 'Attempted to Contact'].map((status) => (
                <div
                  key={status}
                  className="oneness-dropdown-item"
                  onClick={() => handleStatusSelect(status)}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Filter & Edit Filter */}
        <button
          type="button"
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#00a4bd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Add quick filter"
        >
          <Plus size={14} />
        </button>

        <button
          type="button"
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Edit view filters"
        >
          <Edit2 size={13} />
        </button>

        {/* Advanced Filters with Active Teal Dot */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, advancedFilters: !filters.advancedFilters })}
          style={{
            background: 'none',
            border: 'none',
            color: '#00a4bd',
            fontSize: '12px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={13} /> Advanced filters
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#00a4bd',
              display: 'inline-block',
            }}
          />
        </button>
      </div>

      {/* Right View Switcher Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          title="Flag View"
        >
          <Flag size={15} />
        </button>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          title="Calendar View"
        >
          <Calendar size={15} />
        </button>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          title="Column Settings"
        >
          <Settings size={15} />
        </button>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          title="Collapse Header"
        >
          <ChevronUp size={15} />
        </button>
      </div>
    </div>
  );
}
