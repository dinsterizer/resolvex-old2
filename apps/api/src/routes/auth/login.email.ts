import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'
import { Buffer } from 'node:buffer'
import { email, object, string, toLowerCase } from 'valibot'
import { generateLoginEmail } from '../../emails/login'
import { Users } from '../../schema'
import { publicProcedure, router } from '../../trpc'
import { generateOtp } from '../../utils'

export const loginEmailRouter = router({
  sendOtp: publicProcedure
    .input(object({ email: string([email(), toLowerCase()]) }))
    .mutation(async ({ ctx, input }) => {
      const { db, ec, env, rateLimit } = ctx

      await rateLimit({
        key: `email-send-otp:${input.email}`,
        duration: 60 * 2,
        limit: 2,
      })

      const { email } = input
      let user = await db.query.Users.findFirst({
        where(t, { eq }) {
          return eq(t.email, email)
        },
        columns: {
          email: true,
          otp: true,
        },
      })

      if (!user) {
        user = await db
          .insert(Users)
          .values({ email, name: email.split('@')[0] })
          .returning({ email: Users.email, otp: Users.otp })
          .get()
      }

      let otp = user.otp
      if (!otp || otp.expiresAt < new Date(Date.now() + 1000 * 30)) {
        otp = {
          code: generateOtp(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        }
        await db
          .update(Users)
          .set({
            otp,
          })
          .where(eq(Users.email, email))
          .get()
      }

      const { htmlContent, textContent, subject } = generateLoginEmail({ otp: otp.code.toUpperCase() })

      ec.waitUntil(
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': env.BREVO_API_KEY,
            accept: 'application/json',
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
        }),
      )
    }),
  verifyOtp: publicProcedure
    .input(object({ email: string([email(), toLowerCase()]), otp: string([toLowerCase()]) }))
    .mutation(async ({ ctx, input }) => {
      const { db, env, ec, rateLimit } = ctx
      const { email } = input

      await rateLimit({
        key: `email-verify-otp:${input.email}`,
        duration: 60,
        limit: 10,
      })

      const user = await db.query.Users.findFirst({
        where(t, { eq }) {
          return eq(t.email, email)
        },
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
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Your OTP is invalid or expired' })
      }

      ec.waitUntil(
        db
          .update(Users)
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
