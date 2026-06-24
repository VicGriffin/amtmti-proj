"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Program } from '@/lib/programs-data';

type ProgramFormData = {
  id?: string;
  slug: string;
  title: string;
  category_id?: string;
  category?: string;
  category_label?: string;
  level?: string;
  mode?: string;
  duration?: string;
  fees_ksh?: number;
  summary?: string;
  outcomes?: string[];
  featured?: boolean;
  status?: string;
  intake?: string;
  learning_methods?: string[];
  image?: string;
};

export default function ProgramForm({
  initial,
  onClose,
}: {
  initial?: Program;
  onClose?: () => void;
}) {
  const [slug, setSlug] = useState(initial?.slug || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [categoryId, setCategoryId] = useState('');
  const [category, setCategory] = useState(initial?.category || '');
  const [categoryLabel, setCategoryLabel] = useState(initial?.category_label || '');
  const [level, setLevel] = useState<string>(initial?.level || 'Certificate');
  const [mode, setMode] = useState<string>(initial?.mode || 'Online');
  const [duration, setDuration] = useState(initial?.duration || '');
  const [fees, setFees] = useState(initial?.fees_ksh?.toString() || '0');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [status, setStatus] = useState(initial?.status || 'draft');

  const router = useRouter();
  const isEdit = !!initial?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      slug,
      title,
      category_id: categoryId || null,
      category,
      category_label: categoryLabel,
      level,
      mode,
      duration,
      fees_ksh: Number(fees),
      summary,
      status,
    };
    const url = isEdit ? `/api/admin/programs/${initial!.id}` : '/api/admin/programs';
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
        router.refresh();
        if (onClose) onClose();
      }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    const res = await fetch(`/api/admin/programs/${initial!.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin/programs');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border">
      <div><label className="block">Slug</label><input value={slug} onChange={e => setSlug(e.target.value)} required className="border w-full p-1"/></div>
      <div><label className="block">Title</label><input value={title} onChange={e => setTitle(e.target.value)} required className="border w-full p-1"/></div>
      <div><label className="block">Category Label</label><input value={categoryLabel} onChange={e => setCategoryLabel(e.target.value)} className="border w-full p-1"/></div>
      <div><label className="block">Level</label><input value={level} onChange={e => setLevel(e.target.value)} className="border w-full p-1"/></div>
      <div><label className="block">Mode</label><input value={mode} onChange={e => setMode(e.target.value)} className="border w-full p-1"/></div>
      <div><label className="block">Duration</label><input value={duration} onChange={e => setDuration(e.target.value)} className="border w-full p-1"/></div>
      <div><label className="block">Fees (USD)</label><input value={fees} onChange={e => setFees(e.target.value)} type="number" className="border w-full p-1"/></div>
      <div><label className="block">Summary</label><textarea value={summary} onChange={e => setSummary(e.target.value)} className="border w-full p-1"/></div>
      <div><label className="block">Status</label><select value={status} onChange={e => setStatus(e.target.value)} className="border w-full p-1"><option value="draft">Draft</option><option value="published">Published</option></select></div>
      <button type="submit" className="bg-primary text-white px-4 py-2">{isEdit ? 'Update' : 'Create'} Program</button>
      {isEdit && (<button type="button" onClick={handleDelete} className="ml-2 bg-red-600 text-white px-4 py-2">Delete</button>)}
    </form>
  );
}
