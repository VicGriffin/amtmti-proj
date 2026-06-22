import { z } from 'zod'

export const newsletterSubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type NewsletterSubscribe = z.infer<typeof newsletterSubscribeSchema>
