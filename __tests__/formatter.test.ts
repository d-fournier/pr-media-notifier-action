import {formatSharedMessage} from '../src/formatter'
import {expect, test} from '@jest/globals'

test('format message with title, author and 1 link', () => {
  const title = `This is a simple message`
  const authorName = `Me`
  const links = ['http://example.com/path/video.mp4']
  const expectedMessage = `A new media for \`This is a simple message\` by @Me\n* http://example.com/path/video.mp4`
  const result = formatSharedMessage(title, authorName, links)
  expect(result).toEqual(expectedMessage)
})

test('format message with title, without author and 1 link', () => {
  const title = `This is a simple message`
  const authorName = null
  const links = ['http://example.com/path/video.mp4']
  const expectedMessage = `A new media for \`This is a simple message\`\n* http://example.com/path/video.mp4`
  const result = formatSharedMessage(title, authorName, links)
  expect(result).toEqual(expectedMessage)
})

test('format message with title, author and 2 links', () => {
  const title = `This is a simple message`
  const authorName = `Me`
  const links = [
    'http://example.com/path/video.mp4',
    'http://example.com/path/video.mp4'
  ]
  const expectedMessage = `A new media for \`This is a simple message\` by @Me\n* http://example.com/path/video.mp4\n* http://example.com/path/video.mp4`
  const result = formatSharedMessage(title, authorName, links)
  expect(result).toEqual(expectedMessage)
})
