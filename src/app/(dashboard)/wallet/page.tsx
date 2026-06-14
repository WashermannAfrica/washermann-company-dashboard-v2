'use client';

import { useState } from 'react';
import { Wallet as WalletIcon, ArrowUp, Plus } from 'lucide-react';
import { PageKpi, StatBlock } from '@/components/ui/PageKpi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Chip, statusTone } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ACTIVITIES, WALLET_TOPUPS, Activity } from '@/lib/mock-data';

function amountCell(a: Activity) {
  const credit = a.amount >= 0;
  return <span className={credit ? 'font-medium text-success' : 'text-ink'}>{credit ? '+' : '−'}{Math.abs(a.amount).toLocaleString()} pts</span>;
}

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
      <span>
        <span className="block font-medium text-ink">{a.type}</span>
        <span className="text-xs text-faint">{a.when}</span>
      </span>
    ),
  },
  { key: 'amount', header: 'Amount', value: (a) => a.amount, render: amountCell },
  { key: 'status', header: 'Status', sortable: true, value: (a) => a.status, render: (a) => <Chip tone={statusTone(a.status)}>{a.status}</Chip> },
  { key: 'view', header: '', render: () => <span className="cursor-pointer font-medium text-ink underline-offset-2 hover:underline">View Detail</span> },
];

export default function WalletPage() {
  const [tab, setTab] = useState('Wash points usage');
  const [topUpOpen, setTopUpOpen] = useState(false);
  const rows = tab === 'Wash points usage' ? ACTIVITIES : WALLET_TOPUPS;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageKpi
        icon={<WalletIcon size={16} />}
        iconClass="bg-primary text-white"
        label="Wallet Balance"
        value="₦184,500"
        delta="≈ 1,605,217 wash points"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBlock label="Allocated this cycle" value="92,250 pts" hint="across 37 workers" />
        <StatBlock label="Used this cycle" value="48,120 pts" hint="52% of allocation" />
        <StatBlock label="Expiring soon" value="6,400 pts" hint="in 8 days" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Recent activities</h2>
        <Button onClick={() => setTopUpOpen(true)}><ArrowUp size={15} /> Top up wallet</Button>
      </div>

      <Tabs tabs={['Wash points usage', 'Wallet top up']} active={tab} onChange={setTab} />

      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Search"
        filters={[{ label: 'Status' }, { label: 'Type', key: 'type' }, { label: 'Date' }]}
        pageSize={5}
        exportName="washermann-activities"
      />

      <Modal open={topUpOpen} onClose={() => setTopUpOpen(false)} title="Top up wallet">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setTopUpOpen(false); }}>
          <Input label="Amount (₦)" required type="number" placeholder="e.g. 100,000" leftIcon={<Plus size={15} />} />
          <p className="rounded-2xl bg-section px-4 py-3 text-[13px] text-body">
            At the current rate, <b className="text-ink">₦100,000</b> ≈ <b className="text-ink">870,000 wash points</b>.
          </p>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setTopUpOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Pay with Paystack</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
