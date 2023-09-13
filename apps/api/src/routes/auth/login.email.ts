import { Buffer } from 'node:buffer'
import { email, object, string, toLowerCase } from 'valibot'
import { TRPCError } from '@trpc/server'
import { SignJWT } from 'jose'
import { eq } from 'drizzle-orm'
import { publicProcedure, router } from '../../trpc'
import { Users } from '../../schema'
import { generateOtp } from '../../utils'
import { generateLoginEmail } from '../../emails/login'

export const loginEmailRouter = router({
  sendOtp: publicProcedure.input(object({ email: string([email(), toLowerCase()]) })).mutation(async ({ ctx, input }) => {
    const { db, ec, env } = ctx
    const { email } = input
    let user = await db.query.Users.findFirst({
      where(t, { eq }) { return eq(t.email, email) },
      columns: {
        email: true,
        otp: true,
      },
    })

    if (!user) {
      user = await db.insert(Users)
        .values({ email, name: email.split('@')[0] })
        .returning({ email: Users.email, otp: Users.otp })
        .get()
    }

    // TODO - prevent spamming
    if (!user.otp || user.otp.expiresAt < new Date(Date.now() + 1000 * 30)) {
      const otp = generateOtp()
      await db.update(Users)
        .set({
          otp: {
            code: otp,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5),
          },
        })
        .where(eq(Users.email, email))
        .get()

      const { htmlContent, textContent, subject } = generateLoginEmail({ otp })

      ec.waitUntil(fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            id: env.BREVO_SENDER_ID,
          },
          to: [{ email }],
          htmlContent,
          textContent,
          subject,
        }),
      }))
    }
  }),
  verifyOtp: publicProcedure.input(object({ email: string([email(), toLowerCase()]), otp: string([toLowerCase()]) }))
    .mutation(async ({ ctx, input }) => {
      const { db, env, ec } = ctx
      const { email } = input
      const user = await db.query.Users.findFirst({
        where(t, { eq }) { return eq(t.email, email) },
        columns: {
          id: true,
          name: true,
          email: true,
          otp: true,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      if (!user.otp || user.otp.expiresAt < new Date() || user.otp.code !== input.otp) {
        return {
          user: null,
          jwt: null,
        }
      }

      ec.waitUntil(
        db.update(Users)
          .set({
            otp: null,
          })
          .where(eq(Users.id, user.id))
          .get(),
      )

      const jwt = await new SignJWT({ userId: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime((Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000)
        .sign(Buffer.from(env.AUTH_SECRET))

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        jwt,
      }
    }),
})
