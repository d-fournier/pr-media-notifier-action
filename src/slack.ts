import {WebClient, LogLevel} from '@slack/web-api'
import fs from 'fs'

export async function sendFile(
  token: string,
  channelId: string,
  message: string,
  fileName: string
): Promise<void> {
  const client = new WebClient(token, {
    logLevel: LogLevel.DEBUG
  })

  await client.files.upload({
    unfurl_links: false,
    channels: channelId,
    initial_comment: message,
    file: fs.createReadStream(fileName)
  })
}
