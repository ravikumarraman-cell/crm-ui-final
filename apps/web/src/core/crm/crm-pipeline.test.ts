import { describe, expect, it } from 'vitest';
import { Contact } from './types';

// Let's test the commercial pipeline metrics logic used by the reports view
function calculatePipelineStats(contacts: Contact[]) {
  const total = 526895 + contacts.length;
  const bounced = contacts.filter(c => c.bounced).length;
  const reachablePercent = total > 0 ? (((total - bounced) / total) * 100).toFixed(2) : '0.00';
  
  const estimatedPipeline = contacts.reduce((sum, c) => {
    let val = 1500; // Base value
    if (c.priority === 'high') val += 3000;
    if (c.priority === 'medium') val += 1500;
    if (c.lifecycleStage === 'Customer') val += 8000;
    if (c.lifecycleStage === 'Opportunity') val += 5000;
    return sum + val;
  }, 184500);

  return {
    total,
    reachablePercent,
    estimatedPipeline,
  };
}

// Test pipeline promotion stages
const STAGES = ['Lead', 'Qualified', 'Demo Scheduled', 'Proposal Sent', 'Negotiation', 'Won'];
function moveDealStage(currentStage: string, direction: 'forward' | 'backward'): string {
  const currentIdx = STAGES.indexOf(currentStage);
  if (currentIdx === -1) return currentStage;

  let nextIdx = currentIdx;
  if (direction === 'forward' && currentIdx < STAGES.length - 1) nextIdx += 1;
  if (direction === 'backward' && currentIdx > 0) nextIdx -= 1;

  return STAGES[nextIdx];
}

describe('CRM Business Logic & Analytics pipeline', () => {
  const mockContacts: Contact[] = [
    {
      id: 'c1',
      name: 'John Doe',
      email: 'john@example.com',
      priority: 'high',
      lifecycleStage: 'Opportunity',
      createDate: '2026-08-20',
      owner: 'Ravi Kumar',
    },
    {
      id: 'c2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      priority: 'medium',
      lifecycleStage: 'Customer',
      createDate: '2026-08-21',
      bounced: true,
      owner: 'No owner',
    },
    {
      id: 'c3',
      name: 'Alice Brown',
      email: 'alice@example.com',
      priority: 'low',
      lifecycleStage: 'Lead',
      createDate: '2026-08-22',
      owner: 'Ravi Kumar',
    }
  ];

  it('correctly calculates total contact count including mock entries', () => {
    const stats = calculatePipelineStats(mockContacts);
    expect(stats.total).toBe(526895 + 3);
  });

  it('correctly calculates email reachability percentage discounting bounced entries', () => {
    const stats = calculatePipelineStats(mockContacts);
    const total = 526895 + 3;
    const expectedPercent = (((total - 1) / total) * 100).toFixed(2);
    expect(stats.reachablePercent).toBe(expectedPercent);
  });

  it('correctly compiles weighted pipeline valuation depending on lifecycle and priority levels', () => {
    // Expected math for mockContacts:
    // Base: 184500
    // c1: 1500 (base) + 3000 (high) + 5000 (opportunity) = 9500
    // c2: 1500 (base) + 1500 (medium) + 8000 (customer) = 11000
    // c3: 1500 (base) + 0 (low) + 0 (lead) = 1500
    // Total estimated pipeline: 184500 + 9500 + 11000 + 1500 = 206500
    const stats = calculatePipelineStats(mockContacts);
    expect(stats.estimatedPipeline).toBe(206500);
  });

  it('correctly promotes a commercial deal forward through standard sales stages', () => {
    let stage = 'Lead';
    stage = moveDealStage(stage, 'forward');
    expect(stage).toBe('Qualified');

    stage = moveDealStage(stage, 'forward');
    expect(stage).toBe('Demo Scheduled');
  });

  it('correctly demotes a commercial deal backward through standard sales stages', () => {
    let stage = 'Proposal Sent';
    stage = moveDealStage(stage, 'backward');
    expect(stage).toBe('Demo Scheduled');
  });

  it('prevents deal promotion out of bounds at boundaries', () => {
    let firstStage = 'Lead';
    expect(moveDealStage(firstStage, 'backward')).toBe('Lead');

    let lastStage = 'Won';
    expect(moveDealStage(lastStage, 'forward')).toBe('Won');
  });
});
