import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductHeroLayout from "../../components/views/ProductHeroLayout";
import { MemoryRouter } from "react-router-dom";

describe("ProductHeroLayout component", () => {

  beforeEach(() => {
      
    global.scrollTo = jest.fn();
  });
  afterEach(() => {
    
    jest.restoreAllMocks();
});
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <ProductHeroLayout sxBackground={{}}>
          <div>Test Child</div>
        </ProductHeroLayout>
      </MemoryRouter>
    );

    expect(screen.getByAltText("arrow down")).toBeInTheDocument();

    expect(screen.getByText("Test Child")).toBeInTheDocument();
    
  });
  test('should call window.scrollTo with correct parameters', () => {
    const handleArrowClick = () => {
      window.scrollTo({
        top: document.documentElement.clientHeight,
        behavior: 'smooth',
      });
    };


    handleArrowClick();

 
    expect(global.scrollTo).toHaveBeenCalledWith({
      top: document.documentElement.clientHeight,
      behavior: 'smooth',
    });
  });
});

  
