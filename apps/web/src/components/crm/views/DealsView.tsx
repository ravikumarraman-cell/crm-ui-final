import { useState, useMemo } from 'react';
import { DollarSign, Plus, ArrowRight, ArrowLeft, Trash2, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  company: string;
  amount: number;
  stage: string;
  owner: string;
  closeDate: string;
}

const INITIAL_DEALS: Deal[] = [
  { id: 'deal-1', title: 'Enterprise Software Subscription', company: 'Nithyananda University', amount: 45000, stage: 'Proposal Sent', owner: 'Ravi Kumar', closeDate: '2026-09-15' },
  { id: 'deal-2', title: 'Consulting & Setup Package', company: 'Computing Institute', amount: 12000, stage: 'Demo Scheduled', owner: 'No owner', closeDate: '2026-09-10' },
  { id: 'deal-3', title: 'Support SLA Renewal', company: 'TechCorp Global', amount: 8000, stage: 'Won', owner: 'No owner', closeDate: '2026-08-25' },
  { id: 'deal-4', title: 'CRM Expansion Implementation', company: 'BrightMind Labs', amount: 25000, stage: 'Qualified', owner: 'Sarah Connor', closeDate: '2026-10-01' },
  { id: 'deal-5', title: 'Data Migration Services', company: 'Apex Solutions', amount: 15000, stage: 'Lead', owner: 'No owner', closeDate: '2026-09-30' },
  { id: 'deal-6', title: 'Mobile App Redevelopment', company: 'Global Education Alliance', amount: 65000, stage: 'Negotiation', owner: 'Ravi Kumar', closeDate: '2026-11-15' },
];

const STAGES = ['Lead', 'Qualified', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Won'];

export function DealsView() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealAmount, setNewDealAmount] = useState('10000');
  const [newDealStage, setNewDealStage] = useState('Lead');
  const [isAddingDeal, setIsAddingDeal] = useState(false);

  // Calculate high-level pipeline stats
  const stats = useMemo(() => {
    const totalPipeline = deals.reduce((sum, d) => sum + d.amount, 0);
    const wonCount = deals.filter(d => d.stage === 'Won').length;
    const wonAmount = deals.filter(d => d.stage === 'Won').reduce((sum, d) => sum + d.amount, 0);
    return {
      totalPipeline,
      wonCount,
      wonAmount,
      avgDealSize: deals.length ? Math.round(totalPipeline / deals.length) : 0,
    };
  }, [deals]);

  // Promote deal stage
  const moveDeal = (id: string, direction: 'forward' | 'backward') => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const currentIdx = STAGES.indexOf(d.stage);
        if (currentIdx === -1) return d;

        let nextIdx = currentIdx;
        if (direction === 'forward' && currentIdx < STAGES.length - 1) nextIdx += 1;
        if (direction === 'backward' && currentIdx > 0) nextIdx -= 1;

        return { ...d, stage: STAGES[nextIdx] };
      })
    );
  };

  // Delete deal
  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  // Add new deal
  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle.trim() || !newDealCompany.trim()) return;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: newDealTitle,
      company: newDealCompany,
      amount: parseFloat(newDealAmount) || 0,
      stage: newDealStage,
      owner: 'Current User',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setDeals(prev => [newDeal, ...prev]);
    setNewDealTitle('');
    setNewDealCompany('');
    setNewDealAmount('10000');
    setIsAddingDeal(false);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc', height: '100%', overflowY: 'auto' }} id="deals-view-container">
      {/* Header section with inline action toggles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={24} style={{ color: '#00a4bd' }} /> Deals Sales Pipeline
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Manage commercial pipelines, deal stages, and close opportunities.
          </p>
        </div>

        <button
          type="button"
          className="oneness-btn-teal"
          onClick={() => setIsAddingDeal(!isAddingDeal)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 16px' }}
        >
          <Plus size={16} /> New Opportunity
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>ACTIVE VALUE PIPELINE</span>
            <TrendingUp size={16} style={{ color: '#00a4bd' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
            ${stats.totalPipeline.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{deals.length} active opportunities</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>REVENUE SECURED (WON)</span>
            <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', marginTop: 4 }}>
            ${stats.wonAmount.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{stats.wonCount} won contracts</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>AVERAGE DEAL TICKET</span>
            <DollarSign size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
            ${stats.avgDealSize.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Per qualified pipeline lead</span>
        </div>
      </div>

      {/* Create New Deal Form Modal / Overlay Drawer */}
      {isAddingDeal && (
        <form
          onSubmit={handleAddDeal}
          style={{
            background: '#ffffff',
            border: '1px solid #00a4bd',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
          }}
        >
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>DEAL OPPORTUNITY TITLE</label>
            <input
              type="text"
              placeholder="e.g. Enterprise Cloud License"
              value={newDealTitle}
              onChange={(e) => setNewDealTitle(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>COMPANY / ACCOUNT</label>
            <input
              type="text"
              placeholder="e.g. Nithyananda University"
              value={newDealCompany}
              onChange={(e) => setNewDealCompany(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>DEAL VALUE ($)</label>
            <input
              type="number"
              placeholder="Amount"
              value={newDealAmount}
              onChange={(e) => setNewDealAmount(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>INITIAL STAGE</label>
            <select
              value={newDealStage}
              onChange={(e) => setNewDealStage(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '6px 10px', fontSize: '13px', background: '#fff' }}
            >
              {STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="oneness-btn-secondary"
              onClick={() => setIsAddingDeal(false)}
              style={{ padding: '6px 12px', fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="oneness-btn-teal"
              style={{ padding: '6px 16px', fontSize: 13 }}
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Kanban Board Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, minmax(180px, 1fr))`, gap: '0.75rem', flex: 1, alignItems: 'stretch' }}>
        {STAGES.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <div
              key={stage}
              style={{
                background: '#f1f5f9',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* Stage header */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{stage}</span>
                  <span style={{ background: '#cbd5e1', color: '#1e293b', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '10px' }}>
                    {stageDeals.length}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#00a4bd' }}>
                  ${stageValue.toLocaleString()}
                </span>
              </div>

              {/* Deals cards inside current stage */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
                {stageDeals.length === 0 ? (
                  <div style={{ padding: '2rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '11px', border: '1px dashed #cbd5e1', borderRadius: '6px' }}>
                    No opportunities
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    return (
                      <div
                        key={deal.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                          position: 'relative'
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#00a4bd' }}>{deal.company}</span>
                        <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{deal.title}</h4>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: '0.4rem', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                            ${deal.amount.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '10px', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <Calendar size={10} /> {deal.closeDate}
                          </span>
                        </div>

                        {/* Interactive promotion controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {STAGES.indexOf(deal.stage) > 0 && (
                              <button
                                type="button"
                                onClick={() => moveDeal(deal.id, 'backward')}
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', padding: '2px 4px', color: '#475569' }}
                                title="Move Left"
                              >
                                <ArrowLeft size={10} />
                              </button>
                            )}
                            {STAGES.indexOf(deal.stage) < STAGES.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveDeal(deal.id, 'forward')}
                                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer', padding: '2px 4px', color: '#475569' }}
                                title="Move Right"
                              >
                                <ArrowRight size={10} />
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteDeal(deal.id)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            title="Remove Deal"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default DealsView;
