import * as core from '@actions/core'
import * as github from '@actions/github'

export async function getCurrentPRDescription(
  token: string
): Promise<string | null> {
  const issueNumber = github.context.issue.number
  if (issueNumber != null) {
    const githubParams = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: issueNumber
    }
    core.debug(`Fetching data for repo/PR (${githubParams})`)
    const {data: pullRequest} = await github
      .getOctokit(token)
      .rest.pulls.get(githubParams)
    const description = pullRequest.body
    core.debug(`Found description ${description}`)
    return description
  } else {
    core.warning(`Action is runnning but cannot get the issue number`)
    return null
  }
}
