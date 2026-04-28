'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { Palette, Layout, Type, Sparkles, Save } from 'lucide-react'

interface AppearanceData {
  accentColor: string
  font: string
  borderRadius: string
  layout: 'floating' | 'stacked' | 'compact'
  avatarShape: 'square' | 'rounded' | 'circle'
  cardStyle: 'glass' | 'outlined' | 'soft'
  backgroundType: 'solid' | 'image' | 'gradient'
  backgroundValue: string
  glowEnabled: boolean
  tiltEnabled: boolean
  animationEnabled: boolean
}

const fonts = ['Inter', 'Roboto', 'Poppins', 'Montserrat']
const layouts = [
  { value: 'floating', label: 'Floating Avatar', icon: '⬆️' },
  { value: 'stacked', label: 'Stacked', icon: '☰' },
  { value: 'compact', label: 'Compact Row', icon: '▸' },
]
const avatarShapes = [
  { value: 'square', label: 'Square', icon: '□' },
  { value: 'rounded', label: 'Rounded', icon: '▣' },
  { value: 'circle', label: 'Circle', icon: '○' },
]
const cardStyles = [
  { value: 'glass', label: 'Glassmorphism', icon: '🔮' },
  { value: 'outlined', label: 'Outlined', icon: '⬜' },
  { value: 'soft', label: 'Soft', icon: '⬛' },
]

