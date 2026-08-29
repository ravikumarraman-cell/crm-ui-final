import { ChevronLeft, ChevronRight, RefreshCw, Download, Copy } from 'lucide-react';
import { ContactsPaginationState } from '../../core/crm/types';

interface ContactsPaginationProps {
  pagination: ContactsPaginationState;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onClone?: () => void;
}

export function ContactsPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onExport,
  onClone,
}: ContactsPaginationProps) {
  const { pageIndex, pageSize, totalCount } = pagination;
  const totalPages = Math.ceil(totalCount / pageSize) || 11;
  const currentPage = pageIndex + 1;

  // Render pages 1..11 like screenshot 1
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div
      id="contacts-pagination"
      style={{
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        fontSize: '13px',
      }}
    >
      {/* Left Badge with total contacts */}
      <div
        style={{
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: 4,
          padding: '4px 10px',
          fontWeight: 700,
          color: '#334155',
          fontSize: 12,
        }}
      >
        {totalCount.toLocaleString()} contacts
      </div>

      {/* Center Pagination Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(pageIndex - 1)}
          style={{
            background: 'none',
            border: 'none',
            color: currentPage === 1 ? '#cbd5e1' : '#00a4bd',
            fontWeight: 600,
            cursor: currentPage === 1 ? 'default' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: '2px 6px',
          }}
        >
          <ChevronLeft size={15} /> Prev
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              className="hide-on-mobile"
              onClick={() => onPageChange(p - 1)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 4,
                border: isActive ? '1px solid #00a4bd' : 'none',
                background: isActive ? '#e0f2fe' : 'transparent',
                color: isActive ? '#00a4bd' : '#334155',
                fontWeight: isActive ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(pageIndex + 1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#00a4bd',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: '2px 6px',
          }}
        >
          Next <ChevronRight size={15} />
        </button>

        {/* Page Size Selector Dropdown */}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{
            marginLeft: '0.5rem',
            border: 'none',
            background: 'none',
            color: '#00a4bd',
            fontWeight: 600,
            fontSize: 12,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      {/* Right Controls (Refresh, Export, Clone) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          type="button"
          onClick={onRefresh}
          className="oneness-btn-secondary"
          style={{ borderRadius: '9999px', padding: '0.25rem 0.6rem', fontSize: 12 }}
          title="Refresh contacts data"
        >
          <RefreshCw size={13} />
        </button>
        <button
          type="button"
          onClick={onExport}
          className="oneness-btn-secondary hide-on-mobile"
          style={{ borderRadius: '9999px', padding: '0.25rem 0.65rem', fontSize: 12 }}
        >
          <Download size={13} style={{ color: '#00a4bd' }} /> Export
        </button>
        <button
          type="button"
          onClick={onClone}
          className="oneness-btn-secondary hide-on-mobile"
          style={{ borderRadius: '9999px', padding: '0.25rem 0.65rem', fontSize: 12 }}
        >
          <Copy size={13} /> Clone
        </button>
      </div>
    </div>
  );
}
