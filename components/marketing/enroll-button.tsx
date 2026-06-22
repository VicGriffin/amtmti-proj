'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { EnrollmentModal } from './enrollment-modal'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

import type { Program } from '@/lib/programs-data'

type EnrollmentProgram = {
  slug: string
  title?: string
  level?: Program['level']
}

interface EnrollButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  program?: EnrollmentProgram
}

export function EnrollButton({
  className,
  variant = 'default',
  size = 'default',
  program,
}: EnrollButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [user, setUser] = useState<any | null | undefined>(undefined)
  const [autoOpened, setAutoOpened] = useState(false)

  const inferredProgramSlug = useMemo(() => {
    if (program?.slug) return program.slug
    const match = pathname?.match(/^\/programs\/([^/]+)$/)
    return match?.[1] ?? null
  }, [pathname, program])

  const programRedirect = inferredProgramSlug
    ? `/programs/${inferredProgramSlug}?enroll=true`
    : '/programs'
  const loginUrl = `/login?redirect=${encodeURIComponent(programRedirect)}`

  useEffect(() => {
    const loadUser = async () => {
      if (!isSupabaseConfigured()) {
        setUser(null)
        return
      }

      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }

    loadUser().catch(() => setUser(null))
  }, [])

  useEffect(() => {
    if (!program || autoOpened) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get('enroll') !== 'true') {
      return
    }

    if (user === undefined) {
      return
    }

    if (!user) {
      router.push(loginUrl)
      return
    }

    setModalOpen(true)
    setAutoOpened(true)
  }, [program, user, router, loginUrl, autoOpened])

  const handleEnrollClick = async () => {
    if (user === undefined) {
      if (!isSupabaseConfigured()) {
        router.push(loginUrl)
        return
      }

      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user
      setUser(currentUser ?? null)

      if (!currentUser) {
        router.push(loginUrl)
        return
      }

      setModalOpen(true)
      return
    }

    if (!user) {
      router.push(loginUrl)
      return
    }

    setModalOpen(true)
  }

  return (
    <>
      <Button
        onClick={handleEnrollClick}
        className={className}
        variant={variant}
        size={size}
      >
        Enroll Now
      </Button>
      <EnrollmentModal open={modalOpen} onOpenChange={setModalOpen} initialProgram={program} />
    </>
  )
}
