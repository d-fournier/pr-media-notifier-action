import * as core from '@actions/core'

export function parseMediaLinks(message: string): string[] {
  return parseAllMediaLinks(message).concat(parseAllVideoLinks(message))
}

function parseAllMediaLinks(message: string): string[] {
  core.debug(`Parsing message to identify links: \n${message}`)
  const regexp = new RegExp(/!\[.*?\]\((.*?)\)/g)

  const groups = [...message.matchAll(regexp)]
  return groups.map(m => m[1])
}

function parseAllVideoLinks(message: string): string[] {
  core.debug(`Parsing message to identify links: \n${message}`)
  const regexp = new RegExp(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/g)
  const groups = [...message.matchAll(regexp)]
  console.log(groups)
  return groups.map(m => m[0])
  .filter(link => link.endsWith(`.mp4`) || link.endsWith(`.mp4`) || link.endsWith(`.mp4`))
}

