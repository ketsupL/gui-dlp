import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react'

type SettingsType = {
    downloadMode: string;
    videoQuality: string;
    fileExtension: string;
}

interface SettingsContextType {
    settings: SettingsType;
    setSettings: Dispatch<SetStateAction<SettingsType>>;
}

const SettingsContext = createContext<SettingsContextType | null>(null)


export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState({
        downloadMode: "video+audio",
        videoQuality: "best",
        fileExtension: "mp4",
    })

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