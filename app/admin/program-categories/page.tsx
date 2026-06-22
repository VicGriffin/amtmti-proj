"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/components/admin/category-form';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  slug: string;
  title: string;
  description?: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const router = useRouter();

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/program-categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const startEdit = (cat: Category) => {
    setEditing(cat);
  };

  const closeForm = () => {
    setEditing(null);
    fetchCategories();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Program Categories</h1>
      <button
        onClick={() => setEditing({} as Category)}
        className="mb-4 bg-primary text-white px-4 py-2"
      >
        Create Category
      </button>
      {editing && <CategoryForm initial={editing} />}
      <div className="grid gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className="p-4 flex justify-between items-center">
            <div>
              <h2 className="font-medium">{cat.title}</h2>
              <p className="text-sm text-muted-foreground">{cat.slug}</p>
            </div>
            <Badge variant="secondary" className="ml-auto" onClick={() => startEdit(cat)}>
              Edit
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
