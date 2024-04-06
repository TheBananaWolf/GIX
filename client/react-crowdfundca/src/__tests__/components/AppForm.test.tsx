import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppForm from '../../components/views/AppForm'; // Adjust the import path as necessary

describe('AppForm', () => {
  test('renders without crashing and displays children', () => {
    const testMessage = 'Test content';
    render(
      <AppForm>
        <div>{testMessage}</div>
      </AppForm>
    );

    // Check if the AppForm renders
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  // Add more tests here as needed
});
