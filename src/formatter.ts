export function formatSharedMessage(
  owner: string,
  repo: string,
  issueNumber: number,
  linkToPr: string,
  title: string,
  authorName: string | null | undefined
): string {
  const header = `<${linkToPr}|${owner}/${repo}#${issueNumber}>`
  let message = `> New media for \`${title}\``
  if (authorName != null && authorName !== undefined) {
    message = message.concat(` by @${authorName}`)
  }
  return `${header}\n${message}`
}
