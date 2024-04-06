import {
  fetchData,
  submitData,
  updateData,
  fetchImage,
  submitUploadData,
  submitDataInJson,
  submitDataInJsonWithToken
} from '../../services/apiService';


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



describe('fetchData', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "mocked-blob-url");
  });

  it('sends a GET request with authToken and returns data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: 'mocked data'
      }),
    });

    const result = await fetchData('https://api.example.com/data', 'Bearer Token');
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": 'Bearer Token',
      },
    });
    expect(result).toEqual({
      data: 'mocked data'
    });
  });

  it('sends a GET request without authToken and returns data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: 'mocked data'
      }),
    });

    const result = await fetchData('https://api.example.com/data', '');
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer ",
      },
    });
    expect(result).toEqual({
      data: 'mocked data'
    });
  });

  it('throws an error when fetch fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false, // 模拟一个失败的响应
      json: async () => ({
        message: 'Error fetching data'
      }),
    });

    const url = 'https://api.example.com/data';

    await expect(fetchData(url, '')).rejects.toThrow('Failed to fetch data');

    consoleSpy.mockRestore();
  });
});

describe('submitData', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('sends a POST request with formData and receives a response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true
      }),
    });

    const formData = new FormData();
    formData.append('key', 'value');
    const result = await submitData('https://api.example.com/submit', formData);

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/submit', {
      method: "POST",
      body: formData,
    });
    expect(result).toEqual({
      success: true
    });
  });
});

describe('updateData', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('sends a PUT request with JSON data and token', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        updated: true
      }),
    });

    const data = {
      name: 'John Doe'
    };
    const result = await updateData('https://api.example.com/update', data, 'Token');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/update', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer Token`,
      },
      body: JSON.stringify(data),
    });
    expect(result).toEqual({
      updated: true
    });
  });
});

describe('fetchImage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.URL.createObjectURL = jest.fn(() => "mocked-blob-url");
  });

  it('sends a GET request and returns a blob URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['mocked blob'], {
        type: 'image/png'
      }),
    });

    const result = await fetchImage('https://api.example.com/image.png');
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/image.png', {
      method: "GET",
      headers: {
        "Content-Type": "image/png",
      },
    });
    expect(result).toBe("mocked-blob-url");
  });
});

describe('submitUploadData', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('sends formData with authToken and receives a response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true
      }),
    });

    const formData = new FormData();
    formData.append("file", new Blob(["dummy file data"], {
      type: "text/plain"
    }));
    const result = await submitUploadData('https://api.example.com/upload', formData, 'Token');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/upload', {
      method: "POST",
      body: formData,
      headers: {
        "authorization": `Bearer Token`,
      },
    });
    expect(result).toEqual({
      success: true
    });
  });
});


describe('submitDataInJson', () => {
  beforeEach(() => {
   
    jest.spyOn(console, 'log').mockImplementation(() => {}); 
    jest.spyOn(console, 'error').mockImplementation(() => {}); 
  });

  it('sends a POST request and handles JSON response', async () => {
    const mockData = {
      message: 'success',
      token: 'test'
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
      headers: {
        get: () => 'application/json',
      },
    });

    const result = await submitDataInJson('https://api.example.com/register', {
      username: 'test'
    });

    expect(result).toEqual(mockData);
  });

  it('handles non-JSON response and logs it', async () => {
    const mockText = "Success";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => mockText,
      headers: {
        get: () => 'text/plain',
      },
    });

    const result = await submitDataInJson('https://api.example.com/register', {
      username: 'test'
    });

    expect(result).toEqual({
      message: mockText
    });
  });

  it('throws an error when response is not ok', async () => {
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: () => Promise.resolve({
          message: 'Failed to register'
        }),
      })
    );

    await expect(submitDataInJson('https://api.example.com/register', {
        username: 'test'
      }))
      .rejects
      .toThrow('Failed to submit data, server responded with: Failed to register');
  });
});



describe('submitDataInJsonWithToken', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    window.localStorage.setItem("userToken", "mockToken");
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks(); 
  });
  
  it('successfully submits data and returns response data', async () => {
    const mockData = { message: 'Success' };
    const mockToken = 'mockToken';
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('application/json'),
        },
        json: () => Promise.resolve(mockData),
      })
    );

    const result = await submitDataInJsonWithToken('https://api.example.com/submit', { data: 'test' });

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/submit',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify({
          data: 'test'
        }),
      })
    );
  });
});