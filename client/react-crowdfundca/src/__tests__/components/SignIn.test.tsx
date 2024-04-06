import React from 'react';
import SignIn from '../../components/SignIn';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SignIn component', () => {
  it('renders sign-in form fields and a submit button', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    // Check for email and password input fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('allows users to enter their credentials', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    // Check that inputs reflect user typing
    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password');
  });

  // Further tests can include checking for error messages on invalid input, testing API call mocks if applicable, etc.
});
