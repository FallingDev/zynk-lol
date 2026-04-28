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

    const templates = await prisma.template.findMany({
      include: {
        creator: {
          select: {
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Admin templates error:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}
