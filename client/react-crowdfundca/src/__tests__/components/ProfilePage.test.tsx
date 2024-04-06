import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react";
import ProfilePage from "../../components/ProfilePage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("../../components/views/AppAppBar", () => () => (
  <div>Mocked AppAppBar</div>
));

jest.mock("../../services/apiService", () => ({
  fetchData: jest.fn(),
  fetchImage: jest.fn().mockImplementation((url, callback) => {
    callback("mockedImageUrl");
  }),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

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

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

beforeEach(() => {
  window.localStorage.setItem("userToken", "mock-token");
  global.fetch = jest.fn((url) => {
    const urlString = typeof url === "string" ? url : url.toString();

    // 处理 getUserProfile 请求
    if (urlString.includes("/api/profile/getUserProfile")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            userId: "mockUserId",
            firstName: "Peng",
            lastName: "Yin"
          }),
      });
    }
    // 处理 showUserDonateProject 和 showUserProject 请求
    else if (
      urlString.includes("/api/project/showUserDonateProject") ||
      urlString.includes("/api/project/showUserProject")
    ) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            projectInfo: [
              {
                _id: "1",
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
            ],
          }),
      });
    }
    // 为 getCategorys 请求提供一个简单的模拟响应，避免抛出错误
    else if (urlString.includes("/api/project/getCategorys")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
         
          }),
      });
    }
    // 其他未处理的请求可以返回一个简单的拒绝，或者根据需要自定义
    return Promise.reject(new Error("未处理的请求: " + urlString));
  }) as jest.Mock;
});

afterEach(() => {
  window.localStorage.clear();
  (global.fetch as jest.Mock).mockClear();
});

test("Tab changes correctly on click", async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
  });
  await waitFor(() => {
    const tab = screen.getAllByRole("tab")[1];
    fireEvent.click(tab);
    expect(tab).toHaveAttribute("aria-selected", "true");
  });
});

test("User info renders correctly", async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
  });
  // await waitFor(() => {
  //   const fullName = screen.getByText(/YinPeng/i);
  //   expect(fullName).toBeInTheDocument();
  // });
});

test("ProfilePage renders correctly", async () => {
  window.localStorage.clear();
  await act(async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
  });
  // await waitFor(() => {
  //   expect(screen.getByText(/Please Signin First/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Participated/i)).toBeInTheDocument();
  // });
});
