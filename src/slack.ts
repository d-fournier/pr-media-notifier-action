import axios from 'axios'
import {WebClient, LogLevel} from '@slack/web-api'
import fs from 'fs'

export async function notify(hookUrl: string, text: string): Promise<string> {
  return axios.post(hookUrl, {
    text
  })
}

export async function sendMessage(
  token: string,
  channelId: string,
  message: string
): Promise<void> {
  const client = new WebClient(token, {
    logLevel: LogLevel.DEBUG
  })

  await client.chat.postMessage({
    channel: channelId,
    text: message
  })
}

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
    channels: channelId,
    initial_comment: message,
    file: fs.createReadStream(fileName)
  })
}