export default function AppearancePage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [appearance, setAppearance] = useState<AppearanceData>({
    accentColor: '#8b5cf6',
    font: 'Inter',
    borderRadius: '16px',
    layout: 'floating',
    avatarShape: 'circle',
    cardStyle: 'glass',
    backgroundType: 'solid',
    backgroundValue: '#0a0a0a',
    glowEnabled: false,
    tiltEnabled: false,
    animationEnabled: true,
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppearance()
    }
  }, [session])

  const fetchAppearance = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setAppearance({
          accentColor: data.accentColor || '#8b5cf6',
          font: data.font || 'Inter',
          borderRadius: data.borderRadius || '16px',
          layout: data.layout || 'floating',
          avatarShape: data.avatarShape || 'circle',
          cardStyle: data.cardStyle || 'glass',
          backgroundType: data.backgroundType || 'solid',
          backgroundValue: data.backgroundValue || '#0a0a0a',
          glowEnabled: data.glowEnabled || false,
          tiltEnabled: data.tiltEnabled || false,
          animationEnabled: data.animationEnabled !== false,
        })
      }
    } catch (error) {
      console.error('Failed to fetch appearance:', error)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appearance),
      })

      if (response.ok) {
        toast.success('Appearance updated successfully')
      } else {
        toast.error('Failed to update appearance')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Appearance</h1>
        <p className="text-zinc-400 mt-1">Customize your profile&apos;s look and feel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customization Panel */}
        <div className="space-y-4">
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-violet-400" />
              Colors
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={appearance.accentColor}
                    onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                    className="h-10 w-10 rounded-lg bg-transparent cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={appearance.accentColor}
                    onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white text-sm font-mono"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layout className="h-5 w-5 text-blue-400" />
              Layout
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {layouts.map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => setAppearance({ ...appearance, layout: layout.value as any })}
                    className={`p-3 rounded-[12px] text-center transition-all ${
                      appearance.layout === layout.value
                        ? 'bg-violet-500/20 border border-violet-500/50'
                        : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="text-2xl mb-1">{layout.icon}</div>
                    <div className="text-xs text-zinc-300">{layout.label}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Avatar Shape
                </label>
                <div className="flex gap-2">
                  {avatarShapes.map((shape) => (
                    <button
                      key={shape.value}
                      onClick={() => setAppearance({ ...appearance, avatarShape: shape.value as any })}
                      className={`flex-1 py-2 px-3 rounded-[12px] text-center transition-all ${
                        appearance.avatarShape === shape.value
                          ? 'bg-violet-500/20 border border-violet-500/50 text-white'
                          : 'bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="mr-1">{shape.icon}</span>
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Card Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {cardStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setAppearance({ ...appearance, cardStyle: style.value as any })}
                      className={`p-3 rounded-[12px] text-center transition-all ${
                        appearance.cardStyle === style.value
                          ? 'bg-violet-500/20 border border-violet-500/50'
                          : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="text-lg mb-1">{style.icon}</div>
                      <div className="text-xs text-zinc-300">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Type className="h-5 w-5 text-emerald-400" />
              Typography
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Font Family
                </label>
                <select
                  value={appearance.font}
                  onChange={(e) => setAppearance({ ...appearance, font: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[12px] text-white"
                >
                  {fonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Border Radius
                </label>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="4"
                  value={parseInt(appearance.borderRadius)}
                  onChange={(e) => setAppearance({ ...appearance, borderRadius: `${e.target.value}px` })}
                  className="w-full"
                />
                <div className="text-center text-sm text-zinc-400 mt-1">
                  {appearance.borderRadius}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Effects
            </h2>
            <div className="space-y-3">
              {[
                { key: 'glowEnabled', label: 'Glow Effect', desc: 'Add glow to icons and elements' },
                { key: 'tiltEnabled', label: 'Tilt Card', desc: 'Enable 3D tilt effect on hover' },
                { key: 'animationEnabled', label: 'Animations', desc: 'Smooth fade and transition effects' },
              ].map((effect) => (
                <label
                  key={effect.key}
                  className="flex items-center justify-between p-3 rounded-[12px] bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">{effect.label}</p>
                    <p className="text-xs text-zinc-400">{effect.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={appearance[effect.key as keyof AppearanceData] as boolean}
                    onChange={(e) =>
                      setAppearance({ ...appearance, [effect.key]: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-white/[0.15] bg-white/[0.03] text-violet-500 focus:ring-violet-500"
                  />
                </label>
              ))}
            </div>
          </GlassCard>

          <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Live Preview */}
        <div>
          <GlassCard className="sticky top-8">
            <h2 className="text-lg font-semibold text-white mb-4">Live Preview</h2>
            <div
              className="p-8 rounded-[16px] flex items-center justify-center min-h-[400px]"
              style={{ backgroundColor: appearance.backgroundValue }}
            >
              <div
                className={`w-full max-w-xs p-6 ${
                  appearance.cardStyle === 'glass'
                    ? 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]'
                    : appearance.cardStyle === 'outlined'
                    ? 'bg-transparent border-2 border-white/[0.08]'
                    : 'bg-[#111]'
                } ${appearance.animationEnabled ? 'animate-fade-in' : ''}`}
                style={{
                  borderRadius: appearance.borderRadius,
                  fontFamily: appearance.font,
                  boxShadow: appearance.glowEnabled ? `0 0 30px ${appearance.accentColor}20` : undefined,
                }}
              >
                <div
                  className={`flex ${appearance.layout === 'compact' ? 'flex-row gap-3 items-center' : 'flex-col items-center'}`}
                >
                  <div
                    className={`h-16 w-16 border-4 border-[#0a0a0a] overflow-hidden ${
                      appearance.avatarShape === 'square'
                        ? 'rounded-none'
                        : appearance.avatarShape === 'rounded'
                        ? 'rounded-[8px]'
                        : 'rounded-full'
                    } ${appearance.layout === 'floating' ? '-mt-10' : ''}`}
                    style={appearance.glowEnabled ? { boxShadow: `0 0 20px ${appearance.accentColor}40` } : {}}
                  >
                    <div
                      className="h-full w-full flex items-center justify-center text-xl font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${appearance.accentColor} 0%, #3b82f6 100%)`,
                      }}
                    >
                      {session?.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  </div>
                  <div className={appearance.layout === 'compact' ? 'text-left' : 'text-center mt-3'}>
                    <p className="font-bold text-white">{session?.user?.name || 'Your Name'}</p>
                    <p className="text-sm text-zinc-400">@{session?.user?.username || 'username'}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div
                    className="w-full py-2 px-4 rounded-[12px] text-center text-sm text-white"
                    style={{ backgroundColor: appearance.accentColor }}
                  >
                    Example Link
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
