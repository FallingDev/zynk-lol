import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'

interface ProfilePageProps {
  params: { username: string }
}

async function getProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      profile: true,
      links: {
        orderBy: { order: 'asc' },
      },
      badges: {
        include: { badge: true },
      },
      views: true,
    },
  })

  if (!user || !user.profile) {
    return null
  }

  // Track view
  try {
    await prisma.profileView.create({
      data: { userId: user.id },
    })
  } catch {
    // Silently fail on view tracking
  }

  return user
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const user = await getProfile(params.username)
  
  if (!user) {
    return { title: 'Profile Not Found - Zynk' }
  }

  return {
    title: user.profile?.pageTitle || `${user.username} - Zynk`,
    description: user.profile?.bio || `Check out ${user.username}'s profile on Zynk`,
    openGraph: {
      title: user.profile?.pageTitle || `${user.username} - Zynk`,
      description: user.profile?.bio || `Check out ${user.username}'s profile on Zynk`,
      images: user.profile?.ogImage ? [user.profile.ogImage] : [],
    },
  }
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const user = await getProfile(params.username)

  if (!user) {
    notFound()
  }

  const profile = user.profile!
  const displayName = profile.displayName || user.username
  const initials = displayName.slice(0, 2).toUpperCase()

  // Background style
  const backgroundStyle =
    profile.backgroundType === 'gradient'
      ? { background: profile.backgroundValue }
      : profile.backgroundType === 'image'
      ? { backgroundImage: `url(${profile.backgroundValue})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: profile.backgroundValue || '#0a0a0a' }

  const links = user.links || []
  const badges = user.badges || []

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      <div
        className={`w-full max-w-md mx-auto relative z-10 ${
          profile.animationEnabled ? 'animate-fade-in' : ''
        }`}
        style={{ fontFamily: profile.font }}
      >
        {/* Main Card */}
        <div 
          className="bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden"
          style={{ 
            borderRadius: '24px',
            boxShadow: profile.glowEnabled ? `0 0 60px ${profile.accentColor}40` : 'none'
          }}
        >
          {/* Banner */}
          {profile.bannerUrl ? (
            <div
              className="h-40 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.bannerUrl})` }}
            />
          ) : (
            <div 
              className="h-32 w-full"
              style={{ background: `linear-gradient(135deg, ${profile.accentColor}40, transparent)` }}
            />
          )}

          {/* Avatar Section */}
          <div className="px-6 pb-6">
            <div className="-mt-12 mb-4 flex justify-center">
              <div 
                className="w-24 h-24 border-4 border-black/50 overflow-hidden bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white"
                style={{ 
                  boxShadow: `0 0 30px ${profile.accentColor}60`,
                  borderRadius: profile.avatarShape === 'square' ? '12px' : profile.avatarShape === 'rounded' ? '16px' : '50%'
                }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </div>

            {/* Name & Bio */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">{displayName}</h1>
              <p className="text-white/60 text-sm">@{user.username}</p>
              {profile.bio && (
                <p className="text-white/80 mt-3 text-sm">{profile.bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 mb-6 text-center">
              <div>
                <p className="text-xl font-bold text-white">{user.views?.length || 0}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Views</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{links.length}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">Links</p>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              {links.map((link: any, index: number) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    borderColor: `${profile.accentColor}30`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white group-hover:text-white/90">{link.title}</span>
                    <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/60" />
                  </div>
                </a>
              ))}
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {badges.map((userBadge: any) => (
                  <span 
                    key={userBadge.id}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                  >
                    {userBadge.badge.icon} {userBadge.badge.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a 
            href="/" 
            className="text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            Made with Zynk
          </a>
        </div>
      </div>
    </div>
  )
}
