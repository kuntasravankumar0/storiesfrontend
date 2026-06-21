import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Stories
export const storyAPI = {
  getAll: (page = 0, size = 12, sortBy) => api.get('/stories', { params: { page, size, sortBy } }),
  getById: (id) => api.get(`/stories/${id}`),
  getByGenre: (genre, page = 0, size = 12) => api.get(`/stories/genre/${genre}`, { params: { page, size } }),
  getByLanguage: (lang, page = 0, size = 12) => api.get(`/stories/language/${lang}`, { params: { page, size } }),
  getByReadingTime: (max, page = 0, size = 12) => api.get(`/stories/reading-time/${max}`, { params: { page, size } }),
  getTrending: () => api.get('/stories/trending'),
  getLatest: () => api.get('/stories/latest'),
  getMostLoved: () => api.get('/stories/most-loved'),
  getFeatured: () => api.get('/stories/featured'),
  search: (keyword, page = 0, size = 12) => api.get('/stories/search', { params: { keyword, page, size } }),
  getRecommendations: (genre) => api.get(`/stories/recommendations/${genre}`),
  love: (id) => api.post(`/stories/${id}/love`),
  bookmark: (id) => api.post(`/stories/${id}/bookmark`),
  rate: (id, value) => api.post(`/stories/${id}/rate`, { value }),
  updateProgress: (id, percentage) => api.post(`/stories/${id}/progress`, { percentage }),
  getMyLoved: () => api.get('/stories/my-loved'),
  getMyBookmarks: () => api.get('/stories/my-bookmarks'),
  getStatus: (id) => api.get(`/stories/${id}/status`),
  userCreate: (data) => api.post('/stories/user-create', data),
  getMyStories: () => api.get('/stories/my-stories'),
  updateProgress: (id, percentage) => api.post(`/stories/${id}/progress`, { percentage }),
};

// Audio Stories
export const audioAPI = {
  getAll: (page = 0, size = 12) => api.get('/audio-stories', { params: { page, size } }),
  getById: (id) => api.get(`/audio-stories/${id}`),
  getByGenre: (genre, page = 0, size = 12) => api.get(`/audio-stories/genre/${genre}`, { params: { page, size } }),
  getByLanguage: (lang, page = 0, size = 12) => api.get(`/audio-stories/language/${lang}`, { params: { page, size } }),
  getMostPlayed: () => api.get('/audio-stories/most-played'),
  search: (title, page = 0, size = 12) => api.get('/audio-stories/search', { params: { title, page, size } }),
  recordListen: (id) => api.post(`/audio-stories/${id}/listen`),
  userCreate: (data) => api.post('/audio-stories/user-create', data),
  getMyAudios: () => api.get('/audio-stories/my-audios'),
};

// Quotes
export const quoteAPI = {
  getAll: (page = 0, size = 12) => api.get('/quotes', { params: { page, size } }),
  getByCategory: (cat, page = 0, size = 12) => api.get(`/quotes/category/${cat}`, { params: { page, size } }),
  getPopular: () => api.get('/quotes/popular'),
  like: (id) => api.post(`/quotes/${id}/like`),
};

// Comments
export const commentAPI = {
  getByStory: (storyId) => api.get(`/comments/story/${storyId}`),
  add: (storyId, content) => api.post(`/comments/story/${storyId}`, { content }),
  getMyComments: () => api.get('/comments/my-comments'),
};

// User
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profilePictureUrl) => api.put('/users/profile', { profilePictureUrl }),
  blockSelf: () => api.post('/users/block-self'),
};

// Writer Profile
export const writerAPI = {
  getProfile: () => api.get('/writer-profile'),
};

// Social Links
export const socialAPI = {
  getAll: () => api.get('/social-links'),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  // Stories
  createStory: (data) => api.post('/admin/stories', data),
  updateStory: (id, data) => api.put(`/admin/stories/${id}`, data),
  deleteStory: (id) => api.delete(`/admin/stories/${id}`),
  getPendingStories: (page = 0, size = 20) => api.get('/admin/stories/pending', { params: { page, size } }),
  approveStory: (id) => api.put(`/admin/stories/${id}/approve`),
  rejectStory: (id) => api.delete(`/admin/stories/${id}/reject`),
  // Audio Stories
  createAudioStory: (data) => api.post('/admin/audio-stories', data),
  updateAudioStory: (id, data) => api.put(`/admin/audio-stories/${id}`, data),
  deleteAudioStory: (id) => api.delete(`/admin/audio-stories/${id}`),
  getPendingAudios: (page = 0, size = 20) => api.get('/admin/audio-stories/pending', { params: { page, size } }),
  approveAudio: (id) => api.put(`/admin/audio-stories/${id}/approve`),
  rejectAudio: (id) => api.delete(`/admin/audio-stories/${id}/reject`),
  // Quotes
  createQuote: (data) => api.post('/admin/quotes', data),
  updateQuote: (id, data) => api.put(`/admin/quotes/${id}`, data),
  deleteQuote: (id) => api.delete(`/admin/quotes/${id}`),
  // Comments
  getPendingComments: (page = 0, size = 20) => api.get('/admin/comments/pending', { params: { page, size } }),
  approveComment: (id) => api.put(`/admin/comments/${id}/approve`),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
  // Users
  getUsers: (page = 0, size = 20) => api.get('/admin/users', { params: { page, size } }),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Writer Profile
  updateWriterProfile: (data) => api.put('/admin/writer-profile', data),
  // Social Links
  createSocialLink: (data) => api.post('/admin/social-links', data),
  updateSocialLink: (id, data) => api.put(`/admin/social-links/${id}`, data),
  deleteSocialLink: (id) => api.delete(`/admin/social-links/${id}`),
};

export default api;
