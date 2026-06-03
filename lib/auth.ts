import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { createHash } from 'crypto'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
})

/**
 * Derive a stable UUID v5-style identifier from an email address.
 * Same email → same UUID every time, so Supabase rows stay consistent
 * across sessions without needing a user database.
 */
function emailToUUID(email: string): string {
  const hash = createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    '4' + hash.slice(13, 16),       // version 4 marker
    (((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16)) + hash.slice(18, 20), // variant bits
    hash.slice(20, 32),
  ].join('-')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production',
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null
        const email = parsed.data.email
        return {
          id: emailToUUID(email),   // stable UUID safe for Supabase uuid columns
          email,
          name: email.split('@')[0],
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? token.sub
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
