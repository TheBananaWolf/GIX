import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCategoriesForHots from "../../components/views/ProductCategoriesForHots";
import * as apiService from "../../services/apiService";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../services/apiService", () => ({
  fetchData: jest.fn(),
  fetchImage: jest.fn().mockImplementation((url, callback) => {
    callback("mockedImageUrl"); 
  }),
}));

const projectInfo = [
  {
    projectname: "Bright Evening",
    projectsdescription:
      '<ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/product_category-painting-oil/">Oil painting</a> on Canvas</p></li><li><p>One of a kind artwork</p></li><li><p>Size: 35 x 45 x 2cm (unframed) / 35 x 45cm (actual image size)</p></li><li><p>Ready to hang</p></li><li><p>Signed on the front</p></li><li><p>Style: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/style-impressionistic/">Impressionistic</a></p></li><li><p>Subject: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/subject-architecture-cityscapes/">Architecture and cityscapes</a></p><p><br><strong>Original artwork description:</strong></p><p>Walking in Paris at night is always an exciting adventure. You are literally intoxicated by the atmosphere of the holiday and some kind of fun peculiar only to this city.<br>Every time you find something insanely interesting and picturesque.<br>The roll call of colored lights in Paris at night creates a unique, patterned mosaic.<br>The night windows of Paris create a truly fabulous pattern similar to an oriental carpet.<br>This artwork is made by traditional technology. Oil paints, canvas and linseed oil. I love to write etudes from life in a bright impressionistic manner. Small colorful strokes form a rainbow palette. I will try to convey the movement of air masses and the difference between illuminated and shady places.</p><p><strong>Materials used:</strong></p><p>Oil paints.</p></li></ul>',
    categoryid: "1",
    images: [
      "http://localhost:3001/api/project/image/1711142629764_WX20240322-171932@2x.png",
    ],
    userId: "65fdf5a2061bb0572f80d5cb",
    targetmoney: "3200",
    currentmoney: "351",
    enddate: "2024-04-12T04:00:00.000Z",
    startdate: "2024-03-22T21:23:56.530Z",
    participateduser: ["65fdf593061bb0572f80d5c4"],
    rewardlevel: [],
    rewardprice: ["10"],
    rewardcontent: ["A sticker"],
  },
  {
    projectname: "Bright Evening",
    projectsdescription:
      '<ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/product_category-painting-oil/">Oil painting</a> on Canvas</p></li><li><p>One of a kind artwork</p></li><li><p>Size: 35 x 45 x 2cm (unframed) / 35 x 45cm (actual image size)</p></li><li><p>Ready to hang</p></li><li><p>Signed on the front</p></li><li><p>Style: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/style-impressionistic/">Impressionistic</a></p></li><li><p>Subject: <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.artfinder.com/art/subject-architecture-cityscapes/">Architecture and cityscapes</a></p><p><br><strong>Original artwork description:</strong></p><p>Walking in Paris at night is always an exciting adventure. You are literally intoxicated by the atmosphere of the holiday and some kind of fun peculiar only to this city.<br>Every time you find something insanely interesting and picturesque.<br>The roll call of colored lights in Paris at night creates a unique, patterned mosaic.<br>The night windows of Paris create a truly fabulous pattern similar to an oriental carpet.<br>This artwork is made by traditional technology. Oil paints, canvas and linseed oil. I love to write etudes from life in a bright impressionistic manner. Small colorful strokes form a rainbow palette. I will try to convey the movement of air masses and the difference between illuminated and shady places.</p><p><strong>Materials used:</strong></p><p>Oil paints.</p></li></ul>',
    categoryid: "1",
    images: [
      "http://localhost:3001/api/project/image/1711142629764_WX20240322-171932@2x.png",
    ],
    userId: "65fdf5a2061bb0572f80d5cb",
    targetmoney: "3200",
    currentmoney: "351",
    enddate: "2024-04-12T04:00:00.000Z",
    startdate: "2024-03-22T21:23:56.530Z",
    participateduser: ["65fdf593061bb0572f80d5c4"],
    rewardlevel: [],
    rewardprice: ["10"],
    rewardcontent: ["A sticker"],
  },
];

const localStorageMock = (function () {
  let store: any = {};
  return {
    getItem: function (key: any) {
      return store[key] || null;
    },
    setItem: function (key: any, value: any) {
      store[key] = value.toString();
    },
    removeItem: function (key: any) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("ProductCategories component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.setItem("userToken", "token");
    (apiService.fetchData as jest.Mock).mockImplementationOnce(
      (_, __, callback) => {
        callback({ projectInfo });
      }
    );
  });

  test("renders without crashing", async () => {
    render(
      <MemoryRouter>
        <ProductCategoriesForHots />
      </MemoryRouter>
    );
    expect(
      await screen.findByTestId("product-categories-for-hot")
    ).toBeInTheDocument();
  });

  test("initially displays the correct number of projects", async () => {
    render(
      <MemoryRouter>
        <ProductCategoriesForHots />
      </MemoryRouter>
    );

    expect(apiService.fetchData).toHaveBeenCalledWith(
      "/api/project/showProjectBy?queryKey=categoryid&value=1",
      "token",
      expect.any(Function)
    );
    
    await waitFor(() => {
      expect(screen.getAllByText(/Bright Evening/i)).toHaveLength(2);
    });
  });

  test('loads more projects on "LOAD MORE" button click', async () => {
    render(
      <MemoryRouter>
        <ProductCategoriesForHots />
      </MemoryRouter>
    );

    expect(await screen.findAllByText(/Bright Evening/i)).toHaveLength(2);

    waitFor(() => async () => {
      const loadMoreButton = screen.getByText(/LOAD MORE/i);
      fireEvent.click(loadMoreButton);

      (apiService.fetchData as jest.Mock).mockImplementationOnce(
        (_, __, callback) => {
          callback({ projectInfo: [...projectInfo, ...projectInfo] });
        }
      );

      expect(screen.getAllByText(/Bright Evening/i)).toHaveLength(4);
    });
  });
});
