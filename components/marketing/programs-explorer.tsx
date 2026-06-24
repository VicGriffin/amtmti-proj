'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Program } from '@/lib/programs-data'
import { PROGRAMME_CATEGORIES } from '@/lib/site-data'
import { ProgramCard } from './program-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function ProgramsExplorer({
  programs,
  initialProgramme = '',
}: {
  programs: Program[]
  initialProgramme?: string
}) {
  const [query, setQuery] = useState('')
  const [programme, setProgramme] = useState(initialProgramme)

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      if (programme && (p.programme || '') !== programme) return false
      if (query) {
        const q = query.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          (p.summary?.toLowerCase().includes(q) ?? false) ||
          (p.category_label?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [programs, query, programme])

  const hasFilters = programme || query

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-none border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Filter programs
            </h2>
          </div>

          <FilterGroup label="Under Programmes">
            <FilterChip active={programme === ''} onClick={() => setProgramme('')}>
              All
            </FilterChip>
            {PROGRAMME_CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                active={programme === c}
                onClick={() => setProgramme(c)}
              >
                {c}
              </FilterChip>
            ))}
          </FilterGroup>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full text-muted-foreground"
              onClick={() => {
                setProgramme('')
                setQuery('')
              }}
            >
              <X className="size-3.5" />
              Clear all filters
            </Button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs by title or keyword..."
            aria-label="Search programs"
            className="pl-9"
          />
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'program' : 'programs'}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-none border border-dashed border-border bg-card py-16 text-center">
            <Badge variant="secondary">No matches</Badge>
            <p className="max-w-sm text-sm text-muted-foreground">
              No programs match your current filters. Try clearing some filters or
              adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground/70 hover:border-primary/40 hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}
