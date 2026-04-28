import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        accentColor: body.accentColor,
        font: body.font,
        borderRadius: body.borderRadius,
        layout: body.layout,
        avatarShape: body.avatarShape,
        cardStyle: body.cardStyle,
        backgroundType: body.backgroundType,
        backgroundValue: body.backgroundValue,
        glowEnabled: body.glowEnabled,
        tiltEnabled: body.tiltEnabled,
        animationEnabled: body.animationEnabled,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Appearance PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update appearance' },
      { status: 500 }
    )
  }
}
