import * as core from '@actions/core'

export function parseMediaLinks(message: string): string[] {
  core.debug(`Parsing message to identify links: \n${message}`)
  return []
}
