"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryForm({ initial }: {
  initial?: { id: string; slug: string; title: string; description?: string };
}) {
  const [slug, setSlug] = useState(initial?.slug || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const router = useRouter();
  const isEdit = !!initial?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { slug, title, description };
    const url = isEdit
      ? `/api/admin/program-categories/${initial!.id}`
      : '/api/admin/program-categories';
    const method = isEdit ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) router.refresh();
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    const res = await fetch(`/api/admin/program-categories/${initial!.id}`, {
      method: 'DELETE',
    });
    if (res.ok) router.push('/admin/program-categories');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border">
      <div>
        <label className="block font-medium">Slug</label>
        <input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          className="border w-full p-1"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border w-full p-1"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border w-full p-1"
        />
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2">
        {isEdit ? 'Update' : 'Create'} Category
      </button>
      {isEdit && (
        <button
          type="button"
          onClick={handleDelete}
          className="ml-2 bg-red-600 text-white px-4 py-2"
        >
          Delete
        </button>
      )}
    </form>
  );
}
