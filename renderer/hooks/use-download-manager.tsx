import { useCallback, useEffect } from "react";
import { QueueItem } from "./use-queue-state";


export function useDownloadManager(queue: QueueItem[], updateItemState: (id: string, updates: Partial<QueueItem>) => void) {
    useEffect(() => {
        const cleanup = window.ytdlpApi.onProgress((data) => {
            updateItemState(data.id, { progress: data.percent, eta: data.eta})
        })
        
        return cleanup
    }, [updateItemState])

    const startSingleDownload = useCallback(async (item: QueueItem) => {
        updateItemState(item.id, {
            status: 'downloading',
            progress: 0,
            eta: 'Calculating...',
        })

        try {
            const result = await window.ytdlpApi.download(item.id, item.url, item.settings)

            updateItemState(item.id, {
                status: result.success ? 'completed' : 'error',
                progress: result.success ? 100 : item.progress
            })

        } catch (error) {
            console.error(`Download failed for ${item.id}: `, error)
            updateItemState(item.id, { status: 'error', })
        }

    }, [updateItemState])

    const startBatchDownload = useCallback(async () => {
        const pendingItems = queue.filter((q) => q.status === 'idle' || q.status === 'error')

        for (const item of pendingItems) {
            startSingleDownload(item)
        }

    }, [queue, startSingleDownload])

    return { startSingleDownload, startBatchDownload }
}