import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from "@/components/app-sidebar"

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex min-h-screen'>
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}