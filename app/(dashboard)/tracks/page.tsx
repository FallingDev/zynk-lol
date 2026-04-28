'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { Music, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function TracksPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tracks</h1>
          <p className="text-zinc-400 mt-1">Showcase your favorite music or embeds</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Track
        </Button>
      </div>

      <GlassCard className="text-center py-16">
        <Music className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No tracks yet</h3>
        <p className="text-zinc-400 max-w-md mx-auto">
          Add tracks, playlists, or embeds from Spotify, SoundCloud, or other platforms to showcase on your profile.
        </p>
      </GlassCard>
    </div>
  )
}
