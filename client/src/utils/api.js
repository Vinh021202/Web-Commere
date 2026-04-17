import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const apiUrl = rawApiUrl.replace(/\/+$/, '');

const buildUrl = (url = '') => {
  if (!url) {
    return apiUrl;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return apiUrl ? `${apiUrl}${normalizedPath}` : normalizedPath;
};

const getAuthHeaders = (includeJsonContentType = false) => {
  const token = localStorage.getItem('accesstoken');
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (includeJsonContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const postData = async (url, formData) => {
  try {
    const response = await fetch(buildUrl(url), {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const params = {
      headers: getAuthHeaders(false),
    };

    const { data } = await axios.get(buildUrl(url), params);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const uploadImage = async (url, updatedData) => {
  const params = {
    headers: {
      ...getAuthHeaders(false),
      'Content-Type': 'multipart/form-data',
    },
  };

  try {
    const res = await axios.put(buildUrl(url), updatedData, params);
    return res;
  } catch (error) {
    console.error('uploadImage error:', error?.response?.data);
    return error?.response;
  }
};

export const editData = async (url, updatedData) => {
  const params = {
    headers: getAuthHeaders(true),
  };

  try {
    const res = await axios.put(buildUrl(url), updatedData, params);
    return res;
  } catch (error) {
    console.error('editData error:', error?.response?.data);
    return error?.response;
  }
};

export const deleteData = async (url) => {
  const params = {
    headers: getAuthHeaders(false),
  };

  const { res } = await axios.delete(buildUrl(url), params);
  return res;
};
