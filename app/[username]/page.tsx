import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { GlassCard } from '@/components/ui/GlassCard'

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

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={backgroundStyle}
    >
      <GlassCard
        variant={profile.cardStyle as any}
        className={`w-full max-w-md mx-auto ${
          profile.tiltEnabled ? 'transform-gpu' : ''
        } ${profile.animationEnabled ? 'animate-fade-in' : ''}`}
        style={{
          borderRadius: profile.borderRadius,
          fontFamily: profile.font,
        }}
      >
        {/* Banner */}
        {profile.bannerUrl && (
          <div
            className="h-32 w-full rounded-t-[16px] bg-cover bg-center -mx-6 -mt-6 mb-4"
            style={{ backgroundImage: `url(${profile.bannerUrl})` }}
          />
        )}

        {/* Avatar Section */}
        <div
          className={`flex flex-col items-center ${
            profile.layout === 'compact' ? 'flex-row gap-4' : ''
          }`}
        >
          <div
            className={`h-24 w-24 border-4 border-[#0a0a0a] overflow-hidden ${
              profile.avatarShape === 'square'
                ? 'rounded-none'
                : profile.avatarShape === 'rounded'
                ? 'rounded-[12px]'
                : 'rounded-full'
            } ${profile.layout === 'floating' ? '-mt-16' : ''}`}
            style={profile.glowEnabled ? { boxShadow: `0 0 30px ${profile.accentColor}40` } : {}}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full flex items-center justify-center text-2xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${profile.accentColor} 0%, #3b82f6 100%)`,
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className={`text-center ${profile.layout === 'compact' ? 'text-left' : ''}`}>
            <h1 className="text-2xl font-bold text-white">{displayName}</h1>
            <p className="text-zinc-400">@{user.username}</p>
          </div>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {user.badges.map((userBadge) => (
              <span
                key={userBadge.badge.id}
                className="px-2 py-1 text-xs rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]"
                title={userBadge.badge.description}
              >
                {userBadge.badge.name}
              </span>
            ))}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-center text-zinc-300 mt-4 whitespace-pre-wrap">{profile.bio}</p>
        )}

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${profile.accentColor}20`,
                  color: profile.accentColor,
                  border: `1px solid ${profile.accentColor}40`,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Location & Occupation */}
        {(profile.location || profile.occupation) && (
          <div className="flex justify-center gap-4 mt-4 text-sm text-zinc-400">
            {profile.location && <span>📍 {profile.location}</span>}
            {profile.occupation && <span>💼 {profile.occupation}</span>}
          </div>
        )}

        {/* Links */}
        {user.links.length > 0 && (
          <div className="space-y-3 mt-6">
            {user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 px-4 rounded-[12px] text-center font-medium transition-all duration-200 hover:scale-[1.02] ${
                  link.style === 'filled'
                    ? 'text-white'
                    : link.style === 'outline'
                    ? 'border-2 bg-transparent'
                    : 'bg-white/[0.03] backdrop-blur border border-white/[0.08]'
                }`}
                style={
                  link.style === 'filled'
                    ? { backgroundColor: profile.accentColor }
                    : link.style === 'outline'
                    ? { borderColor: profile.accentColor, color: profile.accentColor }
                    : {}
                }
              >
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Powered by Zynk
          </a>
        </div>
      </GlassCard>
    </div>
  )
}
