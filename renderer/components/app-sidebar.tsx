
import { useSettings } from '../providers/download-settings-provider' 
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { settings, setSettings } = useSettings()
  const { downloadMode, videoQuality, fileExtension } = settings

  const handleSettingChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,         // Keep all existing settings
      [field]: value   // Overwrite the specific setting that changed
    }))
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-20 p-4 border-b justify-center">
        <h2 className="text-xl font-bold">GUI-DLP</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent className="p-4 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Download Mode</label>
              <select 
                className="w-full p-2 border rounded-md bg-white text-black text-sm"
                value={downloadMode}
                onChange={(e) => handleSettingChange('downloadMode', e.target.value)}
              >
                <option value="video+audio">Video + Audio</option>
                <option value="video">Video Only</option>
                <option value="audio">Audio Only</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Video Quality</label>
              <select 
                className="w-full p-2 border rounded-md bg-white text-black text-sm"
                value={videoQuality}
                onChange={(e) => handleSettingChange('videoQuality', e.target.value)}
                disabled={downloadMode === 'audio'} // Disable if audio only
              >
                <option value="best">Best</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Extension</label>
              <select 
                className="w-full p-2 border rounded-md bg-white text-black text-sm"
                value={fileExtension}
                onChange={(e) => handleSettingChange('fileExtension', e.target.value)}
              >
                {downloadMode === 'audio' ? (
                  <>
                    <option value="mp3">mp3</option>
                    <option value="m4a">m4a</option>
                    <option value="wav">wav</option>
                  </>
                ) : (
                  <>
                    <option value="mp4">mp4</option>
                    <option value="mkv">mkv</option>
                    <option value="webm">webm</option>
                  </>
                )}
              </select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}