import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useSettings } from "../contexts/SettingsContext";
import type { ConjugationForm, VerbConjugations } from "../types";

export const Route = createFileRoute("/")({
    component: Index,
});

const fetchRandomVerb = async (
    includeVosotros: boolean,
    tenses: string[],
): Promise<VerbConjugations> => {
    const params = new URLSearchParams();
    params.append("include_vosotros", String(includeVosotros));
    tenses.forEach((tense) => params.append("tenses", tense));

    const url = `/api/v1/verbs/random?${params.toString()}`;
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

    const { includeVosotros, selectedTenses } = useSettings();
    const answerInputRef = useRef<HTMLInputElement>(null);

    const {
        data: verbData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["randomVerb", quizId, includeVosotros, selectedTenses],
        queryFn: () => fetchRandomVerb(includeVosotros, selectedTenses),
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
    }, [verbData]);

    const handleNext = useCallback(() => {
        setIsCorrect(null);
        setAnswer("");
        setQuizId((prevId) => prevId + 1);
        refetch();
        answerInputRef.current?.focus();
    }, [refetch]);

    // Add global event listener for "Enter" to go to the next question
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && isCorrect !== null) {
                // Check if the event target is not an input to avoid conflicts
                if (
                    !(event.target instanceof HTMLInputElement) &&
                    !(event.target instanceof HTMLTextAreaElement)
                ) {
                    handleNext();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isCorrect, handleNext]); // Rerun effect when isCorrect or handleNext changes

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quiz) return;

        if (answer.toLowerCase() === quiz.correctAnswer.toLowerCase()) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleCharacterClick = (char: string) => {
        setAnswer((prev) => prev + char);
        answerInputRef.current?.focus();
    };

    const accentedChars = ["á", "é", "í", "ó", "ú", "ü", "ñ"];

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
                        <span className="font-semibold text-gray-500 dark:text-gray-400">
                            Verb:
                        </span>{" "}
                        {quiz.verb}
                    </p>
                    <p className="text-xl">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">
                            Tense:
                        </span>{" "}
                        {quiz.tense.replaceAll("_", " ")}
                    </p>
                    <p className="text-xl">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">
                            Pronoun:
                        </span>{" "}
                        {quiz.pronoun}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <input
                            ref={answerInputRef}
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
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                        {accentedChars.map((char) => (
                            <button
                                key={char}
                                type="button"
                                onClick={() => handleCharacterClick(char)}
                                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                                disabled={isCorrect !== null}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </form>
                <div className="mt-6 text-center min-h-[72px]">
                    {isCorrect === true && (
                        <div>
                            <p className="text-green-500 text-xl font-bold">
                                Correct!
                            </p>
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
                                <span className="font-mono">
                                    {quiz.correctAnswer}
                                </span>
                                .
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
        );
    };

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

