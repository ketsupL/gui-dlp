import React, { useState } from 'react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const [downloadMode, setDownloadMode] = useState('video')

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-xl font-bold">gui-dlp</h2>
        <p className="text-sm text-gray-500">Global Settings</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>yt-dlp Config</SidebarGroupLabel>
          <SidebarGroupContent className="p-4 flex flex-col gap-4">
            
            {/* Example Setting: Mode */}
            <div>
              <label className="text-sm font-medium mb-1 block">Download Mode</label>
              <select 
                className="w-full p-2 border rounded-md bg-white text-black text-sm"
                value={downloadMode}
                onChange={(e) => setDownloadMode(e.target.value)}
              >
                <option value="video">Video + Audio</option>
                <option value="audio">Audio Only</option>
              </select>
            </div>

            {/* Example Setting: Quality */}
            <div>
              <label className="text-sm font-medium mb-1 block">Quality</label>
              <select className="w-full p-2 border rounded-md bg-white text-black text-sm">
                <option value="best">Best Available</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
              </select>
            </div>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}