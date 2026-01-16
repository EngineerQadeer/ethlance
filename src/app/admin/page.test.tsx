import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDashboardPage from './page';

describe('AdminDashboardPage', () => {
  it('renders the main dashboard heading', () => {
    render(<AdminDashboardPage />);
    
    const heading = screen.getByRole('heading', { 
      name: /dashboard/i,
      level: 1 
    });
    
    expect(heading).toBeInTheDocument();
  });

  it('renders all the summary cards', () => {
    render(<AdminDashboardPage />);
    
    expect(screen.getByText(/total revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/active jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/applications/i)).toBeInTheDocument();
  });

  it('renders the recent activity card', () => {
    render(<AdminDashboardPage />);
    
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    expect(screen.getByText(/no recent activity to display/i)).toBeInTheDocument();
  });
});
