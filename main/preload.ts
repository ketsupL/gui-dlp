import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { DownloadSettings, DownloadProgress } from './helpers/ytdlp'

const handler = {
  send<T>(channel: string, value?: T) {
    ipcRenderer.send(channel, value)
  },
  on<T>(channel: string, callback: (...args: T[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: T[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('ipc', handler)

contextBridge.exposeInMainWorld('ytdlpApi', {
  getMetadata: (url: string) => ipcRenderer.invoke('ytdlp:getMetadata', url),

  download: (url: string, settings: DownloadSettings) => ipcRenderer.invoke('ytdlp:download', url, settings),

  onProgress: (callback: (progress: DownloadProgress) => void) => {
    const listener = (_event: IpcRendererEvent, progress: DownloadProgress) => {
      callback(progress)
    }
    ipcRenderer.on('ytdlp:progress', listener)

    return () => {
      ipcRenderer.removeListener('ytdlp:progress', listener)
    }
  }
})

export type IpcHandler = typeof handler
