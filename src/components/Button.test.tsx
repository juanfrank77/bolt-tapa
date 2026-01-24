import { describe, it, expect } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Button from './Button';

describe('Button Component', () => {
  it('renders children text', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button>Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.textContent).toBe('Click Me');
  });

  it('renders with primary variant by default', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button>Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('bg-gradient-to-r')).toBe(true);
  });

  it('renders with secondary variant', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button variant="secondary">Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('bg-gray-100')).toBe(true);
  });

  it('renders with outline variant', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button variant="outline">Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('border-2')).toBe(true);
  });

  it('renders with ghost variant', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button variant="ghost">Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('text-gray-600')).toBe(true);
  });

  it('renders with danger variant', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button variant="danger">Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('bg-red-600')).toBe(true);
  });

  it('renders with small size', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button size="sm">Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('text-sm')).toBe(true);
  });

  it('renders with medium size', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button size="md">Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('text-sm')).toBe(true);
  });

  it('renders with large size', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Button size="lg">Click Me</Button>);
      requestAnimationFrame(() => resolve());
    });
    expect(container.firstChild?.classList.contains('text-base')).toBe(true);
  });
});
