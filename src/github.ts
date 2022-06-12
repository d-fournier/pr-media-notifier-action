import * as core from '@actions/core'
import * as github from '@actions/github'

const HEADER = `Shared media on Slack`

export function getPRNumber(): number {
  return github.context.issue.number
}

export async function getCurrentPRDescription(
  token: string,
  issueNumber: number
): Promise<string | null> {
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
}

export async function saveSharedFiles(
  token: string,
  issueNumber: number,
  mediaUrls: string[]
): Promise<void> {
  const api = github.getOctokit(token)
  const formattedLinks = mediaUrls.join(`\n`)
  const message = `
  <details>
  <summary>${HEADER}</summary>
  ${formattedLinks}
  </details>
`
  const param = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    body: message
  }
  await api.rest.issues.createComment(param)
}
