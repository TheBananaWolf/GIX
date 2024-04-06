import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ProjectBoxCardForHots from "../../components/items/ProjectBoxCardForHots";
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

describe("ProjectBoxCardForHots Component", () => {
  const projectItemMock = {
    _id: "1",
    pid: "1",
    projectname: "Test Project",
    projectsdescription: "<p>This is a <b>test</b> project.</p>",
    categoryid: "1",
    images: ["http://example.com/image.jpg"],
    userId: "user123",
    token: "token123",
    targetmoney: "1000",
    currentmoney: "500",
    statue: true,
    enddate: new Date("2024-12-31"),
    startdate: new Date("2024-01-01"),
    rewardlevel: ["Level 1"],
    rewardprice: ["10"],
    rewardcontent: ["Thank you note"],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (apiService.fetchImage as jest.Mock).mockImplementation((_, callback) =>
      callback("http://example.com/image.jpg")
    );
    (apiService.fetchData as jest.Mock).mockImplementation((_, __, callback) =>
      callback({
        firstName: "John",
        lastName: "Doe",
        profilePic: "http://example.com/profile.jpg",
      })
    );

    Storage.prototype.getItem = jest.fn(() => "userToken");
  });

  it("renders project information correctly", async () => {
    render(<ProjectBoxCardForHots projectItem={projectItemMock} index={0} />);

    expect(await screen.findByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText(/This is a test project\./i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Producer/i })).toHaveAttribute(
      "src",
      "http://example.com/profile.jpg"
    );
  });
});
