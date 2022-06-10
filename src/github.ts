import * as github from '@actions/github'

export async function getCurrentPRDescription(
  token: string,
): Promise<string | null> {
  const issueNumber = github.context.issue.number
  if (issueNumber != null) {
    const { data: pullRequest } = await github.getOctokit(token).rest.pulls.get({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: issueNumber
    })

    return pullRequest.body
  } else {
    return null
  }
}
