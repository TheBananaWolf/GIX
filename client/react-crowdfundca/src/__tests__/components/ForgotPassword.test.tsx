import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from '../../components/ForgotPassword'; // Adjust the import path as necessary
import * as ApiService from '../../services/apiService'; // Assuming this service is used for the API call
import { MemoryRouter } from 'react-router-dom';

// Mocking the API call made during the password reset request
jest.mock('../../services/apiService', () => ({
  requestPasswordReset: jest.fn(),
  fetchData: jest.fn(),
}));

describe('ForgotPassword', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    ApiService.requestPasswordReset.mockClear();
  });

  

  it('renders the forgot password form', () => {
    ApiService.fetchData.mockImplementation((url, authToken, callback) => {
        // Mock responses based on the URL or other arguments
        if (url.includes('getCategory')) {
          const mockResponseData = {
            categories: [
                {
                    categoryname: 'Test Category',
                    categorydescription: 'Description of Test Category',
                },
            ]
          }
          return callback(mockResponseData);
        }
      });
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
