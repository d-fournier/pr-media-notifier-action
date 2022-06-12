import * as core from '@actions/core'
import {
  getPRNumber,
  getCurrentPRDescription,
  getAlreadySharedLinks,
  saveSharedFiles
} from './github'
import {parseMediaLinks} from './parser'
import {notify} from './slack'

async function run(): Promise<void> {
  try {
    const webhook: string = core.getInput('slack-webhook')
    const token: string = core.getInput('github-token')

    const issueNumber = getPRNumber()
    if (issueNumber != null) {
      const message = (await getCurrentPRDescription(token, issueNumber)) || ``
      const links = parseMediaLinks(message)
      if (links.length > 0) {
        const sharedContent = await getAlreadySharedLinks(token, issueNumber)

        const linksToShare = links.filter(
          link => !sharedContent.links.includes(link)
        )
        if (linksToShare.length > 0) {
          const formattedMessage = linksToShare
            .map(link => `* ${link}`)
            .join(`\n`)
          await notify(webhook, formattedMessage)
          core.info(`Links shared on Slack (${linksToShare})`)
        } else {
          core.info(`All links already shared`)
        }

        saveSharedFiles(token, issueNumber, links, sharedContent.ids)
      } else {
        core.info(`No link found`)
      }
    } else {
      core.setFailed('No PR linked to this action')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
