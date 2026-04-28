'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { User, MapPin, Briefcase, Tag, Save } from 'lucide-react'

interface ProfileData {
  displayName: string
  bio: string
  location: string
  occupation: string
  tags: string[]
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    displayName: '',
    bio: '',
    location: '',
    occupation: '',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile({
          displayName: data.displayName || '',
          bio: data.bio || '',
          location: data.location || '',
          occupation: data.occupation || '',
          tags: data.tags || [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
      } else {
        toast.error('Failed to update profile')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !profile.tags.includes(tagInput.trim())) {
      setProfile({ ...profile, tags: [...profile.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setProfile({ ...profile, tags: profile.tags.filter((t) => t !== tag) })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-zinc-400 mt-1">Customize your public profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Display Name
              </label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Your display name"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors min-h-[100px] resize-none"
                placeholder="Tell us about yourself"
                maxLength={500}
              />
              <p className="text-xs text-zinc-500 mt-1 text-right">
                {profile.bio.length}/500
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="City, Country"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                <Briefcase className="h-4 w-4 inline mr-2" />
                Occupation
              </label>
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="What do you do?"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                <Tag className="h-4 w-4 inline mr-2" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Add a tag"
                  maxLength={20}
                />
                <Button type="button" variant="secondary" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </GlassCard>

        {/* Live Preview */}
        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4">Live Preview</h2>
          <div className="p-6 rounded-[16px] bg-[#0a0a0a] border border-white/[0.08]">
            <div className="text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white mb-4">
                {(profile.displayName || session?.user?.name || '?').slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-white">
                {profile.displayName || session?.user?.name || 'Your Name'}
              </h3>
              <p className="text-zinc-400">@{session?.user?.username || 'username'}</p>
              
              {profile.bio && (
                <p className="text-zinc-300 mt-3 text-sm">{profile.bio}</p>
              )}
              
              {(profile.location || profile.occupation) && (
                <div className="flex justify-center gap-4 mt-3 text-sm text-zinc-400">
                  {profile.location && <span>📍 {profile.location}</span>}
                  {profile.occupation && <span>💼 {profile.occupation}</span>}
                </div>
              )}
              
              {profile.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
