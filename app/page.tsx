import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Sparkles, Palette, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo width={100} height={34} />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Your Digital{' '}
            <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              Identity
            </span>
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Create a beautiful, customizable profile page. Share your links, showcase your work, 
            and express yourself with Zynk.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Create Your Profile
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="text-center">
              <div className="p-3 rounded-[12px] bg-violet-500/10 w-fit mx-auto mb-4">
                <Palette className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Customizable</h3>
              <p className="text-sm text-zinc-400">
                Full control over colors, fonts, layouts, and effects
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 rounded-[12px] bg-blue-500/10 w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Fast</h3>
              <p className="text-sm text-zinc-400">
                Lightning fast profiles with global CDN
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 rounded-[12px] bg-emerald-500/10 w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Secure</h3>
              <p className="text-sm text-zinc-400">
                Secure authentication with Discord and email
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="p-3 rounded-[12px] bg-amber-500/10 w-fit mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Templates</h3>
              <p className="text-sm text-zinc-400">
                Community-driven template ecosystem
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 px-6 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Beautiful Profiles in Minutes
              </h2>
              <p className="text-zinc-400 mb-6">
                Set up your profile in minutes with our intuitive dashboard. 
                Customize everything from colors to layouts, add your links, 
                and share your unique URL with the world.
              </p>
              <ul className="space-y-3">
                {[
                  'Custom colors and themes',
                  'Multiple layout options',
                  'Link management with analytics',
                  'Discord integration',
                  'Badge system',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-zinc-300">
                    <span className="text-violet-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <GlassCard className="p-8">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 mx-auto" />
                <div className="text-center">
                  <div className="h-6 w-32 bg-white/10 rounded mx-auto mb-2" />
                  <div className="h-4 w-24 bg-white/5 rounded mx-auto" />
                </div>
                <div className="space-y-2 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-violet-500/20 rounded-[12px]" />
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo width={80} height={28} />
          <p className="text-sm text-zinc-500">
            © 2024 Zynk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
