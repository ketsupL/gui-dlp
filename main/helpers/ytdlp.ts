import { spawn } from 'child_process'

export type DownloadSettings = {
    downloadMode: string;
    videoQuality: string;
    fileExtension: string;
}

export class YtDlpSpawner {
    private static ytdlpPath = 'yt-dlp'

    static getMetadata(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const child = spawn(this.ytdlpPath, ['--dump-json', url])

            let output = ''
            let errorOutput = ''

            child.stdout.on('data', (data) => { output += data.toString() })

            child.stderr.on('data', (data) => { errorOutput += data.toString() })

            child.on('error', reject)

            child.on('close', (code) => {
                if (code !== 0) {
                    return reject(
                        new Error(errorOutput || 'Failed to fetch metadata')
                    )
                }

                try {
                    resolve(JSON.parse(output))
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    private static buildArgs(url: string, settings: DownloadSettings) {
        const args = [url, '--newline']

        if (settings.downloadMode === 'video only') {
            const quality = settings.videoQuality === 'best' ? '' : `[height<=${settings.videoQuality}]`
            args.push('-f', 
                `bestvideo${quality}[ext=${settings.fileExtension}]`
            )
        } else if (settings.downloadMode === 'audio only') {
            args.push('-f',
                'bestaudio',
                '--extract-audio',
                '--audio-format', settings.fileExtension
            )
        } else {
            const quality = settings.videoQuality === 'best' ? '' : `[height<=${settings.videoQuality}]`
            args.push('-f', 
                `bestvideo${quality}+bestaudio/best`,
                '--merge-output-format', settings.fileExtension
            )
        }

        args.push('-o', '%(title)s.%(ext)s')
        
        return args
    }

    static download(url:string, 
        settings: DownloadSettings, 
        onProgress: (data: string) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const args = this.buildArgs(url, settings)
            const child = spawn(this.ytdlpPath, args);

            child.stdout.on('data', (data) => { onProgress(data.toString()) })
            
            child.stderr.on('data', (data) => { console.error(`yt-dlp error: ${data}`) })
            
            child.on('close', (code) => {
                if (code === 0) resolve()
                else reject(new Error('yt-dlp download failed'))
            })
        })
    }
}