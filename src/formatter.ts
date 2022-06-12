export function formatSharedMessage(
  title: string,
  authorName: string | null | undefined,
  linksToShare: string[]
): string {
  let header = `A new media for \`${title}\``
  if (authorName != null && authorName !== undefined) {
    header = header.concat(` by @${authorName}`)
  }
  header = header.concat(`\n`)

  return header.concat(linksToShare.map(link => `* ${link}`).join(`\n`))
}
