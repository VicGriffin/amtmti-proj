import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amtmti.africa'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AMTMTI — Africa Medication Therapy Management Training Institute',
    template: '%s | AMTMTI',
  },
  description:
    'AMTMTI delivers world-class education and skills enhancement training in medication therapy management for pharmacists, clinicians, and the wider African healthcare workforce.',
  keywords: [
    'medication therapy management',
    'MTM training Africa',
    'pharmacy education',
    'clinical pharmacy',
    'CPD pharmacists',
    'AMTMTI',
  ],
  authors: [{ name: 'AMTMTI' }],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: siteUrl,
    siteName: 'AMTMTI',
    title: 'AMTMTI — Africa Medication Therapy Management Training Institute',
    description:
      'A world-class home for medication therapy management training in Africa.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMTMTI — Africa Medication Therapy Management Training Institute',
    description:
      'A world-class home for medication therapy management training in Africa.',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F4C81' },
    { media: '(prefers-color-scheme: dark)', color: '#152033' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
        <a
          href="https://wa.me/254721421719"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#25D366',
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            textDecoration: 'none',
            zIndex: 9999,
          }}
        >
          💬
        </a>
      </body>
    </html>
  )
}
