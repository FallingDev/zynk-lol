'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { Plus, Link2, Trash2, GripVertical, ExternalLink } from 'lucide-react'

interface Link {
  id: string
  title: string
  url: string
  style: 'filled' | 'outline' | 'glass'
  order: number
}

export default function LinksPage() {
  const { data: session } = useSession()
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState<{ title: string; url: string; style: 'filled' | 'outline' | 'glass' }>({ title: '', url: '', style: 'filled' })

  useEffect(() => {
    if (session?.user?.id) {
      fetchLinks()
    }
  }, [session])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      }
    } catch (error) {
      console.error('Failed to fetch links:', error)
    }
  }

  const handleAdd = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      })

      if (response.ok) {
        toast.success('Link added successfully')
        setNewLink({ title: '', url: '', style: 'filled' })
        setIsAdding(false)
        fetchLinks()
      } else {
        toast.error('Failed to add link')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Link deleted')
        fetchLinks()
      } else {
        toast.error('Failed to delete link')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Links</h1>
          <p className="text-zinc-400 mt-1">Manage your profile links</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {isAdding && (
        <GlassCard className="animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Link</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="e.g., Twitter, GitHub, Portfolio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                URL
              </label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Style
              </label>
              <div className="flex gap-2">
                {(['filled', 'outline', 'glass'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setNewLink({ ...newLink, style })}
                    className={`px-4 py-2 rounded-[12px] text-sm capitalize transition-colors ${
                      newLink.style === style
                        ? 'bg-violet-500 text-white'
                        : 'bg-white/[0.03] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} isLoading={isLoading}>
                Add Link
              </Button>
              <Button variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="space-y-3">
        {links.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Link2 className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-400">No links yet</p>
            <p className="text-sm text-zinc-500 mt-1">Add your first link above</p>
          </GlassCard>
        ) : (
          links.map((link, index) => (
            <GlassCard
              key={link.id}
              className="flex items-center gap-4"
              hover={false}
            >
              <div className="text-zinc-500">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{link.title}</h3>
                <p className="text-sm text-zinc-400 truncate">{link.url}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full capitalize ${
                  link.style === 'filled'
                    ? 'bg-violet-500/20 text-violet-300'
                    : link.style === 'outline'
                    ? 'border border-white/20 text-zinc-300'
                    : 'bg-white/[0.06] text-zinc-300'
                }`}
              >
                {link.style}
              </span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => handleDelete(link.id)}
                className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
