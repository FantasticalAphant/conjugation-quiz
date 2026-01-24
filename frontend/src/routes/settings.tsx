import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react"; // Import useMemo
import { useSettings } from "../contexts/SettingsContext";

export const Route = createFileRoute("/settings")({
    component: Settings,
});

// Helper function to format tense names
const formatTenseName = (tense: string): string => {
    return tense
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

function Settings() {
    const {
        includeVosotros,
        setIncludeVosotros,
        selectedTenses,
        setSelectedTenses,
    } = useSettings();

    const { data: tenses, isLoading } = useQuery<string[]>({
        queryKey: ["tenses"],
        queryFn: async () => {
            const response = await fetch("/api/v1/tenses");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
    });

    // Effect to initialize selectedTenses with all available tenses on first load
    useEffect(() => {
        if (tenses && !isLoading) {
            const storedTenses = localStorage.getItem("selectedTenses");
            if (storedTenses === null) {
                // Only set default if nothing is in localStorage
                setSelectedTenses(tenses);
            }
        }
    }, [tenses, isLoading, setSelectedTenses]);

    const handleTenseChange = (tense: string) => {
        const newSelectedTenses = selectedTenses.includes(tense)
            ? selectedTenses.filter((t) => t !== tense)
            : [...selectedTenses, tense];
        setSelectedTenses(newSelectedTenses);
    };

    const handleSelectAll = () => {
        if (tenses) {
            setSelectedTenses(tenses);
        }
    };

    const handleDeselectAll = () => {
        setSelectedTenses([]);
    };

    const allTensesSelected = useMemo(() => {
        if (!tenses) return false;
        return tenses.length > 0 && selectedTenses.length === tenses.length;
    }, [tenses, selectedTenses]);

    const noTensesSelected = selectedTenses.length === 0;

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Include "vosotros"
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Include conjugations for the informal "you all"
                                used in Spain.
                            </p>
                        </div>
                        <label
                            htmlFor="vosotros-toggle"
                            className="flex cursor-pointer items-center"
                        >
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="vosotros-toggle"
                                    className="sr-only peer"
                                    checked={includeVosotros}
                                    onChange={(e) =>
                                        setIncludeVosotros(e.target.checked)
                                    }
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Select Tenses
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        If no tenses are selected, all tenses will be included
                        in the quiz.
                    </p>
                    {isLoading ? (
                        <p>Loading tenses...</p>
                    ) : (
                        <>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={handleDeselectAll}
                                    disabled={
                                        noTensesSelected || !tenses?.length
                                    }
                                    className={`px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition-colors ${
                                        noTensesSelected || !tenses?.length
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                    }`}
                                >
                                    Unselect All
                                </button>
                                <button
                                    onClick={handleSelectAll}
                                    disabled={
                                        allTensesSelected || !tenses?.length
                                    }
                                    className={`px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition-colors ${allTensesSelected || !tenses?.length ? "cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    Select All
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {tenses?.map((tense) => (
                                    <label
                                        key={tense}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                                            checked={selectedTenses.includes(
                                                tense,
                                            )}
                                            onChange={() =>
                                                handleTenseChange(tense)
                                            }
                                        />
                                        <span className="text-sm">
                                            {formatTenseName(tense)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

