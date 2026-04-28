'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Grid3X3, MessageCircle, Music } from 'lucide-react'
import { toast } from 'sonner'

const availableWidgets = [
  {
    id: 'discord',
    name: 'Discord Server',
    description: 'Display your Discord server with join button',
    icon: MessageCircle,
    enabled: false,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Show your currently playing track',
    icon: Music,
    enabled: false,
    // premium: true, // Temporarily disabled
  },
]

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState(availableWidgets)

  const toggleWidget = (id: string) => {
    // Premium check temporarily disabled
    // const widget = widgets.find((w) => w.id === id)
    // if (widget?.premium) {
    //   toast.info('This widget requires Premium')
    //   return
    // }
    
    setWidgets(widgets.map((w) => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ))
    const targetWidget = widgets.find((w) => w.id === id)
    toast.success(targetWidget?.enabled ? 'Widget disabled' : 'Widget enabled')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Widgets</h1>
        <p className="text-zinc-400 mt-1">Add interactive widgets to your profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {widgets.map((widget) => {
          const Icon = widget.icon
          return (
            <GlassCard
              key={widget.id}
              className={`flex items-start gap-4 ${widget.enabled ? 'border-violet-500/30' : ''}`}
            >
              <div className={`p-3 rounded-[12px] ${widget.enabled ? 'bg-violet-500/10' : 'bg-white/[0.03]'}`}>
                <Icon className={`h-5 w-5 ${widget.enabled ? 'text-violet-400' : 'text-zinc-400'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{widget.name}</h3>
                  {/* Premium badge temporarily disabled */}
                  {/* {widget.premium && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Premium
                    </span>
                  )} */}
                </div>
                <p className="text-sm text-zinc-400 mt-1">{widget.description}</p>
              </div>
              <button
                onClick={() => toggleWidget(widget.id)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  widget.enabled ? 'bg-violet-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    widget.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
