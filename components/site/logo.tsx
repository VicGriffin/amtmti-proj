import { cn } from '@/lib/utils'

export function Logo({
  className,
  showText = true,
  variant = 'default',
}: {
  className?: string
  showText?: boolean
  variant?: 'default' | 'light'
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="relative flex size-9 shrink-0 items-center justify-center rounded-0 bg-primary text-primary-foreground shadow-sm"
      >
        <img src="/images/logo.jpeg" alt="AMTMTI logo" className="h-full w-full object-contain rounded-none" />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-gold ring-2 ring-card" />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading text-lg font-bold tracking-tight',
              variant === 'light' ? 'text-primary-foreground' : 'text-foreground',
            )}
          >
            AMTMTI
          </span>
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-[0.12em]',
              variant === 'light'
                ? 'text-primary-foreground/70'
                : 'text-muted-foreground',
            )}
          >
            Africa MTM Institute
          </span>
        </span>
      )}
    </span>
  )
}
