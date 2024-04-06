import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppAppBar from "../../components/views/AppAppBar";
import * as apiService from "../../services/apiService";
import SeachInputBox from "../../components/items/SeachInputBox";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../../services/apiService", () => ({
  fetchData: jest.fn(),
}));

describe("AppAppBar component", () => {
  beforeEach(() => {
    (mockedNavigate as jest.Mock).mockReset();
  });
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AppAppBar />
      </MemoryRouter>
    );
  });

  test("renders categories and handles category click", async () => {
    const categoriesData = {
      categories: [
        { categoryname: "Arts", categoryid: "1" },
        { categoryname: "Comics & Illustration", categoryid: "2" },
        {
          categoryname: "Design&Tech",
          categoryid: "3",
        },
        { categoryname: "Film", categoryid: "4" },
        { categoryname: "Food&Craft", categoryid: "5" },
      ],
    };
    (apiService.fetchData as jest.Mock).mockImplementationOnce(
      (_url, _data, callback) => {
        callback(categoriesData);
      }
    );
    const { getByText, findByText } = render(
      <MemoryRouter>
        <AppAppBar />
      </MemoryRouter>
    );

    expect(require("../../services/apiService").fetchData).toHaveBeenCalledWith(
      "/api/project/getCategorys",
      "",
      expect.any(Function)
    );

    const signUpPageButton = await findByText(/Sign Up/i);
    expect(signUpPageButton).toBeInTheDocument();
    fireEvent.click(signUpPageButton);
    expect(getByText(/sign up/i)).toBeInTheDocument();


    const signInPageButton = await findByText(/Sign In/i);
    expect(signInPageButton).toBeInTheDocument();
    fireEvent.click(signInPageButton);
    expect(getByText(/sign in/i)).toBeInTheDocument();

    const homePageButton = await findByText(/G I X/i);
    expect(homePageButton).toBeInTheDocument();
    fireEvent.click(homePageButton);
    expect(window.location.pathname).toBe("/");

    const createNewPageButton = await findByText(/Create New/i);
    expect(createNewPageButton).toBeInTheDocument();
    fireEvent.click(createNewPageButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/project-edit");

    for (const category of categoriesData.categories) {
      const categoryButton = await screen.findByText(
        new RegExp(category.categoryname, "i")
      );
      expect(categoryButton).toBeInTheDocument();
      fireEvent.click(categoryButton);
      expect(mockedNavigate).toHaveBeenCalledWith("/project-list", {
        state: { categoryId: { categoryId: category.categoryid } },
      });
      mockedNavigate.mockClear();
    }
  });
});

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

describe(" ui elements in logged in state", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedNavigate.mockClear();
    localStorageMock.setItem("userToken", "token");
  });
  test("Display the logout button and user avatar when the user logs in", async () => {
    render(<AppAppBar />);

    expect(require("../../services/apiService").fetchData).toHaveBeenCalledWith(
      "/api/profile/getUserProfile",
      localStorageMock.getItem("userToken"),
      expect.any(Function)
    );
    expect(await screen.findByText("Logout")).toBeInTheDocument();

    const userProfilePic = screen.queryByAltText("User Profile Pic");

    if (userProfilePic) {
      expect(userProfilePic).toHaveAttribute(
        "src",
        "path/to/userProfilePic.jpg"
      );
    }
  });
});

describe("ui elements in unlogged state", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("Display login and registration links when the user is not logged in", async () => {
    const { findByText } = render(
      <MemoryRouter>
        <AppAppBar />
      </MemoryRouter>
    );
    const signInLink = await findByText("Sign In");
    expect(signInLink).toBeInTheDocument();
    fireEvent.click(signInLink);
    expect(signInLink).toHaveAttribute("href", "/sign-in");
    const signUpLink = await findByText("Sign Up");
    expect(signUpLink).toBeInTheDocument();
    fireEvent.click(signUpLink);
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });
});


describe("SeachInputBox Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input and icon", () => {
    render(
      <MemoryRouter>
        <SeachInputBox />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
    expect(screen.getByLabelText("search")).toBeInTheDocument();
  });

  test("updates input value on change", () => {
    render(
      <MemoryRouter>
        <SeachInputBox />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search…") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test search" } });
    expect(input.value).toBe("test search");
  });

  test("triggers search on Enter key press", () => {
    render(
      <MemoryRouter>
        <SeachInputBox />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search…");
    fireEvent.change(input, { target: { value: "test search" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(apiService.fetchData).toHaveBeenCalledWith(
      `/api/searchProjects?q=test search`,
      "",
      expect.any(Function)
    );
  });

  test("navigates to search results on successful search", async () => {
    (apiService.fetchData as jest.Mock).mockImplementationOnce((_, __, callback) => callback({}));
    render(
      <MemoryRouter>
        <SeachInputBox />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search…");
    fireEvent.change(input, { target: { value: "test search" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockedNavigate).toHaveBeenCalledWith(
      "/project-search-list",
      expect.objectContaining({
        state: expect.objectContaining({
          searchKeyword: expect.objectContaining({ inputVal: "test search" }),
        }),
      })
    );
  });
});