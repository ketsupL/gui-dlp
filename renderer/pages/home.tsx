import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useQueue } from '../providers/queue-provider'
import { VideoCard } from '@/components/video-card'

export default function HomePage() {
  const { queue, startSingleDownload, deleteUrlFromQueue } = useQueue()

  if (queue.length === 0) {
    return (
      <div className='flex items-center justify-center h-full text-gray-500 text-lg'>
        Enter a URL to get started
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>gui-dlp</title>
      </Head>
      <div className='flex flex-col gap-4'>
        {queue.map((item) => (
          <VideoCard 
            key={item.id}
            item={item}
            onDownload={startSingleDownload}
            onDelete={deleteUrlFromQueue}
          />
        ))}
      </div>
    </>
  )
}
