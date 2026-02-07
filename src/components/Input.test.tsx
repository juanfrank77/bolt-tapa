import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  it('renders input field', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" />);
      requestAnimationFrame(() => resolve());
    });
    expect(container.querySelector('input')).toBeTruthy();
  });

  it('renders label when provided', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input label="Username" placeholder="Enter username" />);
      requestAnimationFrame(() => resolve());
    });
    expect(container.querySelector('label')).toBeTruthy();
    expect(container.querySelector('label')?.textContent).toBe('Username');
  });

  it('renders error message when provided', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" error="This field is required" />);
      requestAnimationFrame(() => resolve());
    });
    const errorElement = container.querySelector('.text-red-600');
    expect(errorElement).toBeTruthy();
    expect(errorElement?.textContent).toBe('This field is required');
  });

  it('renders helper text when provided', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" helperText="Must be at least 8 characters" />);
      requestAnimationFrame(() => resolve());
    });
    const helperElement = container.querySelector('.text-gray-500');
    expect(helperElement).toBeTruthy();
    expect(helperElement?.textContent).toBe('Must be at least 8 characters');
  });

  it('renders with default variant', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" />);
      requestAnimationFrame(() => resolve());
    });
    const input = container.querySelector('input');
    expect(input?.classList.contains('border-gray-300')).toBe(true);
  });

  it('renders with filled variant', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" variant="filled" />);
      requestAnimationFrame(() => resolve());
    });
    const input = container.querySelector('input');
    expect(input?.classList.contains('bg-gray-50')).toBe(true);
  });

  it('calls onChange handler when input value changes', async () => {
    const handleChange = vi.fn();
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" onChange={handleChange} />);
      requestAnimationFrame(() => resolve());
    });
    
    const input = container.querySelector('input');
    if (input) {
      fireEvent.change(input, { target: { value: 'test input value' } });
    }
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders icon on left by default', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" icon={<span>🔍</span>} />);
      requestAnimationFrame(() => resolve());
    });
    const iconContainer = container.querySelector('.pl-10');
    expect(iconContainer).toBeTruthy();
  });

  it('renders icon on right when specified', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await new Promise<void>((resolve) => {
      root.render(<Input placeholder="Enter text" icon={<span>🔍</span>} iconPosition="right" />);
      requestAnimationFrame(() => resolve());
    });
    const iconContainer = container.querySelector('.pr-10');
    expect(iconContainer).toBeTruthy();
  });
});
