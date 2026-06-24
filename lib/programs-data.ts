export { formatUsd } from '@/lib/formatters'

export type Program = {
  id?: string;
  slug: string
  title: string
  category: string // profession slug
  category_label?: string
  level?: 'Certificate' | 'Diploma' | 'Postgraduate Diploma' | 'CPD Course'
  programme?: string
  mode?: 'Online' | 'Hybrid' | 'In-Person'
  duration?: string
  fees_ksh?: number
  summary?: string
  outcomes?: string[]
  intake?: string
  learning_methods?: string[]
  featured?: boolean
  status?: string
  image?: string
}
