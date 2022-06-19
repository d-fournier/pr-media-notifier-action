import {formatSharedMessage} from '../src/formatter'
import {expect, test} from '@jest/globals'

test('format message with title, author', () => {
  const owner = 'd-fournier'
  const repo = 'pr-media-notifier-action'
  const issue = 43
  const title = `This is a simple message`
  const authorName = `Me`
  const expectedMessage = `d-fournier/pr-media-notifier-action#43 New media for \`This is a simple message\` by @Me`
  const result = formatSharedMessage(owner, repo, issue, title, authorName)
  expect(result).toEqual(expectedMessage)
})

test('format message with title, without author', () => {
  const owner = 'd-fournier'
  const repo = 'pr-media-notifier-action'
  const issue = 43
  const title = `This is a simple message`
  const authorName = null
  const expectedMessage = `d-fournier/pr-media-notifier-action#43 New media for \`This is a simple message\``
  const result = formatSharedMessage(owner, repo, issue, title, authorName)
  expect(result).toEqual(expectedMessage)
})
