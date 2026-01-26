// frontend/src/components/__tests__/TimerBar.test.tsx
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import TimerBar from '../TimerBar';

describe('TimerBar', () => {
    test('renders the timer bar with the correct duration', () => {
        const { container } = render(<TimerBar duration={10} />);
        const timerBar = container.querySelector('.timer-bar');
        expect(timerBar).toBeInTheDocument();
        expect(timerBar).toHaveStyle('--timer-duration: 10s');
    });
});
