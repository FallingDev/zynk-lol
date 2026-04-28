'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import {
  LayoutDashboard,
  User,
  Palette,
  Link2,
  Award,
  Grid3X3,
  Music,
  FileCode,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/appearance', label: 'Appearance', icon: Palette },
  { href: '/dashboard/links', label: 'Links', icon: Link2 },
  { href: '/dashboard/badges', label: 'Badges', icon: Award },
  { href: '/dashboard/widgets', label: 'Widgets', icon: Grid3X3 },
  { href: '/dashboard/tracks', label: 'Tracks', icon: Music },
  { href: '/dashboard/templates', label: 'Templates', icon: FileCode },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.08]">
        <Link href="/dashboard">
          <Logo width={100} height={34} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/[0.06] text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-white/[0.08] space-y-3">
        {session?.user && (
          <>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-semibold">
                {session.user.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-zinc-500">
                  ID: {session.user.id.slice(0, 8)}
                </p>
              </div>
            </div>

            <Link href={`/${session.user.username}`} target="_blank">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                View Profile
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-zinc-400 hover:text-red-400"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign Out
            </Button>
          </>
        )}
      </div>
    </aside>
  )
}
