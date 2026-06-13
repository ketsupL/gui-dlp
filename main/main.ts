import path from 'path'
import { app, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers/create-window'
import { YtDlpSpawner, DownloadSettings, DownloadProgress } from './helpers/ytdlp'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
  
  //Default Path
  ipcMain.handle('ytdlp:getDefaultPath', () => {
      return app.getPath('downloads');
  });

  //Folder Picker
  ipcMain.handle('ytdlp:selectFolder', async () => {
      const result = await dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory'],
          title: 'Select Download Folder'
      });

      if (result.canceled) return null;
      
      return result.filePaths[0]; 
  });

  // Metadata
  ipcMain.handle('ytdlp:getMetadata', async (event, url: string) => {
    try {
      const metadata = await YtDlpSpawner.getMetadata(url)
      return { success: true, data: metadata }
    } catch (error: any) {
      return { success: false, error: error.message}
    }
  })

  //Download
  ipcMain.handle('ytdlp:download', async (event, id: string, url: string, settings: DownloadSettings) => {
    try {
      await YtDlpSpawner.download(url, settings, (progress) => {
        event.sender.send('ytdlp:progress', {id, ...progress} satisfies DownloadProgress)
      })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  })

})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
