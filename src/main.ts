import * as core from '@actions/core'
import {
  getPRNumber,
  getPRData,
  getAlreadySharedLinks,
  saveSharedFiles
} from './github'
import {formatSharedMessage} from './formatter'
import {createDir, deleteFile, downloadFile} from './files'
import {parseMediaLinks} from './parser'
import {sendFile} from './slack'

async function run(): Promise<void> {
  try {
    const slackToken: string = core.getInput('slack-token')
    const slackChannel: string = core.getInput('slack-channel')
    const token: string = core.getInput('github-token')

    const issueNumber = getPRNumber()
    if (issueNumber != null) {
      const pr = await getPRData(token, issueNumber)
      const links = parseMediaLinks(pr?.description || ``)
      if (pr != null && links.length > 0) {
        const sharedContent = await getAlreadySharedLinks(token, issueNumber)

        const linksToShare = links.filter(
          link => !sharedContent.links.includes(link)
        )
        if (linksToShare.length > 0) {
          const formattedMessage = formatSharedMessage(
            pr.owner,
            pr.repo,
            pr.issue,
            pr.title,
            pr.authorName
          )
          createDir('prSharing')

          for (const link of linksToShare) {
            const filename = link.substring(link.lastIndexOf('/') + 1)
            const localPath = `./prSharing/${filename}`
            await downloadFile(link, localPath)
            await sendFile(
              slackToken,
              slackChannel,
              formattedMessage,
              localPath
            )
            deleteFile(localPath)
          }
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
