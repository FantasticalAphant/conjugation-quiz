// frontend/src/components/__tests__/QuizCounter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import QuizCounter from '../QuizCounter';

describe('QuizCounter', () => {
    test('renders the score correctly', () => {
        render(<QuizCounter questionCount={10} correctCount={5} onReset={() => {}} />);
        expect(screen.getByText('Score: 5 / 10')).toBeInTheDocument();
    });

    test('calls the onReset function when the reset button is clicked', async () => {
        const onReset = vi.fn();
        render(<QuizCounter questionCount={10} correctCount={5} onReset={onReset} />);
        
        const resetButton = screen.getByRole('button', { name: 'Reset Score' });
        await userEvent.click(resetButton);
        
        expect(onReset).toHaveBeenCalledTimes(1);
    });
});
