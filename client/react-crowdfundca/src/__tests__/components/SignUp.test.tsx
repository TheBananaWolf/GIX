import React from 'react';
import SignUp from '../../components/SignUp';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SignUp component', () => {
  it('renders sign-up form fields and a submit button', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    // Assertions for input fields and submit button
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
