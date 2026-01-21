import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings")({
    component: Settings,
});

function Settings() {
    const [includeVosotros, setIncludeVosotros] = useState(() => {
        const stored = localStorage.getItem("includeVosotros");
        return stored ? JSON.parse(stored) : true;
    });

    useEffect(() => {
        localStorage.setItem(
            "includeVosotros",
            JSON.stringify(includeVosotros),
        );
        // Dispatch a storage event to notify other tabs/windows
        window.dispatchEvent(new Event("storage"));
    }, [includeVosotros]);

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Settings
                </h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Include "vosotros"
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Include conjugations for the informal "you all" used in Spain.
                            </p>
                        </div>
                        <label htmlFor="vosotros-toggle" className="flex cursor-pointer items-center">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="vosotros-toggle"
                                    className="sr-only peer"
                                    checked={includeVosotros}
                                    onChange={(e) => setIncludeVosotros(e.target.checked)}
                                />
                                <div
                                    className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer
                                    peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                                ></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}