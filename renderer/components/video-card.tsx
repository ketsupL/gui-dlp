import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { QueueItem } from "../providers/queue-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function VideoCard({
    item,
    onDownload,
    onDelete,
    onUpdate,
}: {
    item: QueueItem 
    onDownload: (id: string) => void
    onDelete: (id: string) => void
    onUpdate: (id: string, settings: any) => void
}) {

    const {
        downloadMode,
        videoQuality,
        fileExtension,
    } = item.settings || {} // Added a fallback just in case it's undefined initially

    const handleSettingChange = (key: string, value: string) => {
        const updates: any = { [key]: value }

        if (key === 'downloadMode') {
            if (value === 'audio' && ['mp4', 'mkv', 'webm'].includes(fileExtension)) {
                updates.fileExtension = 'mp3'
            } else if (value !== 'audio' && ['mp3', 'm4a', 'wav'].includes(fileExtension)) {
                updates.fileExtension = 'mp4'
            }
        }

        onUpdate(item.id, updates)
    }

    const videoFormats = item.metadata?.formats?.filter(
        (f: any) => f.vcodec !== "none" && f.height
    ) ?? []

    const videoQualities = [
        ...new Set(videoFormats.map((f: any) => f.height))
    ].sort((a: any, b: any) => b - a)

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
                    <div className="flex flex-row items-center gap-4 mt-2">
                        
                        {/* Download Mode */}
                        <div className="flex-1">
                            <Select
                                value={downloadMode}
                                onValueChange={(value) => handleSettingChange("downloadMode", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video+audio">Video + Audio</SelectItem>
                                    <SelectItem value="video">Video Only</SelectItem>
                                    <SelectItem value="audio">Audio Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Video Quality */}
                        <div className="flex-1">
                            <Select
                                value={videoQuality}
                                onValueChange={(value) => handleSettingChange("videoQuality", value)}
                                disabled={downloadMode === "audio"}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="best">Best</SelectItem>
                                    {videoQualities.map((quality) => (
                                        <SelectItem key={quality} value={`${quality}`}>
                                            {quality}p
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Extension */}
                        <div className="flex-1">
                            <Select
                                value={fileExtension}
                                onValueChange={(value) => handleSettingChange("fileExtension", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    {downloadMode === "audio" ? (
                                        <>
                                            <SelectItem value="mp3">mp3</SelectItem>
                                            <SelectItem value="wav">wav</SelectItem>
                                            <SelectItem value="m4a">m4a</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="mp4">mp4</SelectItem>
                                            <SelectItem value="mkv">mkv</SelectItem>
                                            <SelectItem value="webm">webm</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
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