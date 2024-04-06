import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ProjectSearchFeatures from '../../components/views/ProjectSearchFeatures';
import * as ApiService from '../../services/apiService';
import { MemoryRouter } from 'react-router-dom';

// Mock the ApiService to prevent real API calls
jest.mock('../../services/apiService', () => ({
  fetchData: jest.fn(),
}));

// Mock useLocation and useHistory if the component uses them
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Retain non-hook parts of the module
  useLocation: () => ({
    state:{
        searchKeyword: {
            inputVal: 'Project Alpha',
        },
        searchResultList: {
            values: {
                projectInfo:[
                  {
                    _doc:{
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
                    },
                  }
                    
                ]
            }
        }
    }
    
  }),
  useHistory: () => ({
    push: jest.fn(), // If the component modifies history, e.g., updating search params
  }),
}));

describe('ProjectSearchFeatures', () => {
  beforeEach(() => {
  });

  it('renders search input and allows user to search for projects', async () => {
    render(
      <MemoryRouter>
        <ProjectSearchFeatures />
      </MemoryRouter>
    );
    // screen.debug();
    // Assert fetchData was called with the search query
    await waitFor(() => expect(ApiService.fetchData).toHaveBeenCalled());

    // Assert that search results are rendered
    expect(screen.getByText('Search Result')).toBeInTheDocument();
    expect(screen.getByText('Keyword: Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('100/50/25')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  // Include more tests as needed for different search criteria, handling of no results, etc.
});
