import {parseMediaLinks} from '../src/parser'
import {expect, test} from '@jest/globals'

test('parse single line, without media, returns empty array', () => {
  const message = `This is a simple message`
  const result = parseMediaLinks(message)
  expect(result).toHaveLength(0)
})

test('parse single line, without media but link, returns empty array', () => {
  const message = `This is a simple message with a link [Image](http://localhost/image.jpg)`
  const result = parseMediaLinks(message)
  expect(result).toHaveLength(0)
})

test('parse single line, with single media, returns array of 1', () => {
  const message = `This is media ![Image](http://localhost/image.jpg)`
  const result = parseMediaLinks(message)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual(`http://localhost/image.jpg`)
})

test('parse single line, with 2 medias, returns array of 2', () => {
  const message = `These are medias ![Image](http://localhost/image.jpg) and ![Image 2](http://localhost/image_2.jpg)`
  const result = parseMediaLinks(message)
  expect(result).toHaveLength(2)
  expect(result[0]).toEqual(`http://localhost/image.jpg`)
  expect(result[1]).toEqual(`http://localhost/image_2.jpg`)
})

test('parse multiple lines, without media, returns array of 0', () => {
  const message = `This is a multi \
  line \
  text
  `
  const result = parseMediaLinks(message)
  expect(result).toHaveLength(0)
})

test('parse multiple lines, with 2 medias, returns array of 2', () => {
  const message = `This is a multiline \
  * ![Image](http://localhost/image.jpg) \
  and \
  this ![Image 2](http://localhost/image_2.jpg)
  `
  const result = parseMediaLinks(message)
  expect(result).toHaveLength(2)
  expect(result[0]).toEqual(`http://localhost/image.jpg`)
  expect(result[1]).toEqual(`http://localhost/image_2.jpg`)
})
