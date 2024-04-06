import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ProjectBoxCardRecommend from "../../components/items/ProjectBoxCardRecommend";
import * as apiService from "../../services/apiService";

jest.mock("../../services/apiService", () => ({
  fetchImage: jest.fn().mockImplementation((url, callback) => {
    callback("mockedImageUrl");
  }),
  fetchData: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockUserProfile = {
  firstName: "John",
  lastName: "Doe",
  profilePic: "mockProfilePicUrl",
};

describe("ProjectBoxCardRecommend Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => "userToken");

    (apiService.fetchImage as jest.Mock).mockImplementation((_, callback) =>
      callback("mockedImageUrl")
    );
    (apiService.fetchData as jest.Mock).mockImplementation((_, __, callback) =>
      callback(mockUserProfile)
    );
  });
  const projectItemMock = {
    _id: "1",
    pid: "1",
    projectname: "Test Project",
    projectsdescription: "This is a test project description.",
    categoryid: "1",
    images: ["testImageUrl"],
    userId: "user",
    token: "userToken",
    targetmoney: "1000",
    currentmoney: "500",
    statue: true,
    enddate: new Date(),
    startdate: new Date(),
    rewardlevel: ["Level 1"],
    rewardprice: ["10"],
    rewardcontent: ["Thank you note"],
  };

  it("renders project details and fetches user profile and image correctly", async () => {
    render(<ProjectBoxCardRecommend projectItem={projectItemMock} index={0} />);

    await waitFor(() => {
      expect(apiService.fetchImage).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function)
      );
      expect(require("../../services/apiService").fetchData).toHaveBeenCalledWith(
        "/api/profile/getUserProfile",
        localStorage.getItem('userToken'),
        expect.any(Function)
      );
      expect(screen.getByRole("img", { name: /Producer/i })).toHaveAttribute(
        "src",
        mockUserProfile.profilePic
      );
      expect(
        screen.getByText(
          `${mockUserProfile.firstName} ${mockUserProfile.lastName}`
        )
      ).toBeInTheDocument();
    });
  });
  it("renders project details correctly", async () => {
    const { findByText } = render(
      <ProjectBoxCardRecommend projectItem={projectItemMock} index={0} />
    );

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test project description.")
      ).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const progressPercentageText = await screen.findByText(/50%/i);
    expect(progressPercentageText).toBeInTheDocument();
  });
});
