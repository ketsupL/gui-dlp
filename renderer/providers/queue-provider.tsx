import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSettings } from "./download-settings-provider"
import { DownloadSettings } from "../../main/helpers/ytdlp"


export type QueueItem = {
    id: string
    url: string
    metadata: any
    status: 'idle' | 'downloading' | 'completed' | 'error'
    progress: number | null
    eta: string | null
}

interface QueueContextType {
    queue: QueueItem[]
    addUrlToQueue: (url: string) => Promise<void>
    deleteUrlFromQueue: (id: string) => void
    updateDownloadSettings: (id: string, settings: any) => void
    startSingleDownload: (id: string) => Promise<void>
    startBatchDownload: () => Promise<void>
}

const QueueContext = createContext<QueueContextType | null>(null)

export function QueueProvider({ children }: { children: ReactNode }) {
    const [queue, setQueue] = useState<QueueItem[]>([])
    const { settings } = useSettings();

    useEffect(() => {
        const cleanup = window.ytdlpApi.onProgress((data)=> {
            setQueue((prevQueue) =>
                prevQueue.map((item) =>
                    item.id === data.id
                        ? { ...item, progress: data.percent, eta: data.eta }
                        : item
                )
            )
        })
        console.log(queue)
        return cleanup
    }, [])

    const addUrlToQueue = async (url: string) => {
        const result = await window.ytdlpApi.getMetadata(url)

        if (result.success && result.data) {
            const newItem: QueueItem = {
                id: result.data.id || Date.now().toString(),
                url,
                metadata: result.data,
                status: 'idle',
                progress: null,
                eta: null
            }
            
            console.log(newItem)
            setQueue((prev) => [...prev, newItem])
        } else {
            console.error("Failed to fetch metadata: ", result.error)
        }      
    }

    const deleteUrlFromQueue = async (id: string) => {
        setQueue((prev) =>
            prev.filter((item) => item.id !== id)
        )
    }

    const updateDownloadSettings = (id: string, newSettings: any) => {

    }

    const startSingleDownload = async (id: string) => {
        const item = queue.find((q) => q.id === id)
        
        if (!item) return

        const targetUrl = item.url

        setQueue((prev) =>
            prev.map((q) =>
                q.id === id
                    ? {
                        ...q,
                        status: 'downloading',
                        progress: 0,
                        eta: 'Calculating...'
                    }
                    : q
            )
        )

        try {
            const result = await window.ytdlpApi.download(id, targetUrl, settings)
            console.log("Download Result:", result)
            setQueue((prev) =>
                prev.map((q) =>
                    q.id === id
                        ? {
                            ...q, status: result.success 
                                ? 'completed' 
                                : 'error',
                            progress: result.success 
                                ? 100 
                                : q.progress
                        }
                        : q
                )
            )
        } catch (err) {
            setQueue((prev) =>
                prev.map((q) => q.id === id 
                    ? { ...q, status: 'error' } 
                    : q
                )
            )
        }
    }

    const startBatchDownload = async () => {
        const pendingItems = [...queue].filter((q) => q.status === 'idle' || q.status === 'error')

        for (const item of pendingItems) {
            await startSingleDownload(item.id)
        }
    }

    return (
        <QueueContext.Provider
            value={{ 
                queue, 
                addUrlToQueue,
                deleteUrlFromQueue,
                updateDownloadSettings,
                startSingleDownload, 
                startBatchDownload
            }}
        >
            {children}
        </QueueContext.Provider>
    )
}

export function useQueue() {
    const context = useContext(QueueContext)

    if (!context) {
        throw new Error("useQueue must be used inside a QueueProvider")
    }

    return context
}