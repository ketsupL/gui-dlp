import { IpcHandler } from '../main/preload'
import { DownloadSettings, DownloadProgress } from '../main/helpers/ytdlp'

declare global {
  interface Window {
    ipc: IpcHandler
    ytdlpApi: {
      getMetadata: (url: string) => Promise<{ success: boolean, data?: any, error?: string}>
      download: (url: string, settings: DownloadSettings) => Promise<{success: boolean, error?: string}>
      onProgress: (callback: (progress: DownloadProgress) => void) => () => void
    }
  }
}
