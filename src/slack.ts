import axios from 'axios'

export async function notify(hookUrl: string, text: string): Promise<string> {
  return axios.post(hookUrl, {
    text
  })
}
