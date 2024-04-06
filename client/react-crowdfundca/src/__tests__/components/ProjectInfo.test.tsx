import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectInfo from '../../components/views/ProjectInfo'; // Adjust the import path as necessary
import * as ApiService from '../../services/apiService';
import { MemoryRouter } from 'react-router-dom';

// Mock the entire ApiService module
jest.mock('../../services/apiService', () => ({
  fetchData: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useLocation: () => ({
      state: { data: { projectItem: {
        _id: "id",
        pid: `pid`,
        projectname: `Project 1`,
        projectsdescription: "This is a mock description for the project. It outlines the project goals, scope, and intended impact.",
        categoryid: `CAT`,
        images: [],
        userId: `USER`,
        token: `token`,
        targetmoney: "10000",
        currentmoney: "5000",
        statue: false,
        enddate: new Date(),
        startdate: new Date(),
        rewardlevel: ["Gold", "Silver", "Bronze"],
        rewardprice: ["100", "50", "25"],
        rewardcontent: [
          "Gold Package: Exclusive content + Meet & Greet",
          "Silver Package: Exclusive content",
          "Bronze Package: Early access"
        ],
    }, token: 'mockToken' }},
  }),
}));

describe('ProjectInfo', () => {
  beforeEach(() => {
    // Reset mocks before each test
    ApiService.fetchData.mockClear();
    // Setup the mock implementation of fetchData if your component expects it
  });

  it('renders without error and displays project information', async () => {
    // If fetchData is used, mock its implementation specific to this component's data fetching
    ApiService.fetchData.mockImplementation((url, authToken, callback) => {
      // Mock responses based on the URL or other arguments
      if (url.includes('getUserProfile')) {
        const mockResponseData = {
            user: {
                firstName: 'firstName',
                lastName: 'lastName',
                profilePic: '',
            },
            investedProjectList: [],
        }
        return callback(mockResponseData);
      }
    });

    render(
      <MemoryRouter>
        <ProjectInfo />
      </MemoryRouter>
    );

    // Verify fetchData was called if applicable
    // await waitFor(() => expect(ApiService.fetchData).toHaveBeenCalled());

    // Example: Checking for the presence of specific text in the document
    // This could be the project's name, description, or other identifiable information
    await waitFor(() => {
      // screen.debug();
      expect(screen.getByText("Project 1")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });

  // Add more tests as needed for user interactions, state changes, and other aspects
});
