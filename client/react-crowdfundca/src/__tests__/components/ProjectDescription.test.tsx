import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProjectDescription from '../../components/views/ProjectDescription'; // Adjust the import path as necessary
import * as ApiService from '../../services/apiService';

// Mock the useHistory and fetchData hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: { data: { projectItem: { /* Mock project data */ }, token: 'mockToken' }},
  }),
}));

jest.mock('../../services/apiService', () => ({
  fetchData: jest.fn(),
}));

describe('ProjectDescription', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    ApiService.fetchData.mockClear();
    // Setup mock implementation if necessary
    ApiService.fetchData.mockResolvedValueOnce(/* Mock successful response for project list */)
      .mockResolvedValueOnce(/* Mock successful response for user info */);
  });

  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ProjectDescription />
      </BrowserRouter>
    );

    // Verify some static text or element that's always rendered
    expect(screen.getByText(/project description/i)).toBeInTheDocument();
  });

  test('fetches data and updates state correctly', async () => {
    render(
      <BrowserRouter>
        <ProjectDescription />
      </BrowserRouter>
    );

    // Wait for fetchData to be called and state to be updated
    await waitFor(() => expect(ApiService.fetchData).toHaveBeenCalledTimes(2));

    // expect(screen.getByText(/* Mock project name or other identifiable text */)).toBeInTheDocument();
    // expect(screen.getByText(/* Mock user name or other identifiable text */)).toBeInTheDocument();
  });

  // Additional tests as needed
});
