/* ─────────────────────────────────────────────────────────────────────────────
   Mock data for the Washermann Company (business) portal.
   Mirrors the design screens; replace with real API calls when wired in.
   ──────────────────────────────────────────────────────────────────────────── */

const NAMES = [
  'Arlene McCoy', 'Esther Howard', 'Savannah Nguyen', 'Floyd Miles', 'Marvin McKinney',
  'Jenny Wilson', 'Kathryn Murphy', 'Jacob Jones', 'Courtney Henry', 'Theresa Webb',
  'Cameron Williamson', 'Brooklyn Simmons', 'Leslie Alexander', 'Guy Hawkins', 'Robert Fox',
  'Annette Black', 'Dianne Russell', 'Devon Lane', 'Eleanor Pena', 'Wade Warren',
];

/* ── Activity (Recent activities → Wash points usage / Wallet top up) ── */
export type ActivityType = 'Wash Order' | 'Wallet Top-Up' | 'Benefit Expiry' | 'Tier Allocation';
export interface Activity {
  name: string;
  type: ActivityType;
  when: string;
  amount: number; // signed: credits +, spend -
  status: 'Successful' | 'In Progress' | 'Failed';
  [key: string]: unknown;
}

const TYPES: ActivityType[] = ['Wash Order', 'Wallet Top-Up', 'Wash Order', 'Benefit Expiry', 'Tier Allocation'];

export const ACTIVITIES: Activity[] = Array.from({ length: 32 }, (_, i) => {
  const type = TYPES[i % TYPES.length];
  // Top-ups and allocations are credits (+), wash/expiry are debits (−)
  const credit = type === 'Wallet Top-Up' || type === 'Tier Allocation';
  const mag = ((i % 6) + 1) * 35 + 50;
  return {
    name: NAMES[i % NAMES.length],
    type,
    when: `May ${((i % 27) + 1)}, ${(9 + (i % 9))}:${i % 2 ? '14' : '30'} ${i % 2 ? 'AM' : 'PM'}`,
    amount: credit ? mag : -mag,
    status: (['Successful', 'Successful', 'In Progress', 'Successful', 'Failed'] as const)[i % 5],
  };
});

export const WALLET_TOPUPS: Activity[] = Array.from({ length: 14 }, (_, i) => ({
  name: NAMES[(i + 3) % NAMES.length],
  type: 'Wallet Top-Up',
  when: `May ${((i % 27) + 1)}, 04:30 PM`,
  amount: ((i % 5) + 1) * 5000,
  status: (['Successful', 'Successful', 'In Progress', 'Successful', 'Failed'] as const)[i % 5],
}));

/* ── Workers ── */
export interface Worker {
  id: string;
  name: string;
  email: string;
  tier: string;
  balance: number;     // wash points
  usedThisCycle: number;
  status: 'Active' | 'Pending' | 'Suspended';
  joined: string;
  [key: string]: unknown;
}

const TIER_NAMES = ['Starter', 'Standard', 'Premium'];

export const WORKERS: Worker[] = Array.from({ length: 26 }, (_, i) => ({
  id: `WK-${100 + i}`,
  name: NAMES[i % NAMES.length],
  email: `${NAMES[i % NAMES.length].toLowerCase().replace(/\s+/g, '.')}@acmecorp.com`,
  tier: TIER_NAMES[i % TIER_NAMES.length],
  balance: 100 + (i % 9) * 80,
  usedThisCycle: (i % 7) * 25,
  status: (['Active', 'Active', 'Pending', 'Active', 'Suspended'] as const)[i % 5],
  joined: `${((i % 27) + 1)} May 2026`,
}));

/* ── Tiers (onboarding + benefits) ── */
export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly (if relevant)';
export interface Tier {
  id: string;
  name: string;
  count: number;        // number of workers in this tier
  frequency: Frequency;
  washPoints: number;   // wash points granted each cycle
  [key: string]: unknown;
}

export const TIERS: Tier[] = [
  { id: 't1', name: 'Starter', count: 20, frequency: 'Monthly', washPoints: 100 },
  { id: 't2', name: 'Standard', count: 12, frequency: 'Monthly', washPoints: 250 },
  { id: 't3', name: 'Premium', count: 5, frequency: 'Monthly', washPoints: 500 },
];

export const FREQUENCIES: Frequency[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly (if relevant)'];

/* ── Dashboard chart series ── */
export const SPEND_PER_MONTH = [120, 180, 160, 220, 260, 240, 300, 360, 340, 400, 460, 520];
