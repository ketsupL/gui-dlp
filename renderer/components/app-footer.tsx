import React from "react"
import { useQueue } from "../providers/queue-provider"
import { Button } from "./ui/button"

export function AppFooter () {
    const { queue, startBatchDownload } = useQueue()

    const isQueueEmpty = queue.length === 0

    const isDownloading = queue.some(item => item.status === 'downloading')

    const pendingCount = queue.filter(item => item.status === 'idle' || item.status === 'error').length

    return (
        <div className='flex w-full sticky bottom-0 justify-end h-16 p-4 border-t items-center gap-2'>
            <Button
                onClick={startBatchDownload}
                disabled={isQueueEmpty || isDownloading || pendingCount === 0}
            >
                {isDownloading 
                    ? 'Downloading' 
                    : pendingCount <= 1 
                        ? 'Download' 
                        : `Download ${pendingCount} Videos`}
            </Button>
        </div>
    )
}