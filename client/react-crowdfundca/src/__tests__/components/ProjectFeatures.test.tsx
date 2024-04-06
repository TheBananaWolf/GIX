import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectFeatures from "../../components/views/ProjectFeatures";
import * as ApiService from "../../services/apiService";
import { MemoryRouter } from "react-router-dom";

// Mock the entire ApiService module
jest.mock("../../services/apiService", () => ({
  fetchData: jest.fn(),
  fetchImage: jest.fn().mockImplementation((url, callback) => {
    callback("mockedImageUrl");
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    state: { categoryId: 1, token: "mockToken" },
  }),
}));

describe("ProjectFeatures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks before each test
    (ApiService.fetchData as jest.Mock).mockClear();
  });

  it("renders without error and fetches data correctly", async () => {
    // Setup the mock implementation of fetchData for different scenarios
    (ApiService.fetchData as jest.Mock).mockImplementation((url:string, _authToken, callback) => {
      if (url.includes("getCategoryInfoById")) {
        callback({
          projectInfo: {
            categoryname: 'Test Category',
            categorydescription: 'Description of Test Category',
          },
        });
      } 
      else if (url.includes("showProjectBy")) {
        callback({
          projectInfo: [
            {
              projectname: "Project 1",
              projectsdescription:
                '<ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/product_category-painting-oil/">Oil painting</a> on Canvas</p></li><li><p>One of a kind artwork</p></li><li><p>Size: 35 x 45 x 2cm (unframed) / 35 x 45cm (actual image size)</p></li><li><p>Ready to hang</p></li><li><p>Signed on the front</p></li><li><p>Style: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/style-impressionistic/">Impressionistic</a></p></li><li><p>Subject: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/subject-architecture-cityscapes/">Architecture and cityscapes</a></p><p><br><strong>Original artwork description:</strong></p><p>Walking in Paris at night is always an exciting adventure. You are literally intoxicated by the atmosphere of the holiday and some kind of fun peculiar only to this city.<br>Every time you find something insanely interesting and picturesque.<br>The roll call of colored lights in Paris at night creates a unique, patterned mosaic.<br>The night windows of Paris create a truly fabulous pattern similar to an oriental carpet.<br>This artwork is made by traditional technology. Oil paints, canvas and linseed oil. I love to write etudes from life in a bright impressionistic manner. Small colorful strokes form a rainbow palette. I will try to convey the movement of air masses and the difference between illuminated and shady places.</p><p><strong>Materials used:</strong></p><p>Oil paints.</p></li></ul>',
              categoryid: "1",
              images: [
                "http://localhost:3001/api/project/image/1711142629764_WX20240322-171932@2x.png",
              ],
              userId: "65fdf5a2061bb0572f80d5cb",
              targetmoney: "3200",
              currentmoney: "351",
              enddate: "2024-04-12T04:00:00.000Z",
              startdate: "2024-03-22T21:23:56.530Z",
              participateduser: ["65fdf593061bb0572f80d5c4"],
              rewardlevel: [],
              rewardprice: ["10"],
              rewardcontent: ["A sticker"],
            },
            {
              projectname: "Project 2",
              projectsdescription:
                '<ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/product_category-painting-oil/">Oil painting</a> on Canvas</p></li><li><p>One of a kind artwork</p></li><li><p>Size: 35 x 45 x 2cm (unframed) / 35 x 45cm (actual image size)</p></li><li><p>Ready to hang</p></li><li><p>Signed on the front</p></li><li><p>Style: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/style-impressionistic/">Impressionistic</a></p></li><li><p>Subject: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/subject-architecture-cityscapes/">Architecture and cityscapes</a></p><p><br><strong>Original artwork description:</strong></p><p>Walking in Paris at night is always an exciting adventure. You are literally intoxicated by the atmosphere of the holiday and some kind of fun peculiar only to this city.<br>Every time you find something insanely interesting and picturesque.<br>The roll call of colored lights in Paris at night creates a unique, patterned mosaic.<br>The night windows of Paris create a truly fabulous pattern similar to an oriental carpet.<br>This artwork is made by traditional technology. Oil paints, canvas and linseed oil. I love to write etudes from life in a bright impressionistic manner. Small colorful strokes form a rainbow palette. I will try to convey the movement of air masses and the difference between illuminated and shady places.</p><p><strong>Materials used:</strong></p><p>Oil paints.</p></li></ul>',
              categoryid: "1",
              images: [
                "http://localhost:3001/api/project/image/1711142629764_WX20240322-171932@2x.png",
              ],
              userId: "65fdf5a2061bb0572f80d5cb",
              targetmoney: "3200",
              currentmoney: "351",
              enddate: "2024-04-12T04:00:00.000Z",
              startdate: "2024-03-22T21:23:56.530Z",
              participateduser: ["65fdf593061bb0572f80d5c4"],
              rewardlevel: [],
              rewardprice: ["10"],
              rewardcontent: ["A sticker"],
            },
          ],
        });
      }
    });

    render(
      <MemoryRouter>
        <ProjectFeatures />
      </MemoryRouter>
    );

    // Verify fetchData was called at least once
    await waitFor(() => expect(ApiService.fetchData).toHaveBeenCalled());

    // Check for the presence of category title and description in the document
    await waitFor(() => {
      expect(screen.getByTestId("category-title")).toHaveTextContent(
        "Test Category"
      );
      expect(screen.getByTestId("category-description")).toHaveTextContent(
        "Description of Test Category"
      );
    });

    // Check for the presence of project items in the document
    const project1Items = screen.getAllByText("Project 1");
    const project2Items = screen.getAllByText("Project 2");
    
    expect(project1Items.length).toBeGreaterThan(0);
    expect(project2Items.length).toBeGreaterThan(0);
  });
});
