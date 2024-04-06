import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ProductHowItWorks from "../../components/views/ProductHowItWorks";

describe("ProductHowItWorks Component Tests", () => {
  it("should render the component and display the main heading", () => {
    render(<ProductHowItWorks />);

    const heading = screen.getByRole("heading", { name: /How it works/i });
    expect(heading).toBeInTheDocument();
  });

  it("should display all the steps with descriptions and images", () => {
    render(<ProductHowItWorks />);


    const images = ["suitcase", "graph", "clock"];
    images.forEach((altText) => {
      const image = screen.getByAltText(altText);
      expect(image).toBeInTheDocument();
    });

  
    const stepDescriptions = [
      "New projects every week",
      "First come, first served. Our offers are in limited quantities, so be quick.",
      "New experiences, new surprises.",
    ];

    stepDescriptions.forEach((description) => {
      const stepDescription = screen.getByText(description);
      expect(stepDescription).toBeInTheDocument();
    });
  });

  it('should display the "Get started" button with correct link', () => {
    render(<ProductHowItWorks />);

    const getStartedButton = screen.getByText(/Get started/i);
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute("href", "/sign-up");
  });
});
