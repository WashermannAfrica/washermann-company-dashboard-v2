'use client';

import Link from 'next/link';
import { Wallet as WalletIcon, ArrowUp } from 'lucide-react';
import { PageKpi, StatBlock } from '@/components/ui/PageKpi';
import { Section, Panel } from '@/components/ui/Section';
import { LineChart } from '@/components/ui/LineChart';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Chip, statusTone } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ACTIVITIES, SPEND_PER_MONTH, Activity } from '@/lib/mock-data';

const columns: Column<Activity>[] = [
  {
    key: 'name', header: 'Name', sortable: true, value: (a) => a.name,
    render: (a) => (
      <span className="flex items-center gap-2.5 font-medium text-ink">
        <Avatar name={a.name} size={28} dot /> {a.name}
      </span>
    ),
  },
  {
    key: 'type', header: 'Activity Type', value: (a) => a.type,
    render: (a) => (
      <span><span className="block font-medium text-ink">{a.type}</span><span className="text-xs text-faint">{a.when}</span></span>
    ),
  },
  {
    key: 'amount', header: 'Amount', value: (a) => a.amount,
    render: (a) => {
      const credit = a.amount >= 0;
      return <span className={credit ? 'font-medium text-success' : 'text-ink'}>{credit ? '+' : '−'}{Math.abs(a.amount).toLocaleString()} pts</span>;
    },
  },
  { key: 'status', header: 'Status', sortable: true, value: (a) => a.status, render: (a) => <Chip tone={statusTone(a.status)}>{a.status}</Chip> },
  { key: 'view', header: '', render: () => <Link href="/wallet" className="cursor-pointer font-medium text-ink underline-offset-2 hover:underline">View Detail</Link> },
];

export default function CompanyDashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageKpi
          icon={<WalletIcon size={16} />}
          iconClass="bg-primary text-white"
          label="Wallet Balance"
          value="₦184,500"
          delta="≈ 1,605,217 wash points"
          className="flex-1 border-0 pb-0"
        />
        <Link href="/wallet"><Button><ArrowUp size={15} /> Top up wallet</Button></Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBlock label="Workers" value="37" hint="32 active" />
        <StatBlock label="Allocated / cycle" value="92,250 pts" hint="across 3 tiers" />
        <StatBlock label="Used this cycle" value="48,120 pts" hint="52% of allocation" />
      </div>

      <Section>
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] text-body">Wash Points Spend</p>
              <p className="mt-1 text-3xl font-bold text-ink">+48%</p>
              <p className="mt-1 text-xs text-faint">Points spent by your team each month</p>
            </div>
            <button className="flex h-8 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-xs text-body">12 months</button>
          </div>
          <div className="mt-4">
            <LineChart series={[{ name: 'Spend', color: '#13C490', data: SPEND_PER_MONTH, fill: true }]} />
          </div>
        </Panel>
      </Section>

      <div>
        <h2 className="mb-3 text-lg font-bold text-ink">Recent activities</h2>
        <DataTable
          columns={columns}
          rows={ACTIVITIES}
          searchPlaceholder="Search activity"
          filters={[{ label: 'Status' }, { label: 'Type', key: 'type' }, { label: 'Date' }]}
          pageSize={5}
          exportName="washermann-activities"
        />
      </div>
    </div>
  );
}
