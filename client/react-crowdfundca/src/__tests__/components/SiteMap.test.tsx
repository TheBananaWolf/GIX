import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SiteMap from "../../components/views/SiteMap";
import { BrowserRouter } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("SiteMap Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders correctly with all category links", () => {
    render(<SiteMap />, { wrapper: BrowserRouter });

    expect(screen.getByText("Arts")).toBeInTheDocument();
    expect(screen.getByText("Comics & Illustration")).toBeInTheDocument();
    expect(screen.getByText("Design & Tech")).toBeInTheDocument();
    expect(screen.getByText("Film")).toBeInTheDocument();
    expect(screen.getByText("Food & Craft")).toBeInTheDocument();
  });

  it("navigates to the correct category page when a link is clicked", () => {
    render(<SiteMap />, { wrapper: BrowserRouter });

    fireEvent.click(screen.getByText("Arts"));
    expect(mockedNavigate).toHaveBeenCalledWith("/project-list", {
      state: { categoryId: { categoryId: "1" } },
    });

    mockedNavigate.mockClear();

    fireEvent.click(screen.getByText("Comics & Illustration"));
    expect(mockedNavigate).toHaveBeenCalledWith("/project-list", {
      state: { categoryId: { categoryId: "2" } },
    });

    mockedNavigate.mockClear();

    fireEvent.click(screen.getByText("Design & Tech"));
    expect(mockedNavigate).toHaveBeenCalledWith("/project-list", {
      state: { categoryId: { categoryId: "3" } },
    });

    mockedNavigate.mockClear();

    fireEvent.click(screen.getByText("Film"));
    expect(mockedNavigate).toHaveBeenCalledWith("/project-list", {
      state: { categoryId: { categoryId: "4" } },
    });

    mockedNavigate.mockClear();

    fireEvent.click(screen.getByText("Food & Craft"));
    expect(mockedNavigate).toHaveBeenCalledWith("/project-list", {
      state: { categoryId: { categoryId: "5" } },
    });

    mockedNavigate.mockClear();

    const aboutUsLink = screen.getByText("About Us");
    fireEvent.click(screen.getByText("About Us"));
    expect(aboutUsLink).toHaveAttribute("href", "https://www.mit.edu/");

    const CareerLink = screen.getByText("Career");
    fireEvent.click(screen.getByText("Career"));
    expect(CareerLink).toHaveAttribute("href", "https://www.mit.edu/");

    const ContactInfoLink = screen.getByText("Contact Info");
    fireEvent.click(screen.getByText("Contact Info"));
    expect(ContactInfoLink).toHaveAttribute("href", "https://www.mit.edu/");
  });
});
