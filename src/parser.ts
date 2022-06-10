import * as core from '@actions/core'

export function parseMediaLinks(message: string): string[] {
  core.debug(`Parsing message to identify links: \n${message}`)
  const regexp = new RegExp(/!\[.*?\]\((.*?)\)/g)

  const groups = [...message.matchAll(regexp)]
  return groups.map(m => m[1])
}
