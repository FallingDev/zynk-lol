import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username: string
      isPremium: boolean
      role: string
    }
  }

  interface User {
    id: string
    username: string
    isPremium: boolean
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    username?: string
    isPremium?: boolean
    role?: string
  }
}
