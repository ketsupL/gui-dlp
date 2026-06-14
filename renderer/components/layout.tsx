import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from './app-header'
import { AppFooter } from './app-footer'
import { DownloadSettingsProvider } from '../providers/download-settings-provider'
import { QueueProvider } from '../providers/queue-provider'

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DownloadSettingsProvider>
            <QueueProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <div className="flex flex-col flex-1 min-w-0 h-screen">
                        <AppHeader />
                            <main className="flex-1 p-4 overflow-auto">
                                {children}
                            </main>
                        <AppFooter />
                    </div>
                </SidebarProvider>
            </QueueProvider>
        </DownloadSettingsProvider>
    )
}