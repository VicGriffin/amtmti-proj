"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgramForm from '@/components/admin/program-form';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus } from 'lucide-react';
import type { Program } from '@/lib/programs-data';

export default function ProgramList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editing, setEditing] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/programs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      setDeleting(id);
      const res = await fetch(`/api/admin/programs?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setPrograms(programs.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program');
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (p: Program) => {
    setEditing(p);
  };

  const closeForm = () => {
    setEditing(null);
    fetchPrograms();
  };

  if (loading) {
    return <div className="p-6">Loading programs...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Programs Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage training programs</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          ← Back
        </Button>
      </div>

      <div className="mb-6">
        <Button 
          onClick={() => setEditing({} as Program)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </div>

      {editing && (
        <div className="mb-8 bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            {editing.id ? 'Edit Program' : 'Create New Program'}
          </h2>
          <ProgramForm initial={editing} onClose={closeForm} />
        </div>
      )}

      <div className="space-y-3">
        {programs.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No programs found. Create your first program.
          </Card>
        ) : (
          programs.map(p => (
            <Card key={p.id} className="p-4 flex justify-between items-center hover:bg-accent/50 transition">
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{p.title}</h2>
                <p className="text-sm text-muted-foreground">{p.slug}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{p.level}</Badge>
                  <Badge variant="outline">{p.mode}</Badge>
                  {p.featured && <Badge>Featured</Badge>}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => startEdit(p)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(p.id!)}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 hover:text-red-700"
                  disabled={deleting === p.id}
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting === p.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
