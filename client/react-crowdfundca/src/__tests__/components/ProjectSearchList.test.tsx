import ProjectSearchList from '../../components/ProjectSearchList';
import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";


jest.mock("../../components/views/AppAppBar", () => () => (
  <div data-testid="AppAppBar">AppAppBar</div>
));
jest.mock("../../components/views/ProjectSearchFeatures", () => () => (
  <div data-testid="ProjectSearchFeatures">ProjectSearchFeatures</div>
));
jest.mock("../../components/views/AppFooter", () => () => (
  <div data-testid="AppFooter">AppFooter</div>
));

describe("Index Component", () => {
  it("should render AppAppBar, ProjectSearchFeatures, and AppFooter components", () => {
    render(
      <MemoryRouter>
        <ProjectSearchList />
      </MemoryRouter>
    );

    expect(screen.getByTestId("AppAppBar")).toBeInTheDocument();
    expect(screen.getByTestId("ProjectSearchFeatures")).toBeInTheDocument();
    expect(screen.getByTestId("AppFooter")).toBeInTheDocument();
  });
});
