// Use environment variable for API URL, fallback to localhost for development
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';
export {baseUrl}