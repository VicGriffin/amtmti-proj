import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  inquiryType: z.enum(['General', 'Programs', 'Research', 'Membership', 'Support', 'Other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be less than 5000 characters'),
  phone: z.string().optional(),
})

export type ContactForm = z.infer<typeof contactFormSchema>
