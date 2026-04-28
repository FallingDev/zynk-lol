import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { GlassCard } from '@/components/ui/GlassCard'
import { Eye, MousePointerClick, Link2, TrendingUp, User, Palette, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getDashboardStats(userId: string) {
  const totalViews = await prisma.profileView.count({
    where: { userId },
  })

  const viewsThisWeek = await prisma.profileView.count({
    where: {
      userId,
      viewedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  })

  const links = await prisma.link.findMany({
    where: { user: { id: userId } },
  })

  const profile = await prisma.profile.findUnique({
    where: { userId },
  })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  const completion = Math.round(
    ((user?.email ? 1 : 0) +
      (profile?.displayName ? 1 : 0) +
      (profile?.bio ? 1 : 0) +
      (profile?.location ? 1 : 0) +
      (links.length > 0 ? 1 : 0)) /
      5 *
      100
  )

  return {
    totalViews,
    viewsThisWeek,
    linkCount: links.length,
    completion,
    user,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const stats = await getDashboardStats(session.user.id)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="text-zinc-400 mt-1">
          Welcome back, {stats.user?.username}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="hover:border-violet-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-violet-500/10">
              <Eye className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-zinc-400">Total Views</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.viewsThisWeek.toLocaleString()}</p>
              <p className="text-sm text-zinc-400">This Week</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-emerald-500/10">
              <Link2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.linkCount}</p>
              <p className="text-sm text-zinc-400">Links</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="hover:border-amber-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[12px] bg-amber-500/10">
              <MousePointerClick className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completion}%</p>
              <p className="text-sm text-zinc-400">Profile Complete</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4">
            Profile Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
              <span className="text-zinc-400">User ID</span>
              <span className="text-white font-mono text-sm">
                {stats.user?.id.slice(0, 16)}...
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
              <span className="text-zinc-400">Username</span>
              <span className="text-white">{stats.user?.username}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
              <span className="text-zinc-400">Email</span>
              <span className="text-white">{stats.user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-400">Joined</span>
              <span className="text-white">
                {stats.user?.createdAt
                  ? new Date(stats.user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/dashboard/profile"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <User className="h-5 w-5 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">Edit Profile</p>
            </a>
            <a
              href="/dashboard/appearance"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <Palette className="h-5 w-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">Customize</p>
            </a>
            <a
              href="/dashboard/links"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <Link2 className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">Manage Links</p>
            </a>
            <a
              href={`/${stats.user?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <ExternalLink className="h-5 w-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">View Profile</p>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
