"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'

export function AppHeader() {
    const [url, setUrl] = useState("")

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter' && url.trim() !== "") {
            e.preventDefault()
            console.log("User pressed enter! Ready to fetch:", url)
            //fetch url
        }
    }
    
    return (
        <div className='flex w-full sticky top-0 h-20 p-4 border-b items-center gap-2'>
            <h2 className='text-md font-medium'>URL: </h2>
            <Input
                type='url'
                placeholder='Paste video URL and press enter...'
                className='max-w-2xl bg-muted/50'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleEnter}
            />
        </div>
    )
}