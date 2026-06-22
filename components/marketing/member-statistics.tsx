"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
// Simple number formatter for stats
function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Fetches all approved members and computes simple aggregate stats.
 * Uses the public members API with a high limit to get the full set.
 * In production you might expose a dedicated stats endpoint for efficiency.
 */
export function MemberStatistics() {
  const [stats, setStats] = useState({ total: 0, countries: 0, orgs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/members/public?limit=1000');
        const json = await res.json();
        const members = json.members as Array<{ country?: string; organization?: string }>;
        const countries = new Set<string>();
        const orgs = new Set<string>();
        members.forEach((m) => {
          if (m.country) countries.add(m.country);
          if (m.organization) orgs.add(m.organization);
        });
        setStats({ total: members.length, countries: countries.size, orgs: orgs.size });
      } catch (e) {
        console.error('Failed to load member stats', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Simple count‑up animation using CSS transition of a numeric value.
  // For brevity we just display the final numbers.
  if (loading) {
    return (
      <div className="flex gap-6">
        <Card className="p-6 text-center w-32 animate-pulse">--</Card>
        <Card className="p-6 text-center w-32 animate-pulse">--</Card>
        <Card className="p-6 text-center w-32 animate-pulse">--</Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 my-8 justify-center">
      <Card className="flex-1 p-6 text-center bg-white/60 backdrop-blur-md border border-border">
        <div className="text-3xl font-bold text-primary">{formatNumber(stats.total)}+</div>
        <div className="text-sm text-muted-foreground">Approved Members</div>
      </Card>
      <Card className="flex-1 p-6 text-center bg-white/60 backdrop-blur-md border border-border">
        <div className="text-3xl font-bold text-primary">{formatNumber(stats.countries)}+</div>
        <div className="text-sm text-muted-foreground">Countries Represented</div>
      </Card>
      <Card className="flex-1 p-6 text-center bg-white/60 backdrop-blur-md border border-border">
        <div className="text-3xl font-bold text-primary">{formatNumber(stats.orgs)}+</div>
        <div className="text-sm text-muted-foreground">Organizations Represented</div>
      </Card>
    </div>
  );
}
