export { formatUsd } from '@/lib/formatters'

export type Program = {
  slug: string
  title: string
  category: string // profession slug
  categoryLabel: string
  level: 'Certificate' | 'Diploma' | 'Postgraduate Diploma' | 'CPD Course'
  programme?: string
  mode: 'Online' | 'Hybrid' | 'In-Person'
  duration: string
  feesKsh: number
  summary: string
  outcomes: string[]
  intake?: string
  learningMethods?: string[]
  featured?: boolean
  image?: string
}
