import templateHtml from './workspace-invitation.html'
import templateText from './workspace-invitation.txt'

export function generateWorkspaceInvitationEmail(options: { inviterName: string; workspaceName: string }) {
  const htmlContent = templateHtml
    .replaceAll('{{INVITER}}', options.inviterName)
    .replaceAll('{{WORKSPACE_NAME}}', options.workspaceName)

  const textContent = templateText
    .replaceAll('{{INVITER}}', options.inviterName)
    .replaceAll('{{WORKSPACE_NAME}}', options.workspaceName)

  const subject = 'You have been invited to a workspace'

  return {
    htmlContent,
    textContent,
    subject,
  }
}
