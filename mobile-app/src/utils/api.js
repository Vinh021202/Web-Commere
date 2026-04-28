export const API_BASE_KEY = 'web-commerce-mobile-api';

export function getApiBase() {
  const params = new URLSearchParams(window.location.search);
  const apiFromUrl = params.get('api');

  if (apiFromUrl) {
    const cleanApi = apiFromUrl.replace(/\/+$/, '');
    localStorage.setItem(API_BASE_KEY, cleanApi);
    return cleanApi;
  }

  return (localStorage.getItem(API_BASE_KEY) || 'http://localhost:8000').replace(/\/+$/, '');
}

export async function fetchJson(apiBase, path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3500);
  const headers = { ...(options.headers || {}) };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      signal: controller.signal,
      headers
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}
