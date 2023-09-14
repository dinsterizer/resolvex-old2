import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'
import { Buffer } from 'node:buffer'
import { object, string } from 'valibot'
import { Users } from '../../schema'
import { publicProcedure, router } from '../../trpc'

export const loginGoogleRouter = router({
  verifyAuthCode: publicProcedure.input(object({ code: string() })).mutation(async ({ ctx, input }) => {
    const exchangedRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: ctx.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: ctx.env.GOOGLE_OAUTH_CLIENT_SECRET,
        code: input.code,
        grant_type: 'authorization_code',
        redirect_uri: ctx.env.WEB_URL,
      }),
    })

    if (exchangedRes.status !== 200) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid Google auth code' })
    }

    const { access_token } = (await exchangedRes.json()) as { access_token: string }
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (profileRes.status !== 200) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Failed to fetch profile info from Google' })
    }

    const { email, name, verified_email } = (await profileRes.json()) as {
      email: string
      name: string
      verified_email: boolean
    }

    if (!verified_email) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Your Google account is not verified' })
    }

    let user = await ctx.db.query.Users.findFirst({
      where(t, { eq }) {
        return eq(t.email, email)
      },
      columns: {
        id: true,
      },
    })

    if (!user) {
      user = await ctx.db
        .insert(Users)
        .values({ email, name: email.split('@')[0] })
        .returning({ id: Users.id })
        .get()
    }

    await ctx.db.update(Users).set({ name }).where(eq(Users.id, user.id)).get()

    const jwt = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime((Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000)
      .sign(Buffer.from(ctx.env.AUTH_SECRET))

    return {
      user: {
        id: user.id,
        email,
        name,
      },
      jwt,
    }
  }),
})
