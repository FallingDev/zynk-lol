export interface User {
  id: string
  email: string
  username: string
  emailVerified: Date | null
  discordId: string | null
  discordUsername: string | null
  avatar: string | null
  isPremium: boolean
  premiumSince: Date | null
  createdAt: Date
}

export interface Profile {
  id: string
  userId: string
  displayName: string | null
  bio: string | null
  location: string | null
  occupation: string | null
  tags: string[]
  accentColor: string
  font: string
  borderRadius: string
  effects: Record<string, unknown>
  layout: 'floating' | 'stacked' | 'compact'
  avatarShape: 'square' | 'rounded' | 'circle'
  bannerUrl: string | null
  pageTitle: string | null
  ogImage: string | null
  commentsEnabled: boolean
  backgroundType: 'solid' | 'image' | 'gradient'
  backgroundValue: string
  cardStyle: 'glass' | 'outlined' | 'soft'
  glowEnabled: boolean
  tiltEnabled: boolean
  animationEnabled: boolean
}

export interface Link {
  id: string
  title: string
  url: string
  icon: string | null
  order: number
  style: 'filled' | 'outline' | 'glass'
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: Date
}

export interface Template {
  id: string
  name: string
  description: string
  previewImage: string
  tags: string[]
  creatorId: string
  status: 'pending' | 'approved' | 'rejected'
  usageCount: number
  isPremium: boolean
}

export interface Widget {
  id: string
  type: 'discord' | 'spotify' | 'custom'
  config: Record<string, unknown>
  enabled: boolean
  order: number
}

export interface Track {
  id: string
  title: string
  embedUrl: string | null
  style: 'compact' | 'banner' | 'vinyl'
  order: number
}

export interface ProfileView {
  id: string
  viewedAt: Date
}

export interface DashboardStats {
  totalViews: number
  viewsThisWeek: number
  topLinks: { title: string; clicks: number }[]
  profileCompletion: number
}
