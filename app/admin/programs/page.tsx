"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgramForm from '@/components/admin/program-form';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Program {
  id: string;
  slug: string;
  title: string;
  category_label?: string;
  status?: string;
}

export default function ProgramList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editing, setEditing] = useState<Program | null>(null);
  const router = useRouter();

  const fetchPrograms = async () => {
    const res = await fetch('/api/admin/programs');
    const data = await res.json();
    setPrograms(data);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const startEdit = (p: Program) => {
    setEditing(p);
  };

  const closeForm = () => {
    setEditing(null);
    fetchPrograms();
  };

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm text-primary underline"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Programs</h1>
      <button
        onClick={() => setEditing({} as Program)}
        className="mb-4 bg-primary text-white px-4 py-2"
      >
        Create Program
      </button>
      {editing && <ProgramForm initial={editing} />}
      <div className="grid gap-4">
        {programs.map(p => (
          <Card key={p.id} className="p-4 flex justify-between items-center">
            <div>
              <h2 className="font-medium">{p.title}</h2>
              <p className="text-sm text-muted-foreground">{p.slug}</p>
            </div>
            <Badge variant="secondary" className="ml-auto" onClick={() => startEdit(p)}>
              Edit
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
