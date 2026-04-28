import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || (user.role !== 'admin' && user.role !== 'mod')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [
      totalUsers,
      totalLinks,
      totalViews,
      pendingTemplates,
      premiumUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.link.count(),
      prisma.profileView.count(),
      prisma.template.count({ where: { status: 'pending' } }),
      prisma.user.count({ where: { isPremium: true } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalLinks,
      totalViews,
      pendingTemplates,
      premiumUsers,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
