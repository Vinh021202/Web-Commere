import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const clearStoredAuth = () => {
  localStorage.removeItem("accesstoken");
  localStorage.removeItem("refreshToken");
};

const getAuthHeaders = (contentType = "application/json") => ({
  Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
  "Content-Type": contentType,
});

const shouldClearAuth = (status) => status === 401 || status === 403;

const buildErrorResponse = (error, fallbackMessage) => {
  const status = error?.response?.status;
  const isNetworkError = !error?.response;

  if (isNetworkError || shouldClearAuth(status)) {
    clearStoredAuth();
  }

  return {
    error: true,
    status,
    message:
      error?.response?.data?.message ||
      (isNetworkError
        ? "Server is unavailable. Stored token has been cleared."
        : fallbackMessage),
  };
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const postData = async (url, formData) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    const data = await safeJson(response);

    if (!response.ok && shouldClearAuth(response.status)) {
      clearStoredAuth();
    }

    return (
      data || {
        error: !response.ok,
        message: response.ok ? "Success" : "Request failed",
      }
    );
  } catch (error) {
    console.log(error);
    clearStoredAuth();
    return {
      error: true,
      message: "Server is unavailable. Stored token has been cleared.",
    };
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(apiUrl + url, {
      headers: getAuthHeaders(),
    });

    return data;
  } catch (error) {
    console.log(error);
    return buildErrorResponse(
      error,
      "Unable to load data. Stored token has been cleared.",
    );
  }
};

export const uploadImage = async (url, updatedData) => {
  try {
    return await axios.put(apiUrl + url, updatedData, {
      headers: getAuthHeaders("multipart/form-data"),
    });
  } catch (error) {
    console.error("uploadImage error:", error?.response?.data);
    return { data: buildErrorResponse(error, "Unable to upload image.") };
  }
};

export const uploadImages = async (url, formData) => {
  try {
    return await axios.post(apiUrl + url, formData, {
      headers: getAuthHeaders("multipart/form-data"),
    });
  } catch (error) {
    console.error("uploadImages error:", error?.response?.data);
    return { data: buildErrorResponse(error, "Unable to upload images.") };
  }
};

export const editData = async (url, updatedData) => {
  try {
    return await axios.put(apiUrl + url, updatedData, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("editData error:", error?.response?.data);
    return { data: buildErrorResponse(error, "Unable to update data.") };
  }
};

export const deleteImages = async (url, image) => {
  try {
    return await axios.delete(apiUrl + url, {
      headers: getAuthHeaders(),
      data: { img: image },
    });
  } catch (error) {
    console.error("deleteImages error:", error?.response?.data);
    return { data: buildErrorResponse(error, "Unable to delete image.") };
  }
};

export const deleteData = async (url) => {
  try {
    return await axios.delete(apiUrl + url, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("deleteData error:", error?.response?.data);
    return { data: buildErrorResponse(error, "Unable to delete data.") };
  }
};

export const deleteMultipleData = async (url, ids) => {
  try {
    return await axios({
      method: "delete",
      url: apiUrl + url,
      headers: getAuthHeaders(),
      data: { ids },
    });
  } catch (error) {
    console.error("deleteMultipleData error:", error?.response?.data);
    return {
      data: buildErrorResponse(error, "Unable to delete selected items."),
    };
  }
};
