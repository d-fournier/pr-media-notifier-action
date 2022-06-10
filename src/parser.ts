import * as core from '@actions/core'

export function parseMediaLinks(message: string): string[] {
  core.debug(`Parsing message to identify Video ...`)
  return parseAllMediaLinks(message).concat(parseAllVideoLinks(message))
}

function parseAllMediaLinks(message: string): string[] {
  core.debug(`... to identify standard media links}`)
  const regexp = new RegExp(/!\[.*?\]\((.*?)\)/g)

  const groups = [...message.matchAll(regexp)]
  const links = groups.map(m => m[1])
  core.debug(`Found links: ${links}`)
  return links
}

function parseAllVideoLinks(message: string): string[] {
  core.debug(`... to identify videos`)
  const regexp = new RegExp(
    /http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g
  )
  const groups = [...message.matchAll(regexp)]
  const videos = groups
    .map(m => m[0])
    .filter(
      link =>
        link.endsWith(`.mp4`) || link.endsWith(`.mp4`) || link.endsWith(`.mp4`)
    )
  core.debug(`Found videos: ${videos}`)
  return videos
}
