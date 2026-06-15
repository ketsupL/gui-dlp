import { useCallback, useEffect } from "react";
import { QueueItem } from "./use-queue-state";


export function useDownloadManager(queue: QueueItem[], updateItemState: (id: string, updates: Partial<QueueItem>) => void) {
    useEffect(() => {
        const cleanup = window.ytdlpApi.onProgress((data) => {
            updateItemState(data.id, { progress: data.percent, eta: data.eta})
        })
        
        return cleanup
    }, [updateItemState])

    const startSingleDownload = useCallback(async (id: string) => {
        const item = queue.find((q) => q.id === id)
        
        if (!item) return

        updateItemState(id, {
            status: 'downloading',
            progress: 0,
            eta: 'Calculating...',
        })

        try {
            const result = await window.ytdlpApi.download(id, item.url, item.settings)

            updateItemState(id, {
                status: result.success ? 'completed' : 'error',
                progress: result.success ? 100 : item.progress
            })
        } catch (error) {
            console.error(`Download failed for ${id}: `, error)
            updateItemState(id, { status: 'error', })
        }

    }, [queue, updateItemState])

    const startBatchDownload = useCallback(async () => {
        const pendingItems = queue.filter((q) => q.status === 'idle' || q.status === 'error')

        for (const item of pendingItems) {
            startSingleDownload(item.id)
        }

    }, [queue, startSingleDownload])

    return { startSingleDownload, startBatchDownload }
}