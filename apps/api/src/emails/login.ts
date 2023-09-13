import templateHtml from './login-template.html'
import templateText from './login-template.txt'

export function generateLoginEmail({ otp }: { otp: string }) {
  const htmlContent = templateHtml.replaceAll('{{OTP}}', otp)
  const textContent = templateText.replaceAll('{{OTP}}', otp)
  const subject = 'OTP to complete the login process'

  return {
    htmlContent,
    textContent,
    subject,
  }
}
