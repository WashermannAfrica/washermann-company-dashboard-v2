'use client';

import { useState } from 'react';
import { Gift, Plus, Pencil, Trash2, Users } from 'lucide-react';
import { PageKpi, StatBlock } from '@/components/ui/PageKpi';
import { Section, Panel } from '@/components/ui/Section';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, SelectField } from '@/components/ui/Input';
import { TIERS, FREQUENCIES, Tier } from '@/lib/mock-data';

export default function BenefitsPage() {
  const [tiers, setTiers] = useState<Tier[]>(TIERS);
  const [addOpen, setAddOpen] = useState(false);
  const [deleting, setDeleting] = useState<Tier | null>(null);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageKpi icon={<Gift size={16} />} iconClass="bg-primary text-white" label="Benefit Tiers" value={String(tiers.length)} delta="Monthly allocation active" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBlock label="Workers covered" value={String(tiers.reduce((s, t) => s + t.count, 0))} hint="across all tiers" />
        <StatBlock label="Points / cycle" value={`${tiers.reduce((s, t) => s + t.count * t.washPoints, 0).toLocaleString()} pts`} hint="total monthly grant" />
        <StatBlock label="Next allocation" value="Jun 30, 2026" hint="auto-renews" />
      </div>

      <Section>
        <div className="flex items-center justify-between pb-3">
          <h2 className="px-1 text-sm font-bold text-ink">Tiers</h2>
          <button onClick={() => setAddOpen(true)} className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-semibold text-white hover:bg-primary-dark">
            <Plus size={14} /> Add Tier
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t) => (
            <Panel key={t.id}>
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-medium text-forest">{t.name}</span>
                <div className="flex items-center gap-1">
                  <button className="flex h-7 w-7 items-center justify-center rounded-full text-faint hover:bg-section"><Pencil size={13} /></button>
                  <button onClick={() => setDeleting(t)} className="flex h-7 w-7 items-center justify-center rounded-full text-danger hover:bg-danger-bg"><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-ink">{t.washPoints} pts</p>
              <p className="mt-0.5 text-xs text-faint">{t.frequency}</p>
              <p className="mt-3 flex items-center gap-1.5 border-t border-dashed border-line pt-3 text-xs text-body">
                <Users size={12} /> {t.count} workers
              </p>
            </Panel>
          ))}
        </div>
      </Section>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Tier">
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          setTiers((prev) => [...prev, { id: `t${prev.length + 1}`, name: 'New Tier', count: 0, frequency: 'Monthly', washPoints: 100 }]);
          setAddOpen(false);
        }}>
          <Input label="Tier name" required placeholder="e.g. Starter" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Count" required type="number" placeholder="20" />
            <Input label="Wash points" required type="number" placeholder="100" />
          </div>
          <SelectField label="Frequency" required defaultValue="">
            <option value="" disabled>Select</option>
            {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
          </SelectField>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Add Tier</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && setTiers((prev) => prev.filter((x) => x.id !== deleting.id))}
        icon={<Trash2 size={20} />}
        title={`Delete ${deleting?.name ?? 'tier'}?`}
        body="Workers in this tier will stop receiving its allocation. They keep their current balance. This can't be undone."
        confirmLabel="Delete Tier"
      />
    </div>
  );
}
