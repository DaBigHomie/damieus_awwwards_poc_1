import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button/Button';

describe('Button Component', () => {
  it('should render button with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should apply primary variant by default', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('btn-primary');
  });

  it('should apply secondary variant when specified', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('btn-secondary');
  });

  it('should apply ghost variant when specified', () => {
    const { container } = render(<Button variant="ghost">Click me</Button>);
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('btn-ghost');
  });

  it('should apply medium size by default', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('btn-md');
  });

  it('should apply small size when specified', () => {
    const { container } = render(<Button size="sm">Click me</Button>);
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('btn-sm');
  });

  it('should apply large size when specified', () => {
    const { container } = render(<Button size="lg">Click me</Button>);
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('btn-lg');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Button className="custom-class">Click me</Button>
    );
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    render(
      <Button>
        <span data-testid="icon">🎯</span>
        Click me
      </Button>
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should combine multiple variants correctly', () => {
    const { container } = render(
      <Button variant="secondary" size="lg">
        Click me
      </Button>
    );
    const button = container.querySelector('button');
    
    expect(button).toHaveClass('btn-secondary', 'btn-lg');
  });
});
