import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductTopics from "../../components/views/ProductTopics";
import * as apiService from "../../services/apiService";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../../services/apiService");

const mockImagesData = [
  {
    url: "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=400",
    title: "ARTS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?auto=format&fit=crop&w=400",
    title: "TOYS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400",
    title: "GAMES",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=400",
    title: "FILMS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1523309996740-d5315f9cc28b?auto=format&fit=crop&w=400",
    title: "OUTDOORS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=400",
    title: "DIY",
    width: "33%",
  },
];
describe("ProductCategories Component Tests", () => {
  beforeEach(() => {
    mockedNavigate.mockReset();
    (apiService.fetchData as jest.Mock).mockClear();
  });

  it("renders correctly and displays all category images and titles", async () => {
    (apiService.fetchData as jest.Mock).mockResolvedValue(mockImagesData);

    render(<ProductTopics />);

    await waitFor(() => {
      mockImagesData.forEach(async (data) => {
        expect(await screen.findByText(data.title)).toBeInTheDocument();
      });
    });
  });
  it("calls handleCategoryClick with correct argument when a category title is clicked", async () => {
    (apiService.fetchData as jest.Mock).mockResolvedValue(mockImagesData);

    render(<ProductTopics />);

    for (const data of mockImagesData) {
      await waitFor(() => {
        expect(screen.getByText(data.title)).toBeInTheDocument();
      });
    }
    await waitFor(() => {
      (apiService.fetchData as jest.Mock).mockImplementation(
        (_url, _body, callback) => {
          callback({
            values:{
              projectInfo: [],
            },
            val: "ART",
          });
        }
      );
      fireEvent.click(screen.getByText(mockImagesData[0].title));
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/project-search-list",
        expect.objectContaining({
          state: expect.objectContaining({
            searchKeyword: expect.objectContaining({
              inputVal: expect.any(String),
            }),
          }),
        })
      );
    });
  });
});
