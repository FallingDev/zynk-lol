import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const profileSchema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(50).optional(),
  occupation: z.string().max(50).optional(),
  tags: z.array(z.string().max(20)).max(10).optional(),
})

export const appearanceSchema = z.object({
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  font: z.enum(['Inter', 'Roboto', 'Poppins', 'Montserrat']),
  borderRadius: z.enum(['8px', '12px', '16px', '20px', '24px']),
  layout: z.enum(['floating', 'stacked', 'compact']),
  avatarShape: z.enum(['square', 'rounded', 'circle']),
  cardStyle: z.enum(['glass', 'outlined', 'soft']),
  backgroundType: z.enum(['solid', 'image', 'gradient']),
  backgroundValue: z.string(),
  glowEnabled: z.boolean(),
  tiltEnabled: z.boolean(),
  animationEnabled: z.boolean(),
})

export const linkSchema = z.object({
  title: z.string().min(1).max(50),
  url: z.string().url('Invalid URL'),
  icon: z.string().optional(),
  style: z.enum(['filled', 'outline', 'glass']),
})

export const templateSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(10).max(500),
  tags: z.array(z.string()).min(1).max(5),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AppearanceInput = z.infer<typeof appearanceSchema>
export type LinkInput = z.infer<typeof linkSchema>
export type TemplateInput = z.infer<typeof templateSchema>
