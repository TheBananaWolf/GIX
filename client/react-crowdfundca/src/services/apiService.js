// apiService.js

// Function to make a GET request
export const fetchData = async (url, authToken, callback) => {
  try {
    if(!authToken)
      authToken = "";
    const response = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": authToken.startsWith("Bearer ") ? authToken : "Bearer " + authToken,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const responseData = await response.json();
    if (callback && typeof callback === "function") {
      callback(responseData);
    }
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function to make a GET image request
export const fetchImage = async (url, callback) => {
  try {
    const response = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "image/png",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    // Read the response as blob data
    const blob = await response.blob();

    // Create a URL for the blob data
    const receivedUrl = URL.createObjectURL(blob);
    if (callback && typeof callback === "function") {
      callback(receivedUrl);
    }
    return receivedUrl;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const submitData = async (url, formData, callback) => {
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error("Failed to submit data");
    }

    const responseData = await response.json();
    if (callback && typeof callback === "function") {
      callback(responseData);
    }
    return responseData;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
};

export const submitUploadData = async (url, formData, authToken, callback) => {
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      body: formData, 
      headers: {
        "authorization": "Bearer " + authToken,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to submit data");
    }

    const responseData = await response.json();
    if (callback && typeof callback === "function") {
      callback(responseData);
    }
    return responseData;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
};

export const spSubmitData = async (url, data, callback) => {
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const responseData = await response.json();
    if (callback && typeof callback === "function") {
      callback(responseData);
    }
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// 处理注册的submit
export const submitDataInJson = async (url, data, callback) => {
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Make sure to set the content type to application/json
      },
      body: JSON.stringify(data), // Make sure to stringify the data
    });

    let responseData;
    const contentType = response.headers.get('content-type'); // 检查响应的内容类型

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      // 如果不是JSON，就读取文本
      const responseText = await response.text();
      // 尝试将文本转换为对象，以便保持后续代码的一致性
      responseData = { message: responseText };
    }

    if (!response.ok) {
      // 无论响应类型是什么，我们都将错误信息作为对象抛出
      throw new Error(`Failed to submit data, server responded with: ${responseData.message}`);
    }


    // 打印响应数据来确认
    console.log("Received response data:", responseData);

    // 检查是否收到了token，并打印它
    if (responseData.token) {
      console.log("Received token:", responseData.token);
      localStorage.setItem('userToken', responseData.token); // Store the token in local storage
    }

    if (callback && typeof callback === "function") {
      callback(responseData);
    }
    return responseData;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
};


// 处理注册的submit
export const submitDataInJsonWithToken = async (url, data, callback) => {
  try {
    let authToken = localStorage.getItem('userToken');
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Make sure to set the content type to application/json
        "authorization": authToken.startsWith("Bearer ") ? authToken : "Bearer " + authToken,
      },
      body: JSON.stringify(data), // Make sure to stringify the data
    });

    let responseData;
    const contentType = response.headers.get('content-type'); // 检查响应的内容类型

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const responseText = await response.text();
      responseData = { message: responseText };
    }

    if (!response.ok) {
      throw new Error(`Failed to submit data, server responded with: ${responseData.message}`);
    }
    if (callback && typeof callback === "function") {
      callback(responseData);
    }
    return responseData;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
};

// Function to make a PUT request，处理个人信息更新
export const updateData = async (url, data, token) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 携带JWT token进行身份验证
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to update data, server responded with: ${responseData.message}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};