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
    where: { userId },
    orderBy: { order: 'asc' },
  })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  // Calculate profile completion
  let completion = 0
  if (user?.profile) {
    const fields = [
      user.profile.displayName,
      user.profile.bio,
      user.avatar,
      user.profile.bannerUrl,
    ]
    const filledFields = fields.filter(Boolean).length
    completion = Math.round((filledFields / fields.length) * 100)
  }

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="text-zinc-400 mt-1">
          Welcome back, {stats.user?.username}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-[12px] bg-violet-500/10">
            <Eye className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {stats.totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-zinc-400">Total Views</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-[12px] bg-blue-500/10">
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {stats.viewsThisWeek.toLocaleString()}
            </p>
            <p className="text-sm text-zinc-400">Views This Week</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-[12px] bg-emerald-500/10">
            <Link2 className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.linkCount}</p>
            <p className="text-sm text-zinc-400">Links</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-[12px] bg-amber-500/10">
            <MousePointerClick className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.completion}%</p>
            <p className="text-sm text-zinc-400">Profile Complete</p>
          </div>
        </GlassCard>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
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
            {/* Premium status temporarily disabled */}
            {/* <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
              <span className="text-zinc-400">Premium Status</span>
              <span className={stats.user?.isPremium ? 'text-violet-400' : 'text-zinc-400'}>
                {stats.user?.isPremium ? 'Active' : 'Free'}
              </span>
            </div> */}
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

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/dashboard/profile"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <User className="h-5 w-5 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">Edit Profile</p>
              <p className="text-xs text-zinc-400 mt-1">Update your info</p>
            </a>
            <a
              href="/dashboard/links"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <Link2 className="h-5 w-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">Manage Links</p>
              <p className="text-xs text-zinc-400 mt-1">Add or edit links</p>
            </a>
            <a
              href="/dashboard/appearance"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <Palette className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">Customize</p>
              <p className="text-xs text-zinc-400 mt-1">Change appearance</p>
            </a>
            <a
              href={`/${stats.user?.username}`}
              target="_blank"
              className="p-4 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] transition-all group"
            >
              <ExternalLink className="h-5 w-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">View Public</p>
              <p className="text-xs text-zinc-400 mt-1">See your profile</p>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
