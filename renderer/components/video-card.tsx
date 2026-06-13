import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { QueueItem } from "../providers/queue-provider"

export function VideoCard({
    item,
    onDownload,
    onDelete,
}: {
    item: QueueItem 
    onDownload: (id: string) => void
    onDelete: (id: string) => void
}) {
    console.log('item: ', item.metadata?.thumbnail)
    return (
        <Card className='flex flex-row items-center justify-between p-4 gap-4 overflow-hidden'>  
            <div className='flex items-center gap-4 flex-1 min-w-0'>
                {/* Thumbnail */}
                <div className='w-32 h-20 bg-muted rounded-md overflow-hidden shrink-0'>
                    {item.metadata?.thumbnail && (
                        <img
                            src={item.metadata.thumbnail}
                            alt="thumbnail"
                            className='w-full h-full object-cover [image-rendering:smooth]'
                        />
                    )}
                </div>
                {/* Metadata */}
                <div className='flex flex-col gap-2 flex-1 min-w-0'>

                    {/* Title */}
                    <div className='flex items-center text-md text-card-foreground truncate'>
                        <h1 className="truncate font-semibold">{item.metadata?.title || item.url}</h1>
                    </div>

                    {/* Local Settings */}
                    <div>
                        {/**
                         * Fetch possible settings
                         */}
                    </div>

                    {/* Progress */}
                    {item.status === 'downloading' && item.progress !== null && (
                        <div className="flex items-center gap-3 mt-2">
                            <Progress value={item.progress} className="h-2 flex-1" />
                            <span className="text-xs font-mono w-12 text-right">
                                {item.progress}%
                            </span>
                            <span className="text-xs text-muted-foreground w-24">
                                {item.eta}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Action Button */}
            <div className='flex flex-col items-center gap-2'>
                <Button 
                    onClick={() => onDownload(item.id)}
                    disabled={item.status === 'downloading' || item.status === 'completed'}
                    variant={item.status === 'completed' ? 'secondary' : 'default'}
                    className="w-28 shrink-0"
                >
                    {item.status === 'completed' ? 'Done' : 'Download'}
                </Button>
                <Button 
                    onClick={() => onDelete(item.id)}
                    variant='destructive'
                    className="w-28 shrink-0"
                >
                    Delete
                </Button>
            </div>
        </Card>
    )
}