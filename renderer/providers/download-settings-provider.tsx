import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from 'react'

type SettingsType = {
    downloadMode: string;
    videoQuality: string;
    fileExtension: string;
    outputFolder: string;
}

interface SettingsContextType {
    settings: SettingsType;
    setSettings: Dispatch<SetStateAction<SettingsType>>;
}

const SettingsContext = createContext<SettingsContextType | null>(null)


export function DownloadSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState({
        downloadMode: "video+audio",
        videoQuality: "best",
        fileExtension: "mp4",
        outputFolder: "",
    })

    useEffect(() => {
        async function fetchDefaultPath() {
            const defaultPath = await window.ytdlpApi.getDefaultPath()

            if (defaultPath) {
                setSettings(prev => ({ ...prev, outputFolder: defaultPath}))
            }
        }

        fetchDefaultPath()
    }, [])

    return (
        <SettingsContext.Provider
            value={{ settings, setSettings }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider")
    }
    
    return context
}