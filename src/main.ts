import * as core from '@actions/core'
import * as github from '@actions/github'
import { getCurrentPRDescription } from './github'
import { notify } from './slack'

async function run(): Promise<void> {
  try {
    const webhook: string = core.getInput('slack-webhook')
    const token: string = core.getInput('github-token')

    const issueNumber = github.context.issue.number
    const message = await getCurrentPRDescription(token) || `No description or PR`
    await notify(webhook, message)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
