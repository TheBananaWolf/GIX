import * as React from "react";
import ProjectDetail from "../../components/ProjectDetail";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter for testing navigation


jest.mock("../../components/views/AppAppBar", () => () => (
  <div data-testid="AppAppBar">AppAppBar</div>
));
jest.mock("../../components/views/ProjectInfo", () => () => (
  <div data-testid="ProjectInfo">ProjectInfo</div>
));
jest.mock("../../components/views/ProjectDescription", () => () => (
  <div data-testid="ProjectDescription">ProjectDescription</div>
));
jest.mock("../../components/views/AppFooter", () => () => (
  <div data-testid="AppFooter">AppFooter</div>
));

describe("ProjectDetail page", () => {
  it("should render the ProjectDetail component and its children", () => {
  
    render(
      <MemoryRouter>
        <ProjectDetail />
      </MemoryRouter>
    );

    expect(screen.getByTestId("AppAppBar")).toBeInTheDocument();
    expect(screen.getByTestId("ProjectInfo")).toBeInTheDocument();
    expect(screen.getByTestId("ProjectDescription")).toBeInTheDocument();
    expect(screen.getByTestId("AppFooter")).toBeInTheDocument();
  });
});
