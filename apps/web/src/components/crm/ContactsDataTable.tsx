import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from '@tanstack/react-table';
import { ChevronRight, ChevronDown, Mail, Trash2, Sparkles, Eye } from 'lucide-react';
import { Contact } from '../../core/crm/types';

interface ContactsDataTableProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onPreviewContact: (contact: Contact) => void;
  onDeleteContact?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onSummarizeContact?: (contact: Contact) => void;
  isLoading?: boolean;
}

export function ContactsDataTable({
  contacts,
  onSelectContact,
  onPreviewContact,
  onDeleteContact,
  onBulkDelete,
  onSummarizeContact,
  isLoading,
}: ContactsDataTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            style={{ cursor: 'pointer', width: 15, height: 15, accentColor: '#00a4bd' }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: 'pointer', width: 15, height: 15, accentColor: '#00a4bd' }}
          />
        ),
        size: 36,
      },
      {
        id: 'expand',
        header: '',
        cell: ({ row }) => {
          const isExpanded = expandedRows[row.original.id];
          return (
            <button
              type="button"
              onClick={(e) => toggleExpand(row.original.id, e)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          );
        },
        size: 30,
      },
      {
        accessorKey: 'name',
        header: 'NAME',
        cell: ({ row }) => {
          const contact = row.original;
          const initial = contact.name.charAt(0).toUpperCase();
          const isHovered = hoveredRowId === contact.id;

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative', width: '100%', paddingRight: '68px' }}>
              <div
                className="oneness-avatar"
                style={{ backgroundColor: contact.avatarBg || '#00a4bd', color: '#ffffff' }}
              >
                {initial}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectContact(contact);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#00a4bd',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                      }}
                    >
                      {contact.name}
                    </button>
                  </div>
                  {contact.company && (
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{contact.company}</div>
                  )}
                </div>
              </div>

              {/* Absolute-positioned Preview button prevents layout shifting and row wrapping on hover */}
              {isHovered && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewContact(contact);
                  }}
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#1e293b',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    zIndex: 10,
                  }}
                  title="Quick Preview"
                >
                  <Eye size={10} /> Preview
                </button>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'EMAIL',
        cell: ({ row }) => {
          const contact = row.original;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={13} style={{ color: '#94a3b8' }} />
              <a
                href={`mailto:${contact.email}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: '#0f172a', textDecoration: 'none', fontSize: '13px' }}
              >
                {contact.email}
              </a>
              {contact.bounced && (
                <span
                  style={{
                    fontSize: '10px',
                    background: '#fef2f2',
                    color: '#ef4444',
                    border: '1px solid #fca5a5',
                    borderRadius: 4,
                    padding: '1px 4px',
                    fontWeight: 600,
                  }}
                >
                  Bounced
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'phoneNumber',
        header: 'PHONE NUMBER',
        cell: ({ row }) => (
          <span style={{ color: '#64748b' }}>{row.original.phoneNumber || '--'}</span>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'CONTACT OWNER',
        cell: ({ row }) => (
          <span style={{ color: '#64748b' }}>{row.original.owner || 'No owner'}</span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'PRIORITY',
        cell: ({ row }) => {
          const p = row.original.priority;
          if (!p) return <span style={{ color: '#94a3b8' }}>--</span>;
          const bg = p === 'high' ? '#fef2f2' : p === 'medium' ? '#fffbebf' : '#f0fdf4';
          const color = p === 'high' ? '#dc2626' : p === 'medium' ? '#d97706' : '#16a34a';
          return (
            <span
              style={{
                background: bg,
                color: color,
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'capitalize',
              }}
            >
              {p}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const contact = row.original;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewContact(contact);
                }}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 4,
                  color: '#00a4bd',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                title="Quick Preview"
              >
                <Eye size={12} /> Preview
              </button>
              {onSummarizeContact && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSummarizeContact(contact);
                  }}
                  style={{ background: 'none', border: 'none', color: '#00a4bd', cursor: 'pointer', padding: 2 }}
                  title="AI Summarize Contact"
                >
                  <Sparkles size={14} />
                </button>
              )}
              {onDeleteContact && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteContact(contact.id);
                  }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                  title="Delete Contact"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        },
        size: 110,
      },
    ],
    [expandedRows, hoveredRowId, onSelectContact, onPreviewContact, onDeleteContact, onSummarizeContact]
  );

  const table = useReactTable({
    data: contacts,
    columns,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;
  const selectedContactIds = Object.keys(rowSelection);

  return (
    <div id="contacts-data-table-wrapper" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Bulk Action Toolbar when rows are selected */}
      {selectedCount > 0 && (
        <div
          style={{
            background: '#e0f2fe',
            border: '1px solid #38bdf8',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#0369a1',
          }}
        >
          <span>
            <strong>{selectedCount}</strong> contact{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="oneness-btn-secondary"
              style={{ fontSize: '12px', padding: '0.2rem 0.6rem' }}
              onClick={() => alert(`Assigned owner to ${selectedCount} contacts.`)}
            >
              Assign owner
            </button>
            <button
              type="button"
              className="oneness-btn-secondary"
              style={{ fontSize: '12px', padding: '0.2rem 0.6rem', color: '#dc2626' }}
              onClick={() => {
                if (onBulkDelete && confirm(`Delete ${selectedCount} contacts?`)) {
                  onBulkDelete(selectedContactIds);
                  setRowSelection({});
                }
              }}
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Main TanStack Table Grid */}
      <div className="oneness-table-container">
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading contacts table data...
          </div>
        ) : contacts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No contacts match the selected search or filter criteria.
          </div>
        ) : (
          <table className="oneness-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                const contact = row.original;
                const isExpanded = expandedRows[contact.id];
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={row.getIsSelected() ? 'selected' : ''}
                      onMouseEnter={() => setHoveredRowId(contact.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                      onClick={() => onPreviewContact(contact)}
                      style={{ cursor: 'pointer' }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>

                    {/* Expandable Quick Row Detail */}
                    {isExpanded && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan={columns.length} style={{ padding: '0.85rem 1.5rem' }}>
                          <div style={{ display: 'flex', gap: '2rem', fontSize: '12px' }}>
                            <div>
                              <strong>Lifecycle Stage:</strong> {contact.lifecycleStage || 'Lead'}
                            </div>
                            <div>
                              <strong>Lead Status:</strong> {contact.leadStatus || 'New'}
                            </div>
                            <div>
                              <strong>Last Activity:</strong> {contact.lastActivityDate || 'N/A'}
                            </div>
                            <div>
                              <strong>Create Date:</strong> {contact.createDate}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
