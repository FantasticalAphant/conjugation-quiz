// frontend/src/routes/__tests__/index.test.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { Index } from "../index";

// Mock the useSettings hook
vi.mock("../../contexts/SettingsContext", () => ({
    useSettings: vi.fn(),
}));

const mockVerbData = {
    verb: "hablar",
    tenses: {
        present: {
            forms: {
                yo: "hablo",
                tú: "hablas",
                "él/ella/usted": "habla",
                "nosotros/nosotras": "hablamos",
                "vosotros/vosotras": "habláis",
                "ellos/ellas/ustedes": "hablan",
            },
        },
    },
};

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    return render(ui, { wrapper });
};

describe("Index route", () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Mock the useSettings hook to return default values
        (useSettings as any).mockReturnValue({
            includeVosotros: true,
            selectedTenses: ["present"],
            isTimerEnabled: false,
            timerDuration: 10,
        });

        // Mock the fetch function
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockVerbData),
                ok: true,
            }),
        );
    });

    test("renders the quiz and checks a correct answer", async () => {
        renderWithProviders(<Index />);

        await waitFor(() =>
            expect(screen.getByText("Verb:")).toBeInTheDocument(),
        );

        // Check that the verb is displayed
        expect(screen.getByText("hablar")).toBeInTheDocument();

        // Extract the pronoun using a more robust method
        const pronounParagraph = screen.getByText(/Pronoun:/).closest("p");
        const fullText = pronounParagraph?.textContent; // "Pronoun: nosotros/nosotras"
        const pronoun = fullText?.replace("Pronoun:", "").trim();

        // Get the correct answer based on the pronoun
        const correctAnswer =
            mockVerbData.tenses.present.forms[
                pronoun as keyof typeof mockVerbData.tenses.present.forms
            ];
        expect(correctAnswer).toBeDefined(); // Ensure we found a matching pronoun

        // Find the answer input and submit button
        const answerInput = screen.getByPlaceholderText("Your answer");
        const checkButton = screen.getByRole("button", { name: "Check" });

        await userEvent.type(answerInput, correctAnswer);
        await userEvent.click(checkButton);

        // Check for the "Correct!" message
        expect(await screen.findByText("Correct!")).toBeInTheDocument();

        // Check that the score is updated
        expect(screen.getByText("Score: 1 / 1")).toBeInTheDocument();
    });

    test("checks an incorrect answer", async () => {
        renderWithProviders(<Index />);

        await waitFor(() =>
            expect(screen.getByText("Verb:")).toBeInTheDocument(),
        );

        // Find the answer input and submit button
        const answerInput = screen.getByPlaceholderText("Your answer");
        const checkButton = screen.getByRole("button", { name: "Check" });

        await userEvent.type(answerInput, "wrong answer");
        await userEvent.click(checkButton);

        // Check for the "Incorrect!" message
        expect(await screen.findByText(/Incorrect!/)).toBeInTheDocument();

        // Check that the score is updated
        expect(screen.getByText("Score: 0 / 1")).toBeInTheDocument();
    });

    test("goes to the next question", async () => {
        renderWithProviders(<Index />);

        await waitFor(() =>
            expect(screen.getByText("Verb:")).toBeInTheDocument(),
        );

        // Answer the first question - dynamically determine correct answer
        const pronounParagraph = screen.getByText(/Pronoun:/).closest("p");
        const fullText = pronounParagraph?.textContent; // "Pronoun: nosotros/nosotras"
        const pronoun = fullText?.replace("Pronoun:", "").trim();

        const correctAnswer =
            mockVerbData.tenses.present.forms[
                pronoun as keyof typeof mockVerbData.tenses.present.forms
            ];
        expect(correctAnswer).toBeDefined();

        const answerInput = screen.getByPlaceholderText("Your answer");
        const checkButton = screen.getByRole("button", { name: "Check" });
        await userEvent.type(answerInput, correctAnswer);
        await userEvent.click(checkButton);

        // Wait for the "Next Question" button to appear
        const nextButton = await screen.findByRole("button", {
            name: "Next Question",
        });
        await userEvent.click(nextButton);

        // Check that a new quiz is loaded (we can check if the verb is still there)
        expect(await screen.findByText("Verb:")).toBeInTheDocument();
        expect(screen.getByText("hablar")).toBeInTheDocument();

        // Score should now be 1 / 1 as the first answer was correct
        expect(screen.getByText("Score: 1 / 1")).toBeInTheDocument();
    });
});
