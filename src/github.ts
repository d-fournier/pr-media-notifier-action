import * as core from '@actions/core'
import * as github from '@actions/github'
import {parseAllLinks} from './parser'

const HEADER = `Shared media on Slack`

type PRDate = {
  title: string
  description: string | null
  authorName: string | null | undefined
}

type SharedContent = {
  ids: number[]
  links: string[]
}

export function getPRNumber(): number {
  return github.context.issue.number
}

export async function getPRData(
  token: string,
  issueNumber: number
): Promise<PRDate | null> {
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
  core.debug(`Found description """${description}"""`)
  return {
    title: pullRequest.title,
    description,
    authorName: pullRequest.user?.name
  }
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
  core.debug(`Fetching comments for repo/PR (${paramListComments})`)

  const {data: existingComments} = await api.rest.issues.listComments(
    paramListComments
  )

  core.debug(`${existingComments.length} comment(s) found`)

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

  core.debug(`Comments with ids (${ids}) with links (${links})`)
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

  core.debug(`Delete comments with ids (${commentsToDelete})`)
  for (const commentId of commentsToDelete) {
    deleteComment(token, issueNumber, commentId)
  }
  core.debug(`All deleted (${commentsToDelete})`)

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
  core.debug(`Create new tracking comment (${paramCreateComment})`)
  await api.rest.issues.createComment(paramCreateComment)
  core.debug(`Comment created`)
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
