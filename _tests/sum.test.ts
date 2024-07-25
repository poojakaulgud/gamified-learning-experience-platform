import Sum from '../src/helpers/sum';
import { expect, test } from 'vitest';

test('adds array of number to equal expected output', () => {
  expect(Sum([1, 2, 3, 4, 5, 6])).toBe(21);
});
