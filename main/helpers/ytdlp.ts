import { spawn } from 'child_process'

export type DownloadSettings = {
    downloadMode: string
    videoQuality: string
    fileExtension: string
    outputFolder: string
}

export type YtDlpProgress = {
    percent: number
    speed: string | null
    eta: string | null
    size: string | null
    raw?: string
}

export type DownloadProgress = YtDlpProgress & {
    id: string
}

function parseYtDlpProgress(line: string): YtDlpProgress | null {
    const match = line.match(
        /\[download\]\s+(\d+(?:\.\d+)?)%.*?of\s+([\d.]+\w+).*?at\s+([\w./]+).*?ETA\s+([\w:]+)/
    )

    if (!match) return null

    const [, percent, size, speed, eta] = match

    return {
        percent: Number(percent),
        size,
        speed,
        eta,
        raw: line
    }
}

export class YtDlpSpawner {
    private static ytdlpPath = 'yt-dlp'

    static getMetadata(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const child = spawn(this.ytdlpPath, ['--dump-json', url], { windowsHide: true })

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

        // 1. Fixed the string checks to match your AppSidebar values
        if (settings.downloadMode === 'video') {
            const quality = settings.videoQuality === 'best' ? '' : `[height<=${settings.videoQuality}]`
            args.push('-f', 
                `bestvideo${quality}[ext=${settings.fileExtension}]`
            )
        } else if (settings.downloadMode === 'audio') {
            args.push('-f',
                'bestaudio',
                '--extract-audio',
                '--audio-format', settings.fileExtension
            )
        } else {
            const quality = settings.videoQuality === 'best' ? '' : `[height<=${settings.videoQuality}]`

            if (settings.fileExtension === 'mp4') {
                args.push('-f', 
                    `bestvideo${quality}[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best`
                )
            } else {
                args.push('-f', 
                    `bestvideo${quality}+bestaudio/best`
                )
            }
            
            args.push('--merge-output-format', settings.fileExtension)
        }

        args.push('-o', '%(title)s.%(ext)s')
        
        return args
    }

    static download(
        url:string,
        settings: DownloadSettings, 
        onProgress: (progress: YtDlpProgress) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const args = this.buildArgs(url, settings)
            const child = spawn(this.ytdlpPath, args, { windowsHide: true, cwd: settings.outputFolder })
            
            let errorOutput = ''
            let buffer = ''

            child.stdout.setEncoding('utf8')
            child.stderr.setEncoding('utf8')

            child.stdout.on('data', (chunk: string) => {
                buffer += chunk

                const lines = buffer.split('\n')
                buffer = lines.pop() ?? ''

                for (const line of lines) {
                    const progress = parseYtDlpProgress(line)

                    if (progress) {
                        onProgress(progress)
                    }
                }
            })

            child.stderr.on('data', (data: string) => { errorOutput += data })
            
            child.on('error', reject)
            
            child.on('close', (code) => {
                if (code === 0) {
                    onProgress({
                        percent: 100,
                        speed: null,
                        eta: '00:00',
                        size: null,
                    })
                    return resolve() 
                }
                reject(new Error(errorOutput || 'yt-dlp download failed'))
            })
        })
    }
}