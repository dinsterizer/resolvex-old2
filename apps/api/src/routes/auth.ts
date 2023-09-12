import { email, length, object, string } from 'valibot'
import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  signIn: router({
    email: router({
      sendOtp: publicProcedure.input(object({ email: string([email()]) })).mutation(async () => {
        // TODO
      }),
      verifyOtp: publicProcedure.input(object({ email: string([email()]), otp: string([length(6)]) }))
        .mutation(async () => {
          // TODO
          return {
            user: {
              id: 'id',
              name: 'name',
              email: 'email',
            },
            jwt: 'jwt',
          }
        }),
    }),
  }),
})
