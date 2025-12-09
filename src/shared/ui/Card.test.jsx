import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card/Card';

describe('Card Component', () => {
  it('should render card with title', () => {
    render(<Card title="Test Card">Content</Card>);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('should render card with description', () => {
    render(
      <Card title="Test Card" description="This is a test description">
        Content
      </Card>
    );
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('should render card with children', () => {
    render(
      <Card title="Test Card">
        <p>This is card content</p>
      </Card>
    );
    expect(screen.getByText('This is card content')).toBeInTheDocument();
  });

  it('should render action element when provided', () => {
    render(
      <Card title="Test Card" action={<button>Action</button>}>
        Content
      </Card>
    );
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Card title="Test Card" className="custom-card">
        Content
      </Card>
    );
    expect(container.querySelector('.custom-card')).toBeInTheDocument();
  });

  it('should render without description', () => {
    render(<Card title="Test Card">Content</Card>);
    const card = screen.getByText('Test Card').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('should render without action', () => {
    const { container } = render(<Card title="Test Card">Content</Card>);
    const actionArea = container.querySelector('[class*="action"]');
    expect(actionArea).not.toBeInTheDocument();
  });

  it('should render complex children', () => {
    render(
      <Card title="Test Card">
        <div data-testid="complex-content">
          <h3>Nested heading</h3>
          <p>Nested paragraph</p>
        </div>
      </Card>
    );
    expect(screen.getByTestId('complex-content')).toBeInTheDocument();
    expect(screen.getByText('Nested heading')).toBeInTheDocument();
  });

  it('should render with title and action together', () => {
    render(
      <Card 
        title="Test Card" 
        action={<button>Edit</button>}
      >
        Content
      </Card>
    );
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('should render all content sections together', () => {
    render(
      <Card
        title="Full Card"
        description="Complete card with all sections"
        action={<a href="#test">View More</a>}
      >
        <p>Main content here</p>
      </Card>
    );
    expect(screen.getByText('Full Card')).toBeInTheDocument();
    expect(screen.getByText('Complete card with all sections')).toBeInTheDocument();
    expect(screen.getByText('Main content here')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view more/i })).toBeInTheDocument();
  });
});
