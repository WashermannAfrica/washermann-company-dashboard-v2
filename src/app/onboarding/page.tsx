'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FREQUENCIES, Frequency } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface TierDraft {
  id: number;
  name: string;
  count: string;
  frequency: Frequency | '';
  washPoints: string;
}

let nextId = 2;

function FrequencySelect({ value, onChange }: { value: Frequency | ''; onChange: (f: Frequency) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-full bg-section px-5 text-sm',
          value ? 'text-ink' : 'text-faint',
        )}
      >
        {value || 'Select'}
        <ChevronDown size={16} className="text-faint" />
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-40 mt-1 w-full overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-xl">
            {FREQUENCIES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => { onChange(f); setOpen(false); }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-ink hover:bg-section"
              >
                {f}
                {value === f && <Check size={14} className="text-forest" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TierCard({
  tier, index, onChange, onRemove, removable,
}: {
  tier: TierDraft;
  index: number;
  onChange: (patch: Partial<TierDraft>) => void;
  onRemove: () => void;
  removable: boolean;
}) {
  return (
    <div className="relative rounded-2xl border border-dashed border-line p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-medium text-forest">Tier {index + 1}</span>
        {removable && (
          <div className="flex items-center gap-1.5">
            <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full text-faint hover:bg-section">
              <Pencil size={13} />
            </button>
            <button type="button" onClick={onRemove} className="flex h-7 w-7 items-center justify-center rounded-full text-danger hover:bg-danger-bg">
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Tier name">
          <input value={tier.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="e.g. Starter"
            className="h-12 w-full rounded-full bg-section px-5 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </Field>
        <Field label="Count">
          <input value={tier.count} onChange={(e) => onChange({ count: e.target.value })} type="number" placeholder="20"
            className="h-12 w-full rounded-full bg-section px-5 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </Field>
        <Field label="Frequency">
          <FrequencySelect value={tier.frequency} onChange={(f) => onChange({ frequency: f })} />
        </Field>
        <Field label="Wash points in this tier">
          <input value={tier.washPoints} onChange={(e) => onChange({ washPoints: e.target.value })} placeholder="e.g. 100 wpts"
            className="h-12 w-full rounded-full bg-section px-5 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-ink">{label} <span className="text-danger">*</span></label>
      {children}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [tiers, setTiers] = useState<TierDraft[]>([{ id: 1, name: '', count: '', frequency: '', washPoints: '' }]);

  function addTier() {
    setTiers((t) => [...t, { id: nextId++, name: '', count: '', frequency: '', washPoints: '' }]);
  }
  function patchTier(id: number, patch: Partial<TierDraft>) {
    setTiers((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function removeTier(id: number) {
    setTiers((t) => t.filter((x) => x.id !== id));
  }

  function finish() {
    document.cookie = 'wm-company-token=demo-access-token; path=/; SameSite=Lax';
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar: logo · progress · skip */}
      <div className="flex items-center gap-6 px-8 py-6">
        <Image src="/logo-mark.png" alt="Washermann" width={40} height={36} priority />
        <div className="mx-auto h-1.5 w-full max-w-xl rounded-full bg-section">
          <div className="h-1.5 w-1/4 rounded-full bg-primary" />
        </div>
        <button onClick={finish} className="shrink-0 rounded-full bg-section px-4 py-2 text-[13px] font-medium text-ink hover:bg-line">
          Skip I&apos;ll do this later
        </button>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-20">
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-ink">Configure your tiers</h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-body">
            Define wash point tiers for your team. You can always change these later.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {tiers.map((tier, i) => (
            <TierCard
              key={tier.id}
              tier={tier}
              index={i}
              removable={tiers.length > 1}
              onChange={(patch) => patchTier(tier.id, patch)}
              onRemove={() => removeTier(tier.id)}
            />
          ))}

          <button
            onClick={addTier}
            className="flex items-center gap-2 rounded-full bg-section px-5 py-3 text-sm font-medium text-ink hover:bg-line transition-colors"
          >
            <Plus size={16} /> Add Tier
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <Button size="lg" className="w-full max-w-md" onClick={finish}>Next</Button>
        </div>
      </div>
    </div>
  );
}
