import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ProductHero from "../../components/views/ProductHero";
import "@testing-library/jest-dom";

jest.useFakeTimers();

jest.mock("../../components/views/ProductHeroLayout", () => {
  return ({
    sxBackground,
    children,
  }: {
    sxBackground: any;
    children: React.ReactNode;
  }) => (
    <div data-testid="mock-hero-layout" style={sxBackground}>
      {children}
    </div>
  );
});
const images = [
  {
    url: "https://images.squarespace-cdn.com/content/v1/631a15cef71d743070208dc1/63d07349-fb81-46ae-922a-313ca73d3647/Session-Studio-song-credits-app-header-image.jpg",
    title: "Snorkeling",
  },
  {
    url: "https://newxel.com/wp-content/uploads/2022/08/Game-development-studio.jpeg",
    title: "Massage",
  },
  {
    url: "https://c14.patreon.com/quxga_Patreon_Website_Module3_2_X_72dpi_Kamauu1_c26920eff8.jpg",
    title: "Hiking",
  },
  {
    url: "https://cdn2.veltra.com/ptr/20240218045653_1435704225_16070_0.jpg",
    title: "Hiking",
  },
  {
    url: "https://c14.patreon.com/20230901_Patreon_x_Kevin_33799_v1_f11c9ed4f1.jpg",
    title: "Hiking",
  },
  {
    url: "https://images.squarespace-cdn.com/content/v1/5980733286e6c0f4f499a4c3/1541611774031-3CH8UMW1CUWBNDWFATL0/IMG_6746.jpg?format=2500w",
    title: "Tour",
  },
];

it("should not attempt to cycle through images when there is only one item", () => {
  const singleImage = [images[0]];
  render(<ProductHero items={singleImage} />);
  expect(screen.getByTestId("mock-hero-layout")).toHaveStyle(
    `backgroundImage: url(${singleImage[0].url})`
  );
});
it("should cycle through images when there are more than one item", () => {
  jest.useFakeTimers();

  render(<ProductHero items={images} />);

  expect(screen.getByTestId("mock-hero-layout")).toHaveStyle(
    `backgroundImage: url(${images[0].url})`
  );
  for (let i = 0; i < images.length; i++) {
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("mock-hero-layout")).toHaveStyle(
      `backgroundImage: url(${images[(i + 1) % images.length].url})`
    );
  }
});
