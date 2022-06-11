import * as core from '@actions/core'
import {getCurrentPRDescription} from './github'
import {parseMediaLinks} from './parser'
import {notify} from './slack'

async function run(): Promise<void> {
  try {
    const webhook: string = core.getInput('slack-webhook')
    const token: string = core.getInput('github-token')

    const message = (await getCurrentPRDescription(token)) || ``
    const links = parseMediaLinks(message)
    if (links.length > 0) {
      const formattedMessage = links.map(link => `* ${link}`).join(`\n`)
      await notify(webhook, formattedMessage)
    } else {
      core.info(`No link found`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
