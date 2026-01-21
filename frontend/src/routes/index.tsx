import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ConjugationForm, VerbConjugations } from "../types";

export const Route = createFileRoute("/")({
    component: Index,
});

const fetchRandomVerb = async (
    includeVosotros: boolean,
): Promise<VerbConjugations> => {
    const url = `/api/v1/verbs/random?include_vosotros=${includeVosotros}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    return res.json();
};

function Index() {
    const [answer, setAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [quizId, setQuizId] = useState(0);

    const [includeVosotros, setIncludeVosotros] = useState(() => {
        const stored = localStorage.getItem("includeVosotros");
        return stored ? JSON.parse(stored) : true;
    });

    // We need to re-read localStorage when the component mounts or gets focus
    // to ensure the setting is up-to-date if changed on the settings page.
    // However, directly calling localStorage in render or in a useEffect without
    // a specific event listener can be tricky with how Tanstack Query works
    // with query keys. A simpler approach for this specific case,
    // given the current structure, is to force a re-fetch/re-evaluation
    // when we suspect the setting might have changed.
    // For now, let's just make sure it's part of the queryKey
    // to trigger a refetch if it changes (though its change detection
    // needs to be external or state-driven).
    // A more robust solution might involve a global state management for settings.
    // For now, we'll rely on the quizId to trigger refetch and on initial load.

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem("includeVosotros");
            setIncludeVosotros(stored ? JSON.parse(stored) : true);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const {
        data: verbData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["randomVerb", quizId, includeVosotros], // quizId and includeVosotros will force a refetch when they change
        queryFn: () => fetchRandomVerb(includeVosotros),
    });

    const quiz = useMemo(() => {
        if (!verbData) return null;

        const tenses = Object.keys(verbData.tenses);
        if (tenses.length === 0) return null;
        const randomTense = tenses[Math.floor(Math.random() * tenses.length)];

        const forms = verbData.tenses[randomTense].forms;
        const pronouns = Object.keys(forms).filter(
            (p) => forms[p as keyof ConjugationForm],
        ) as (keyof ConjugationForm)[];
        if (pronouns.length === 0) return null;
        const randomPronoun =
            pronouns[Math.floor(Math.random() * pronouns.length)];

        const correctAnswer = forms[randomPronoun];

        if (!correctAnswer) return null;

        return {
            verb: verbData.verb,
            tense: randomTense,
            pronoun: randomPronoun,
            correctAnswer,
        };
    }, [verbData, quizId, includeVosotros]); // quizId and includeVosotros also forces re-calculation of random tense/pronoun

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quiz) return;

        if (answer.toLowerCase() === quiz.correctAnswer.toLowerCase()) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNext = () => {
        setIsCorrect(null);
        setAnswer("");
        setQuizId((prevId) => prevId + 1); // Increment quizId to trigger new random verb fetch and quiz generation
    };

    if (isLoading) {
        return (
            <div className="p-4 text-center text-gray-700 dark:text-gray-300">
                Loading...
            </div>
        );
    }
    if (isError || !quiz) {
        return (
            <div className="p-4 text-center text-red-600">
                Error loading quiz!
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Spanish Conjugation Quiz
            </h2>
            <div className="mb-6 space-y-2">
                <p className="text-xl">
                    <span className="font-semibold">Verb:</span> {quiz.verb}
                </p>
                <p className="text-xl">
                    <span className="font-semibold">Tense:</span>{" "}
                    {quiz.tense.replaceAll("_", " ")}
                </p>
                <p className="text-xl">
                    <span className="font-semibold">Pronoun:</span>{" "}
                    {quiz.pronoun}
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isCorrect !== null}
                    placeholder="Your answer"
                />
                <button
                    type="submit"
                    className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
                    disabled={isCorrect !== null}
                >
                    Check
                </button>
            </form>
            <div className="mt-6 text-center">
                {isCorrect === true && (
                    <p className="text-green-500 text-xl font-bold">Correct!</p>
                )}
                {isCorrect === false && (
                    <p className="text-red-500 text-xl font-bold">
                        Incorrect! The correct answer is{" "}
                        <span className="font-mono">{quiz.correctAnswer}</span>.
                    </p>
                )}

                {isCorrect !== null && (
                    <button
                        onClick={handleNext}
                        className="mt-6 px-5 py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Next Question
                    </button>
                )}
            </div>
        </div>
    );
}
