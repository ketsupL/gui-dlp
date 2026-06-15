import { useCallback, useState } from "react";
import { DownloadSettings } from "../../main/helpers/ytdlp";

export type QueueItem = {
    id: string
    url: string
    metadata: any
    status: 'idle' | 'downloading' | 'completed' | 'error'
    progress: number | null
    eta: string | null
    settings: DownloadSettings
}

export function useQueueState(defaultSettings: DownloadSettings) {
    const [queue, setQueue] = useState<QueueItem[]>([])

    const addUrlToQueue = async (url: string) => {
        const result = await window.ytdlpApi.getMetadata(url)

        if (result.success && result.data) {
            const newItem: QueueItem = {
                id: result.data.id || Date.now().toString(),
                url,
                metadata: result.data,
                status: 'idle',
                progress: null,
                eta: null,
                settings: { ...defaultSettings }
            }

            setQueue((prev) => [...prev, newItem])
        } else {
            console.error('Failed to fetch metadata: ', result.error)
        }
    }

    const deleteUrlFromQueue = useCallback((id: string) => {
        setQueue((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const updateDownloadSettings = useCallback((id: string, newSettings: Partial<DownloadSettings>) => {
        setQueue((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {...item, settings: { ...item.settings, ...newSettings }}
                    : item
            )
        )
    }, [])

    const updateItemState = useCallback((id: string, updates: Partial<QueueItem>) => {
        setQueue((prev) => 
            prev.map((item) => item.id === id ? { ...item, ...updates } : item)
        )
    }, [])

    return {
        queue,
        addUrlToQueue,
        deleteUrlFromQueue,
        updateDownloadSettings,
        updateItemState,
    }

}