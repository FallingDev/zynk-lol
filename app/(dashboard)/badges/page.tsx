'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { Award, Lock } from 'lucide-react'

const badges = [
  {
    id: 'verified',
    name: 'Verified',
    description: 'Email verified user',
    icon: '✓',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    earned: true,
  },
  {
    id: 'early',
    name: 'Early Adopter',
    description: 'Joined during beta',
    icon: '🚀',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    earned: true,
  },
  // Premium badge temporarily disabled
  // {
  //   id: 'premium',
  //   name: 'Premium',
  //   description: 'Premium member',
  //   icon: '💎',
  //   color: 'text-amber-400',
  //   bgColor: 'bg-amber-500/10',
  //   earned: false,
  // },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Created a popular template',
    icon: '🎨',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    earned: false,
  },
]

export default function BadgesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Badges</h1>
        <p className="text-zinc-400 mt-1">Earn badges by using Zynk</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <GlassCard
            key={badge.id}
            className={`flex items-center gap-4 ${!badge.earned ? 'opacity-60' : ''}`}
            hover={badge.earned}
          >
            <div className={`p-3 rounded-[12px] ${badge.bgColor}`}>
              <span className="text-2xl">{badge.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${badge.earned ? badge.color : 'text-zinc-400'}`}>
                {badge.name}
              </h3>
              <p className="text-sm text-zinc-400">{badge.description}</p>
            </div>
            {!badge.earned && (
              <Lock className="h-4 w-4 text-zinc-500" />
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
