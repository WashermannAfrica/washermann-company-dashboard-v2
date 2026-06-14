'use client';

import { useState } from 'react';
import { UserRound, Plus, Mail, TriangleAlert, ArrowUpRight } from 'lucide-react';
import { PageKpi, StatBlock } from '@/components/ui/PageKpi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Chip } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { RowMenu } from '@/components/ui/RowMenu';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, SelectField } from '@/components/ui/Input';
import { WORKERS, TIERS, Worker } from '@/lib/mock-data';

export default function WorkersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [suspending, setSuspending] = useState<Worker | null>(null);

  const columns: Column<Worker>[] = [
    {
      key: 'name', header: 'Name', sortable: true, value: (w) => w.name,
      render: (w) => (
        <span className="flex items-center gap-2.5 font-medium text-ink">
          <Avatar name={w.name} size={28} dot /> {w.name}
        </span>
      ),
    },
    { key: 'email', header: 'Email', render: (w) => <span className="text-body">{w.email}</span> },
    {
      key: 'tier', header: 'Tier', value: (w) => w.tier,
      render: (w) => <span className="rounded-md border border-line px-2 py-0.5 text-[11px] text-body">{w.tier}</span>,
    },
    { key: 'balance', header: 'Balance', render: (w) => <span className="text-ink">{w.balance.toLocaleString()} pts</span> },
    { key: 'used', header: 'Used / cycle', render: (w) => <span className="text-body">{w.usedThisCycle} pts</span> },
    { key: 'status', header: 'Status', sortable: true, value: (w) => w.status, render: (w) => <Chip>{w.status}</Chip> },
    {
      key: 'menu', header: '', render: (w) => (
        <RowMenu items={[
          { label: 'View details', icon: <ArrowUpRight size={14} /> },
          { label: 'Suspend worker', icon: <TriangleAlert size={14} />, danger: true, onClick: () => setSuspending(w) },
        ]} />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageKpi icon={<UserRound size={16} />} iconClass="bg-violet text-white" label="Total Workers" value={String(WORKERS.length)} delta="+3 this month" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBlock label="Active" value={String(WORKERS.filter((w) => w.status === 'Active').length)} hint="receiving benefits" />
        <StatBlock label="Pending invites" value={String(WORKERS.filter((w) => w.status === 'Pending').length)} hint="awaiting acceptance" />
        <StatBlock label="Tiers in use" value={String(TIERS.length)} hint="Starter, Standard, Premium" />
      </div>

      <DataTable
        columns={columns}
        rows={WORKERS}
        searchPlaceholder="Search by name"
        filters={[{ label: 'Status' }, { label: 'Tier' }]}
        pageSize={8}
        exportName="washermann-workers"
        headerExtra={
          <button onClick={() => setAddOpen(true)} className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-semibold text-white hover:bg-primary-dark">
            <Plus size={14} /> Add Worker
          </button>
        }
      />

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Worker">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }}>
          <Input label="Full Name" required placeholder="e.g, Adebayo Johnson" />
          <Input label="Email" required type="email" placeholder="worker@acmecorp.com" leftIcon={<Mail size={15} />} />
          <SelectField label="Tier" required defaultValue="">
            <option value="" disabled>Select tier</option>
            {TIERS.map((t) => <option key={t.id}>{t.name}</option>)}
          </SelectField>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Send Invite</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!suspending}
        onClose={() => setSuspending(null)}
        icon={<TriangleAlert size={20} />}
        title={`Suspend ${suspending?.name ?? 'worker'}?`}
        body="Suspending this worker pauses their benefit allocation and blocks new orders. Their balance is retained and can be restored."
        confirmLabel="Suspend Worker"
      />
    </div>
  );
}
