import { useState, useMemo } from 'react';
import { Building2, Plus, Search, ExternalLink } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employees: number;
  city: string;
  country: string;
  phone: string;
  createdAt: string;
}

const INITIAL_COMPANIES: Company[] = [
  { id: 'comp-1', name: 'Nithyananda University', domain: 'nithyananda.edu.in', industry: 'Education & Research', employees: 1200, city: 'Bengaluru', country: 'India', phone: '+91 80 2345 6789', createdAt: '2026-08-20' },
  { id: 'comp-2', name: 'Computing Institute of Oneness', domain: 'computingoneness.org', industry: 'Information Technology', employees: 450, city: 'Boston', country: 'United States', phone: '+1 617 555 0199', createdAt: '2026-08-15' },
  { id: 'comp-3', name: 'TechCorp Global', domain: 'techcorpglobal.com', industry: 'Software & Cloud', employees: 15000, city: 'San Francisco', country: 'United States', phone: '+1 415 555 9900', createdAt: '2026-08-01' },
  { id: 'comp-4', name: 'BrightMind Labs', domain: 'brightmindlabs.io', industry: 'Biotechnology', employees: 85, city: 'London', country: 'United Kingdom', phone: '+44 20 7946 0192', createdAt: '2026-08-25' },
  { id: 'comp-5', name: 'Apex Solutions', domain: 'apexsolutions.biz', industry: 'Financial Services', employees: 340, city: 'Sydney', country: 'Australia', phone: '+61 2 9876 5432', createdAt: '2026-08-18' },
];

export function CompaniesView() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newIndustry, setNewIndustry] = useState('Software & Cloud');
  const [newEmployees, setNewEmployees] = useState('100');
  const [newCity, setNewCity] = useState('');

  // Extract unique industries for filter dropdown
  const industriesList = useMemo(() => {
    const list = new Set<string>();
    companies.forEach(c => list.add(c.industry));
    return ['All', ...Array.from(list)];
  }, [companies]);

  // Filter companies based on search & industry selection
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.domain.toLowerCase().includes(search.toLowerCase());
      const matchIndustry = industryFilter === 'All' || c.industry === industryFilter;
      return matchSearch && matchIndustry;
    });
  }, [companies, search, industryFilter]);

  // Handle adding a company
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDomain.trim()) return;

    const newComp: Company = {
      id: `comp-${Date.now()}`,
      name: newName,
      domain: newDomain,
      industry: newIndustry,
      employees: parseInt(newEmployees) || 10,
      city: newCity || 'Remote',
      country: 'United States',
      phone: '+1 800 555 0100',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCompanies(prev => [newComp, ...prev]);
    setNewName('');
    setNewDomain('');
    setNewEmployees('100');
    setNewCity('');
    setIsAddingCompany(false);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc', height: '100%', overflowY: 'auto' }} id="companies-view-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={24} style={{ color: '#00a4bd' }} /> Companies & Business Accounts
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Store organizational entities, link corporate records, and map organizational hierarchies.
          </p>
        </div>

        <button
          type="button"
          className="oneness-btn-teal"
          onClick={() => setIsAddingCompany(!isAddingCompany)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 16px' }}
        >
          <Plus size={16} /> Add Company
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search company accounts by name or web domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 32px',
              fontSize: '13px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              background: '#ffffff'
            }}
          />
        </div>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          style={{
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '13px',
            background: '#ffffff',
            color: '#475569',
            fontWeight: 600
          }}
        >
          {industriesList.map(ind => (
            <option key={ind} value={ind}>{ind === 'All' ? 'Filter by Industry: All' : ind}</option>
          ))}
        </select>
      </div>

      {/* Create New Company Form overlay */}
      {isAddingCompany && (
        <form
          onSubmit={handleAddCompany}
          style={{
            background: '#ffffff',
            border: '1px solid #00a4bd',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'end',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>COMPANY NAME</label>
            <input
              type="text"
              placeholder="e.g. Nithyananda University"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>WEB DOMAIN</label>
            <input
              type="text"
              placeholder="e.g. nithyananda.edu.in"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>INDUSTRY SECTOR</label>
            <select
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px', background: '#fff' }}
            >
              <option value="Education & Research">Education & Research</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Software & Cloud">Software & Cloud</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Hospitality & Services">Hospitality & Services</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>EMPLOYEE STRENGTH</label>
            <input
              type="number"
              value={newEmployees}
              onChange={(e) => setNewEmployees(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>HEADQUARTERS CITY</label>
            <input
              type="text"
              placeholder="e.g. Boston"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="oneness-btn-secondary"
              onClick={() => setIsAddingCompany(false)}
              style={{ padding: '6px 12px', fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="oneness-btn-teal"
              style={{ padding: '6px 16px', fontSize: 13 }}
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Grid of Company Profile Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredCompanies.map((c) => {
          return (
            <div
              key={c.id}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '6px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a4bd' }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{c.name}</h3>
                    <a href={`https://${c.domain}`} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#00a4bd', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      {c.domain} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '11.5px', color: '#475569', marginTop: 4, background: '#f8fafc', padding: '8px', borderRadius: '4px' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block', fontWeight: 600 }}>INDUSTRY</span>
                  <span style={{ fontWeight: 600 }}>{c.industry}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block', fontWeight: 600 }}>EMPLOYEES</span>
                  <span style={{ fontWeight: 600 }}>{c.employees.toLocaleString()}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block', fontWeight: 600 }}>LOCATION</span>
                  <span style={{ fontWeight: 600 }}>{c.city}, {c.country}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block', fontWeight: 600 }}>CREATED</span>
                  <span style={{ fontWeight: 600 }}>{c.createdAt}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', justifyContent: 'flex-end' }}>
                <a
                  href={`tel:${c.phone}`}
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', color: '#475569', fontWeight: 600, background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}
                >
                  Call Account
                </a>
                <button
                  type="button"
                  onClick={() => alert(`Showing corporate structures & connected contacts for ${c.name}`)}
                  style={{ border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#00a4bd', fontWeight: 600 }}
                >
                  View Contacts
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default CompaniesView;
