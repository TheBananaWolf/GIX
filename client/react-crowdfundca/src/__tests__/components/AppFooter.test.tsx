import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppFooter from "../../components/views/AppFooter";

describe("AppFooter component", () => {
  test("renders without crashing", () => {
    render(<AppFooter />);
    const footerElement = screen.getByTestId("app-footer");
    expect(footerElement).toBeInTheDocument();
  });

  test("contains social media links with correct hrefs", () => {
    render(<AppFooter />);
    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    expect(facebookLink).toHaveAttribute("href", "https://mui.com/");

    const twitterLink = screen.getByRole("link", { name: /X/i });
    expect(twitterLink).toHaveAttribute("href", "https://twitter.com/MUI_hq");
  });
  test("displays the correct copyright information", () => {
    render(<AppFooter />);
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText((content, node) => {
      const hasText = (node: Element | null) =>
        node?.textContent === `© Your Website ${currentYear}`;
      const nodeHasText = hasText(node);

      const childrenDontHaveText = Array.from(node?.children || []).every(
        (child) => !hasText(child)
      );

      return nodeHasText && childrenDontHaveText;
    });
    expect(copyrightText).toBeInTheDocument();
  });
  test("contains legal links with correct hrefs", () => {
    render(<AppFooter />);
    expect(screen.getByText("Terms")).toHaveAttribute("href", "/terms");
    expect(screen.getByText("Privacy")).toHaveAttribute("href", "/privacy");
  });

  test("renders a language selection dropdown", () => {
    render(<AppFooter />);
    const languageSelect = screen.getByRole("combobox");
    expect(languageSelect).toBeInTheDocument();
    expect(languageSelect).toHaveValue("en-US");
  });
});
