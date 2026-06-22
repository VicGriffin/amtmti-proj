'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Clock,
  MapPin,
  Menu,
  Phone,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SITE, MAIN_NAV, PROGRAMME_CATEGORIES } from '@/lib/site-data'
import { ThemeToggle } from './theme-toggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { EnrollButton } from '@/components/marketing/enroll-button'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'


function TopBar() {
  return (
    <div className="hidden bg-primary text-primary-foreground lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-xs">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-gold" />
            {SITE.hours}
          </span>

          <a
            href={`tel:${SITE.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-1.5 transition hover:text-gold"
          >
            <Phone className="size-3.5 text-gold" />
            {SITE.phone}
          </a>

          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-gold" />
            {SITE.address.line1}, {SITE.address.line2}, {SITE.address.country}
          </span>
        </div>
      </div>
    </div>
  )
}


function ProgramsMega({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid w-160 grid-cols-1 gap-6 p-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Under Programmes
        </p>

        <div className="grid gap-1">
          {PROGRAMME_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/programs?programme=${encodeURIComponent(category)}`}
              onClick={onNavigate}
              className="group rounded-lg px-3 py-2 transition hover:bg-accent"
            >
              <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-primary p-5 text-primary-foreground">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
          Browse
        </p>

        <p className="text-sm text-primary-foreground/90">
          Explore all AMTMTI programmes.
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="mt-5 w-full"
          render={
            <Link href="/programs" onClick={onNavigate}>
              Browse all programs
            </Link>
          }
        />
      </div>
    </div>
  )
}


export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [user, setUser] = useState<any | null>(null)


  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      return
    }

    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    }).catch(() => {
      setUser(null)
    })

    const { data: authListener } =
      supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null)
      })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])


  const firstName =
    user?.user_metadata?.full_name?.split?.(' ')[0] ||
    user?.email?.split?.('@')[0] ||
    null


  const handleLogout = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      router.push('/programs')
      return
    }

    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/programs')
  }


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)


  const currentProgramSlug = pathname?.match(
    /^\/programs\/([^/]+)$/
  )?.[1]


  const publicNav = MAIN_NAV.filter(
    item => item.label !== 'E-Learning'
  )


  return (
    <header className="sticky top-0 z-50">

      <TopBar />

      <div
        className={cn(
          'border-b transition-all duration-300',
          scrolled
            ? 'border-border bg-card/85 shadow-sm backdrop-blur-md'
            : 'border-transparent bg-card'
        )}
      >

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">


          <Link href="/" aria-label="AMTMTI home">
            <img
              src="/images/logo.jpeg"
              alt="AMTMTI logo"
              className="h-10 w-70 object-contain rounded-none"
            />
          </Link>


          <nav className="hidden items-center gap-1 xl:flex">

            {publicNav.map((item) =>
              item.label === 'Programs' ? (

                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >

                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium',
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-foreground/80 hover:text-primary'
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </Link>


                  {megaOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">

                      <div className="overflow-hidden rounded-2xl border bg-popover shadow-xl">

                        <ProgramsMega
                          onNavigate={() => setMegaOpen(false)}
                        />

                      </div>

                    </div>
                  )}

                </div>

              ) : (

                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium',
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>

              )
            )}

          </nav>



          <div className="flex items-center gap-2">     

            <ThemeToggle className="hidden sm:inline-flex" />


            {user ? (

              <div className="hidden items-center gap-2 md:flex">

                <span className="rounded-full border px-3 py-1 text-sm">
                  Hi, {firstName}
                </span>

                <button
                  onClick={handleLogout}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm'
                  })}
                >
                  Logout
                </button>

              </div>

            ) : (

              <div className="hidden items-center gap-2 md:flex">

                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm'
                  })}
                >
                  Login
                </Link>


                <Link
                  href="/register"
                  className={buttonVariants({
                    variant: 'secondary',
                    size: 'sm'
                  })}
                >
                  Register
                </Link>

              </div>

            )}



            <EnrollButton
              className="hidden bg-gold text-gold-foreground hover:bg-gold/90 md:inline-flex"
              program={
                currentProgramSlug
                  ? { slug: currentProgramSlug }
                  : undefined
              }
            />



            <Sheet
              open={mobileOpen}
              onOpenChange={setMobileOpen}
            >

              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="xl:hidden"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>


              <SheetContent
                side="right"
                className="w-75 overflow-y-auto p-0"
              >

                <SheetHeader className="border-b p-5">

                  <SheetTitle>
                    <img
                      src="/images/logo.jpeg"
                      alt="AMTMTI logo"
                      className="h-12 w-12 object-contain"
                    />
                  </SheetTitle>

                </SheetHeader>


                <nav className="flex flex-col gap-1 p-4">

                  {publicNav.map((item) => (

                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm"
                    >
                      {item.label}
                    </Link>

                  ))}

                </nav>


                <div className="flex flex-col gap-2 border-t p-4">

                  <EnrollButton
                    className="w-full bg-gold"
                    program={
                      currentProgramSlug
                        ? { slug: currentProgramSlug }
                        : undefined
                    }
                  />


                  {user ? (

                    <button
                      onClick={handleLogout}
                      className={buttonVariants({
                        variant: 'outline'
                      })}
                    >
                      Sign out
                    </button>

                  ) : (

                    <>
                      <Link
                        href="/login"
                        className={buttonVariants({
                          variant:'ghost'
                        })}
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        className={buttonVariants({
                          variant:'secondary'
                        })}
                      >
                        Register
                      </Link>
                    </>

                  )}

                  <ThemeToggle />

                </div>


              </SheetContent>

            </Sheet>

          </div>

        </div>

      </div>

    </header>
  )
}