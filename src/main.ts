import * as core from '@actions/core'
import {notify} from './slack'

async function run(): Promise<void> {
  try {
    const webhook: string = core.getInput('slack-webhook')
    const message = `Hello World from GitHub Action`
    await notify(webhook, message)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
