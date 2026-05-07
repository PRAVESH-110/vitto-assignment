import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const createApplication = async (data) => {
  try {
    const response = await api.post('/applications', data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getApplication = async (id) => {
  try {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('An unexpected error occurred');
  }
};

export async function warmUpBackend() {
  try {
    let apiUrl = import.meta.env.VITE_API_URL || 'https://vitto-assignment-c7a8.onrender.com'; // Fallback to production URL

    // Remove trailing slash if present
    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1);
    }

    // Construct base URL by removing '/api' suffix if present to hit root /health
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

    console.log(`Warming up backend at ${baseUrl}/api/health...`);

    await axios.get(
      baseUrl + "/api/health",
      { timeout: 8000 } // Short timeout to not block too long
    );
    console.log("Backend warm-up successful");
  } catch (e) {
    console.warn("Backend warm-up failed (non-fatal):", e.message);
  }
}
