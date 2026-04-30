// In production, requests go to the same domain (Nginx proxies /api/ to backend).
// In development, point to localhost:8082.
const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8082';

async function request(path, options = {}) {
  const response = await fetch(`${baseURL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.response = { data, status: response.status };
    throw error;
  }

  return { data };
}

const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export default api;
