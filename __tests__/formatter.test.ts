import {formatSharedMessage} from '../src/formatter'
import {expect, test} from '@jest/globals'

test('format message with title, author', () => {
  const owner = 'd-fournier'
  const repo = 'pr-media-notifier-action'
  const issue = 43
  const link = 'https://github.com/d-fournier/pr-media-notifier-action'
  const title = `This is a simple message`
  const authorName = `Me`
  const expectedMessage = `<https://github.com/d-fournier/pr-media-notifier-action|d-fournier/pr-media-notifier-action#43>\n> New media for \`This is a simple message\` by @Me`
  const result = formatSharedMessage(
    owner,
    repo,
    issue,
    link,
    title,
    authorName
  )
  expect(result).toEqual(expectedMessage)
})

test('format message with title, without author', () => {
  const owner = 'd-fournier'
  const repo = 'pr-media-notifier-action'
  const issue = 43
  const link = 'https://github.com/d-fournier/pr-media-notifier-action'
  const title = `This is a simple message`
  const authorName = null
  const expectedMessage = `<https://github.com/d-fournier/pr-media-notifier-action|d-fournier/pr-media-notifier-action#43>\n> New media for \`This is a simple message\``
  const result = formatSharedMessage(
    owner,
    repo,
    issue,
    link,
    title,
    authorName
  )
  expect(result).toEqual(expectedMessage)
})
