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
        queryKey: ["randomVerb", quizId, includeVosotros],
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
    }, [verbData, quizId, includeVosotros]);

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
        setQuizId((prevId) => prevId + 1);
    };

    const MainContent = () => {
        if (isLoading) {
            return (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading quiz...
                </div>
            );
        }
        if (isError || !quiz) {
            return (
                <div className="text-center text-red-500">
                    Error loading quiz! Please try refreshing the page.
                </div>
            );
        }

        return (
            <>
                <div className="mb-6 space-y-3">
                    <p className="text-xl">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">Verb:</span> {quiz.verb}
                    </p>
                    <p className="text-xl">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">Tense:</span>{" "}
                        {quiz.tense.replaceAll("_", " ")}
                    </p>
                    <p className="text-xl">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">Pronoun:</span>{" "}
                        {quiz.pronoun}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isCorrect !== null}
                        placeholder="Your answer"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 dark:disabled:text-gray-400 transition-colors"
                        disabled={isCorrect !== null || !answer}
                    >
                        Check
                    </button>
                </form>
                <div className="mt-6 text-center min-h-[72px]">
                    {isCorrect === true && (
                        <div>
                            <p className="text-green-500 text-xl font-bold">Correct!</p>
                            <button
                                onClick={handleNext}
                                className="mt-2 px-5 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Next Question
                            </button>
                        </div>
                    )}
                    {isCorrect === false && (
                         <div>
                            <p className="text-red-500 text-xl font-bold">
                                Incorrect! The correct answer is{" "}
                                <span className="font-mono">{quiz.correctAnswer}</span>.
                            </p>
                            <button
                                onClick={handleNext}
                                className="mt-2 px-5 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Next Question
                            </button>
                        </div>
                    )}
                </div>
            </>
        )
    }

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Spanish Conjugation Quiz
                    </h2>
                    <MainContent />
                </div>
            </div>
        </div>
    );
}
