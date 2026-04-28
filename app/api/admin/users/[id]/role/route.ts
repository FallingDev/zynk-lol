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

    // Only admins can change roles
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    const { role } = await request.json()
    
    if (!['user', 'mod', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Prevent self-demotion from admin
    if (params.id === session.user.id && role !== 'admin') {
      return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update role error:', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}
