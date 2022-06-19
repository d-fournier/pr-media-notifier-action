export function formatSharedMessage(
  owner: string,
  repo: string,
  issueNumber: number,
  title: string,
  authorName: string | null | undefined
): string {
  let message = `${owner}/${repo}#${issueNumber} New media for \`${title}\``
  if (authorName != null && authorName !== undefined) {
    message = message.concat(` by @${authorName}`)
  }
  return message
}
