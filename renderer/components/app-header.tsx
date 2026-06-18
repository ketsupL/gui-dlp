"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { useQueue } from '../providers/queue-provider'
import { ExternalLink } from 'lucide-react'

export function AppHeader() {
    const [url, setUrl] = useState("")
    const { addUrlToQueue } = useQueue()
    const [isFetching, setIsFetching] = useState(false)

    const handleFetch = async () => {
        if (!url.trim()) return
        setIsFetching(true)
        await addUrlToQueue(url)
        setUrl('')
        setIsFetching(false)
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            handleFetch
        }
    }
    
    return (
        <div className='flex w-full sticky top-0 h-20 p-4 border-b items-center gap-2'>
            <h2 className='text-md font-medium'>URL: </h2>
            <Input
                type='url'
                placeholder={isFetching ? 'Fetching data...' : 'Paste video URL and press enter...'}
                className='max-w-2xl bg-muted/50'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleEnter}
                disabled={isFetching}
            />
            <Button onClick={handleFetch}>
                {isFetching ? (
                        <>
                            <Spinner/>
                            Fetching...
                        </>
                    ) : (
                        <>
                            <ExternalLink /> Fetch
                        </>
                    )
                }
            </Button>
            
        </div>
    )
}