import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const template = await prisma.template.update({
      where: { id: params.id },
      data: { 
        status: 'approved',
        isPublic: true
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Approve template error:', error)
    return NextResponse.json({ error: 'Failed to approve template' }, { status: 500 })
  }
}
