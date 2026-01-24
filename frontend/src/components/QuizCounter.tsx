// frontend/src/components/QuizCounter.tsx
import React from "react";

interface QuizCounterProps {
    questionCount: number;
    correctCount: number;
    onReset: () => void;
}

const QuizCounter: React.FC<QuizCounterProps> = ({
    questionCount,
    correctCount,
    onReset,
}) => {
    return (
        <div className="flex justify-between items-center mb-4 max-w-xl mx-auto">
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Score: {correctCount} / {questionCount}
            </div>
            <button
                onClick={onReset}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
                Reset Score
            </button>
        </div>
    );
};

export default QuizCounter;
