import { describe, it, expect } from 'vitest';

describe('Sample Tests', () => {
  it('should add two numbers', () => {
    expect(1 + 2).toBe(3);
  });

  it('should subtract two numbers', () => {
    expect(5 - 3).toBe(2);
  });

  it('should multiply two numbers', () => {
    expect(2 * 4).toBe(8);
  });

  it('should divide two numbers', () => {
    expect(10 / 2).toBe(5);
  });
});
