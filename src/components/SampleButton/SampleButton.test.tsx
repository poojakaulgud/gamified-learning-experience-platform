import { render, screen } from '@testing-library/react';
import { test, describe, expect } from 'vitest';
import Button from './';

describe('Sample Button', () => {
  test('should display button text', async () => {
    const buttonText = 'Test Button';
    render(<Button>{buttonText}</Button>);

    const buttonRef = screen.getByText(buttonText);

    expect(buttonRef.textContent).toBe(buttonText);
  });
});
