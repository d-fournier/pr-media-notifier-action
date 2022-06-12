import * as core from '@actions/core'
import * as github from '@actions/github'
import {parseAllLinks} from './parser'

const HEADER = `Shared media on Slack`

type SharedContent = {
  ids: number[]
  links: string[]
}

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

export async function getAlreadySharedLinks(
  token: string,
  issueNumber: number
): Promise<SharedContent> {
  const api = github.getOctokit(token)

  const paramListComments = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber
  }

  const {data: existingComments} = await api.rest.issues.listComments(
    paramListComments
  )

  const filteredComments = existingComments
    .map(function (comment) {
      const body = comment.body
      let result
      if (body != null && body.search(HEADER)) {
        const links = parseAllLinks(body)
        result = {
          id: comment.id,
          links
        }
      } else {
        result = null
      }
      return result
    })
    .filter(comment => comment != null)

  const ids = filteredComments.map(comment => comment!.id)
  const links = filteredComments.flatMap(comment => comment!.links)
  return {
    ids,
    links
  }
}

export async function saveSharedFiles(
  token: string,
  issueNumber: number,
  mediaUrls: string[],
  commentsToDelete: number[]
): Promise<void> {
  const api = github.getOctokit(token)

  for (const commentId of commentsToDelete) {
    deleteComment(token, issueNumber, commentId)
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

async function deleteComment(
  token: string,
  issueNumber: number,
  commentId: number
): Promise<void> {
  const api = github.getOctokit(token)

  const paramDeleteComment = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    comment_id: commentId
  }
  await api.rest.issues.deleteComment(paramDeleteComment)
}
