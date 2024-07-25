import TestComp from '../src/components/TestComp';
import { render, screen } from '@testing-library/react';
import { test } from 'vitest';

test('TestComp text is rendered', async () => {
  render(<TestComp />);
  await screen.findByText(/quick test/i);
});
