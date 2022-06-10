import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const textInput: string = core.getInput('text-input')
    core.info(`Runnning action with input ${textInput}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
