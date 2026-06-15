import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useSettings } from "./download-settings-provider"
import { DownloadSettings } from "../../main/helpers/ytdlp"
import { useQueueState } from "@/hooks/use-queue-state"
import { useDownloadManager } from "@/hooks/use-download-manager"


export type QueueItem = {
    id: string
    url: string
    metadata: any
    status: 'idle' | 'downloading' | 'completed' | 'error'
    progress: number | null
    eta: string | null
    settings: DownloadSettings
}

interface QueueContextType {
    queue: QueueItem[]
    addUrlToQueue: (url: string) => Promise<void>
    deleteUrlFromQueue: (id: string) => void
    updateDownloadSettings: (id: string, newSettings: Partial<DownloadSettings>) => void
    startSingleDownload: (id: string) => Promise<void>
    startBatchDownload: () => Promise<void>
}

const QueueContext = createContext<QueueContextType | null>(null)

export function QueueProvider({ children }: { children: ReactNode }) {
    const { settings } = useSettings();

    const {
        queue,
        addUrlToQueue,
        deleteUrlFromQueue,
        updateDownloadSettings,
        updateItemState,
    } = useQueueState(settings)

    const {
        startSingleDownload,
        startBatchDownload
    } = useDownloadManager(queue, updateItemState)

    return (
        <QueueContext.Provider
            value = {{
                queue,
                addUrlToQueue,
                deleteUrlFromQueue,
                updateDownloadSettings,
                startSingleDownload,
                startBatchDownload,
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