import { createFileRoute } from "@tanstack/react-router";
import { regularConjugations, pronouns } from "../conjugations";
import { useState } from "react";

export const Route = createFileRoute("/charts")({
    component: Charts,
});

function ConjugationTable({
    verbType,
    exampleVerb,
    tense,
    endings,
    personLabels,
}: {
    verbType: string;
    exampleVerb: string;
    tense: string;
    endings: { singular: string[]; plural: string[] };
    personLabels: string[];
}) {
    const stem = exampleVerb.slice(0, -2);
    const getConjugation = (ending: string) => {
        if (ending === "-") {
            return "-";
        }
        if (tense === "Future" || tense === "Conditional") {
            return exampleVerb + ending;
        }
        return stem + ending;
    };
    return (
        <div className="w-full">
            <h4 className="text-xl font-bold mb-2 text-center">
                -{verbType} Verbs ({exampleVerb})
            </h4>
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-2 border border-gray-300 dark:border-gray-600">
                            Person
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600">
                            Singular
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600">
                            Plural
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {personLabels.map((label, index) => (
                        <tr key={index} className="text-center">
                            <td className="py-3 px-2 border border-gray-300 dark:border-gray-600 font-semibold">
                                {label}
                            </td>
                            <td className="py-3 px-2 border border-gray-300 dark:border-gray-600 font-mono">
                                {getConjugation(endings.singular[index])}
                            </td>
                            <td className="py-3 px-2 border border-gray-300 dark:border-gray-600 font-mono">
                                {getConjugation(endings.plural[index])}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TabButton({
    children,
    isActive,
    onClick,
}: {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            className={`px-4 py-2 font-semibold rounded-t-lg ${
                isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
            }`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function Charts() {
    const [selectedMood, setSelectedMood] = useState("indicative");
    const [selectedTense, setSelectedTense] = useState("Present");

    const moods = Object.keys(regularConjugations);
    const tenses = regularConjugations[
        selectedMood as keyof typeof regularConjugations
    ].map((t) => t.tense);

    const personLabels = ["1st", "2nd", "3rd"];

    const handleMoodChange = (mood: string) => {
        setSelectedMood(mood);
        setSelectedTense(
            regularConjugations[mood as keyof typeof regularConjugations][0].tense,
        );
    };

    const selectedTenseData = regularConjugations[
        selectedMood as keyof typeof regularConjugations
    ].find((t) => t.tense === selectedTense);

    return (
        <div className="p-4 text-gray-900 dark:text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Regular Conjugation Charts
            </h1>

            <div className="mb-4 flex justify-center gap-2">
                {moods.map((mood) => (
                    <TabButton
                        key={mood}
                        isActive={selectedMood === mood}
                        onClick={() => handleMoodChange(mood)}
                    >
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </TabButton>
                ))}
            </div>

            <div className="mb-6 flex justify-center gap-2 flex-wrap">
                {tenses.map((tense) => (
                    <button
                        key={tense}
                        className={`px-3 py-1 text-sm rounded-full ${
                            selectedTense === tense
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                        }`}
                        onClick={() => setSelectedTense(tense)}
                    >
                        {tense}
                    </button>
                ))}
            </div>

            {selectedTenseData && (
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <ConjugationTable
                        verbType="ar"
                        exampleVerb="trabajar"
                        tense={selectedTenseData.tense}
                        endings={selectedTenseData.endings.ar}
                        personLabels={personLabels}
                    />
                    <ConjugationTable
                        verbType="er"
                        exampleVerb="aprender"
                        tense={selectedTenseData.tense}
                        endings={selectedTenseData.endings.er}
                        personLabels={personLabels}
                    />
                    <ConjugationTable
                        verbType="ir"
                        exampleVerb="escribir"
                        tense={selectedTenseData.tense}
                        endings={selectedTenseData.endings.ir}
                        personLabels={personLabels}
                    />
                </div>
            )}

            <div className="max-w-4xl mx-auto mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-center">Pronoun Legend</h3>
                <ul className="text-center space-y-1">
                    {pronouns.map((p, i) => (
                        <li key={i}>
                            <span className="font-bold">{personLabels[i]} Person:</span>{" "}
                            <span className="font-mono">{p.singular}</span> (singular),{" "}
                            <span className="font-mono">{p.plural}</span> (plural)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
