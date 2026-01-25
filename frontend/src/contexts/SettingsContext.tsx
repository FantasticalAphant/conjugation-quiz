import {
    createContext,
    type PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

interface SettingsContextType {
    includeVosotros: boolean;
    setIncludeVosotros: (include: boolean) => void;
    selectedTenses: string[];
    setSelectedTenses: (tenses: string[]) => void;
    isTimerEnabled: boolean;
    setIsTimerEnabled: (enabled: boolean) => void;
    timerDuration: number;
    setTimerDuration: (duration: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined,
);

export function SettingsProvider({ children }: PropsWithChildren) {
    const [includeVosotros, setIncludeVosotros] = useState(() => {
        const stored = localStorage.getItem("includeVosotros");
        return stored ? JSON.parse(stored) : true;
    });
    const [selectedTenses, setSelectedTenses] = useState<string[]>(() => {
        const stored = localStorage.getItem("selectedTenses");
        return stored ? JSON.parse(stored) : [];
    });
    const [isTimerEnabled, setIsTimerEnabled] = useState(() => {
        const stored = localStorage.getItem("isTimerEnabled");
        return stored ? JSON.parse(stored) : true;
    });
    const [timerDuration, setTimerDuration] = useState(() => {
        const stored = localStorage.getItem("timerDuration");
        return stored ? JSON.parse(stored) : 10;
    });

    useEffect(() => {
        localStorage.setItem(
            "includeVosotros",
            JSON.stringify(includeVosotros),
        );
        // Dispatch a storage event to notify other tabs/windows
        window.dispatchEvent(new Event("storage"));
    }, [includeVosotros]);

    useEffect(() => {
        localStorage.setItem("selectedTenses", JSON.stringify(selectedTenses));
        // Dispatch a storage event to notify other tabs/windows
        window.dispatchEvent(new Event("storage"));
    }, [selectedTenses]);

    useEffect(() => {
        localStorage.setItem("isTimerEnabled", JSON.stringify(isTimerEnabled));
        window.dispatchEvent(new Event("storage"));
    }, [isTimerEnabled]);

    useEffect(() => {
        localStorage.setItem("timerDuration", JSON.stringify(timerDuration));
        window.dispatchEvent(new Event("storage"));
    }, [timerDuration]);

    return (
        <SettingsContext.Provider
            value={{
                includeVosotros,
                setIncludeVosotros,
                selectedTenses,
                setSelectedTenses,
                isTimerEnabled,
                setIsTimerEnabled,
                timerDuration,
                setTimerDuration,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
