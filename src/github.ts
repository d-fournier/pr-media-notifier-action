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

  const paramListComments = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber
  }

  const {data: existingComments} = await api.rest.issues.listComments(
    paramListComments
  )
  for (const comment of existingComments) {
    const body = comment.body
    if (body != null && body.search(HEADER)) {
      const paramDeleteComment = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        comment_id: comment.id
      }
      api.rest.issues.deleteComment(paramDeleteComment)
    }
  }

  const formattedLinks = mediaUrls.join(`\n`)
  const message = `
  <details>
  <summary>${HEADER}</summary>
  ${formattedLinks}
  </details>
`
  const paramCreateComment = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    body: message
  }
  await api.rest.issues.createComment(paramCreateComment)
}
