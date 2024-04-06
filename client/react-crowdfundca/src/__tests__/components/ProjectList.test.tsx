import * as React from "react";
import ProjectList from "../../components/ProjectList"; // Adjust the import path as necessary
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";

// Mocking the child components
jest.mock("../../components/views/AppAppBar", () => () => (
  <div data-testid="AppAppBar">AppAppBar</div>
));
jest.mock("../../components/views/ProjectFeatures", () => () => (
  <div data-testid="ProjectFeatures">ProjectFeatures</div>
));
jest.mock("../../components/views/AppFooter", () => () => (
  <div data-testid="AppFooter">AppFooter</div>
));

describe("Index page with ProjectFeatures", () => {
  it("renders the Index component and its children", () => {
    // Render the Index component inside MemoryRouter
    render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>
    );

    // Assert each mocked child component is rendered
    expect(screen.getByTestId("AppAppBar")).toBeInTheDocument();
    expect(screen.getByTestId("ProjectFeatures")).toBeInTheDocument();
    expect(screen.getByTestId("AppFooter")).toBeInTheDocument();
  });
});
