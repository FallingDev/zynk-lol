import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from 'next-auth/providers/discord'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { z } from 'zod'
import { NextAuthOptions } from 'next-auth'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
          username: profile.username,
          discordId: profile.id,
          discordUsername: profile.username,
          isPremium: false,
          role: 'user',
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsed = credentialsSchema.parse(credentials)
          
          const user = await prisma.user.findUnique({
            where: { email: parsed.email },
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await verifyPassword(parsed.password, user.password)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            image: user.avatar,
            username: user.username,
            isPremium: user.isPremium,
            role: user.role,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create profile for Discord users if it doesn't exist
      if (account?.provider === 'discord' && user.id) {
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: user.id }
        })
        
        if (!existingProfile) {
          await prisma.profile.create({
            data: {
              userId: user.id,
              displayName: user.name || user.username,
            }
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.isPremium = user.isPremium
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.isPremium = token.isPremium as boolean
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
