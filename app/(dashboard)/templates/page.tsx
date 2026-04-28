'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { FileCode, Upload, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function TemplatesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <p className="text-zinc-400 mt-1">Browse and apply profile templates</p>
        </div>
        <Button variant="secondary">
          <Upload className="h-4 w-4 mr-2" />
          Submit Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GlassCard key={i} className="group cursor-pointer" hover>
            <div className="aspect-video rounded-[12px] bg-gradient-to-br from-violet-500/20 to-blue-500/20 mb-4 flex items-center justify-center">
              <FileCode className="h-8 w-8 text-zinc-500 group-hover:text-violet-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-white mb-1">Template {i}</h3>
            <p className="text-sm text-zinc-400 mb-3">A beautiful minimal template</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">by @creator</span>
              <button className="p-1.5 rounded-full hover:bg-white/[0.06] text-zinc-400 hover:text-red-400 transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
