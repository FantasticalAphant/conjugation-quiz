import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings")({
    component: Settings,
});

function Settings() {
    const [includeVosotros, setIncludeVosotros] = useState(() => {
        // Initialize from localStorage or default to true
        const stored = localStorage.getItem("includeVosotros");
        return stored ? JSON.parse(stored) : true;
    });

    useEffect(() => {
        // Save to localStorage whenever it changes
        localStorage.setItem(
            "includeVosotros",
            JSON.stringify(includeVosotros),
        );
    }, [includeVosotros]);

    return (
        <div className="p-2">
            <h3>Settings</h3>
            <div className="flex items-center space-x-2 mt-4">
                <input
                    id="vosotros-toggle"
                    type="checkbox"
                    checked={includeVosotros}
                    onChange={(e) => setIncludeVosotros(e.target.checked)}
                    className="toggle toggle-primary"
                />
                <label htmlFor="vosotros-toggle" className="text-lg">
                    Include "vosotros" (Spain informal "you all")
                </label>
            </div>
        </div>
    );
}
