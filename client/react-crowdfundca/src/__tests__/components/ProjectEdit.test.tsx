import * as React from "react";
import ProjectEdit from "../../components/ProjectEdit"; // Adjust the import path as necessary
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../components/views/AppAppBar", () => () => (
  <div data-testid="AppAppBar">AppAppBar</div>
));
jest.mock("../../components/views/EditProjectInfo", () => () => (
  <div data-testid="EditProjectInfo">EditProjectInfo</div>
));
jest.mock("../../components/views/AppFooter", () => () => (
  <div data-testid="AppFooter">AppFooter</div>
));

describe("ProjectEdit page", () => {
  it("should render the ProjectEdit component and its children", () => {
    render(
      <MemoryRouter>
        <ProjectEdit />
      </MemoryRouter>
    );

    expect(screen.getByTestId("AppAppBar")).toBeInTheDocument();
    expect(screen.getByTestId("EditProjectInfo")).toBeInTheDocument();
    expect(screen.getByTestId("AppFooter")).toBeInTheDocument();
  });
});
