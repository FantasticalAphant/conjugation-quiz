import {
    createContext,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren,
} from "react";

interface SettingsContextType {
    includeVosotros: boolean;
    setIncludeVosotros: (include: boolean) => void;
    selectedTenses: string[];
    setSelectedTenses: (tenses: string[]) => void;
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

    return (
        <SettingsContext.Provider
            value={{
                includeVosotros,
                setIncludeVosotros,
                selectedTenses,
                setSelectedTenses,
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
