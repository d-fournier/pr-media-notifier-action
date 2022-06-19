import * as stream from 'stream'
import {promisify} from 'util'
import axios from 'axios'
import fs from 'fs'

const finished = promisify(stream.finished)

export async function downloadFile(
  fileUrl: string,
  outputLocationPath: string
): Promise<void> {
  const writer = fs.createWriteStream(outputLocationPath)
  const response = await axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream'
  })

  response.data.pipe(writer)
  return finished(writer)
}

export function deleteFile(localPath: string): void {
  fs.unlinkSync(localPath)
}

export function createDir(name: string): void {
  fs.mkdirSync(name)
}
