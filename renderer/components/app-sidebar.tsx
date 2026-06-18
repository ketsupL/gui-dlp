import { useSettings } from '../providers/download-settings-provider' 
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AppSidebar() {
  const { settings, setSettings } = useSettings()
  const { downloadMode, videoQuality, fileExtension, outputFolder } = settings

  const handleSettingChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,         
      [field]: value   
    }))
  }

  const handleModeChange = (newMode: string) => {
    setSettings(prev => {
      const updates = { ...prev, downloadMode: newMode }

      if (newMode === 'audio' && ['mp4', 'mkv', 'webm'].includes(prev.fileExtension)) {
        updates.fileExtension = 'mp3'
      } else if (newMode !== 'audio' && ['mp3', 'm4a', 'wav'].includes(prev.fileExtension)) {
        updates.fileExtension = 'mp4'
      }

      return updates
    })
  }

  const handleSelectFolder = async () => {
    try {
      const folderPath = await window.ytdlpApi.selectFolder()
      if (folderPath) {
        handleSettingChange('outputFolder', folderPath)
      }
    } catch (err) {
      console.error("Failed to select folder", err)
    }
  }

  return (
    <Sidebar className='bg-sidebar'>
      <SidebarHeader className="h-20 p-4 border-b justify-center">
        <h2 className="text-xl font-bold">GUI-DLP</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent className="p-4 flex flex-col gap-4">

            <div>
              <label className="text-sm font-medium mb-1 block">Download Mode</label>
              <Select
                value={downloadMode}
                onValueChange={(value) =>
                  handleModeChange(value)
                }
                disabled={downloadMode === 'audio'} 
              >
                <SelectTrigger className="w-full disabled:opacity-50">
                  <SelectValue placeholder="Select video quality" />
                </SelectTrigger>

                <SelectContent className='w-full'>
                    <SelectItem value="video+audio">Video + Audio</SelectItem>
                    <SelectItem value="video">Video Only</SelectItem>
                    <SelectItem value="audio">Audio Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Video Quality</label>
              <Select
                value={videoQuality}
                onValueChange={(value) =>
                  handleSettingChange("videoQuality", value)
                }
                disabled={downloadMode === 'audio'} 
              >
                <SelectTrigger className="w-full disabled:opacity-50">
                  <SelectValue placeholder="Select video quality" />
                </SelectTrigger>

                <SelectContent className='w-full'>
                    <SelectItem value="best">Best</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="360p">360p</SelectItem>
                    <SelectItem value="144p">144p</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Extension</label>
              <Select
                value={fileExtension}
                onValueChange={(value) =>
                  handleSettingChange("fileExtension", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select extension" />
                </SelectTrigger>

                <SelectContent className='w-full'>
                  {downloadMode === "audio" ? (
                    <>
                      <SelectItem value="mp3">mp3</SelectItem>
                      <SelectItem value="m4a">m4a</SelectItem>
                      <SelectItem value="wav">wav</SelectItem>
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

            <div className="pt-2 border-t mt-2">
              <label className="text-sm font-medium mb-1 block">Save to</label>
              <div className="flex gap-2 items-center">
                <div 
                  className="flex-1 px-2 py-1.5 border rounded-md bg-muted text-muted-foreground text-xs truncate cursor-help"
                  title={outputFolder || "No folder selected"}
                >
                  {outputFolder || "Select a folder..."}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleSelectFolder}
                  className="shrink-0 h-8"
                >
                  Browse
                </Button>
              </div>
            </div>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}