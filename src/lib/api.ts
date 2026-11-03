import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      error.message = 'Too many requests. Please wait and try again.';
    }
    return Promise.reject(error);
  }
);

// ─── Admin Auth ──────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  status: () => api.get('/auth/status'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// ─── Private Section Auth ────────────────────────────────────
export const privateAuthApi = {
  start: (sectionId: string) =>
    api.post('/private-auth/start', { sectionId }),
  answer: (sectionId: string, answer: string) =>
    api.post('/private-auth/answer', { sectionId, answer }),
  status: (sectionId: string) =>
    api.get(`/private-auth/status/${sectionId}`),
  lock: (sectionId: string) =>
    api.post(`/private-auth/lock/${sectionId}`),
  lockAll: () => api.post('/private-auth/lock-all'),
};

// ─── Photos ──────────────────────────────────────────────────
export const photosApi = {
  getAlbums: () => api.get('/photos/albums'),
  getPhotos: (albumId?: string) =>
    api.get('/photos', { params: albumId && albumId !== 'all' ? { albumId } : undefined }),
  getPhotoUrl: (photoId: string) => `${API_BASE}/photos/file/${photoId}`,
  uploadPhotos: (formData: FormData) =>
    api.post('/photos/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  createAlbum: (name: string, description?: string) =>
    api.post('/photos/albums', { name, description }),
  updatePhoto: (id: string, data: { caption?: string; date?: string; album_id?: string }) =>
    api.put(`/photos/${id}`, data),
  deletePhoto: (id: string) => api.delete(`/photos/${id}`),
};

// ─── Letters ─────────────────────────────────────────────────
export const lettersApi = {
  getAll: () => api.get('/letters'),
  getOne: (id: string) => api.get(`/letters/${id}`),
  getAllAdmin: () => api.get('/letters/admin/all'),
  create: (data: { title: string; content: string; date?: string; published?: boolean }) =>
    api.post('/letters', data),
  update: (id: string, data: Partial<{ title: string; content: string; date: string; published: boolean }>) =>
    api.put(`/letters/${id}`, data),
  delete: (id: string) => api.delete(`/letters/${id}`),
};

// ─── Diary ───────────────────────────────────────────────────
export const diaryApi = {
  getAll: (search?: string, sort?: string) =>
    api.get('/diary', { params: { search, sort } }),
  getOne: (id: string) => api.get(`/diary/${id}`),
  getAllAdmin: () => api.get('/diary/admin/all'),
  create: (data: { title: string; content: string; date?: string; draft?: boolean; mood?: string }) =>
    api.post('/diary', data),
  update: (id: string, data: Partial<{ title: string; content: string; date: string; draft: boolean; mood: string }>) =>
    api.put(`/diary/${id}`, data),
  delete: (id: string) => api.delete(`/diary/${id}`),
};

// ─── Moments ─────────────────────────────────────────────────
export const momentsApi = {
  getAll: () => api.get('/moments'),
  getPhotoUrl: (momentId: string) => `${API_BASE}/moments/photo/${momentId}`,
  getAnniversary: () => api.get('/moments/anniversary'),
  create: (formData: FormData) =>
    api.post('/moments', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, formData: FormData) =>
    api.put(`/moments/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/moments/${id}`),
  configureAnniversary: (data: { day?: number; month?: number; year?: number; message?: string; configured?: boolean }) =>
    api.put('/moments/anniversary/config', data),
};

// ─── Public UPSC Content ─────────────────────────────────────
export const upscApi = {
  getAnnouncements: () => api.get('/upsc/announcements'),
  getCurrentAffairs: (category?: string) =>
    api.get('/upsc/current-affairs', { params: category ? { category } : undefined }),
  getMockQuestions: (subject?: string, count?: number) =>
    api.get('/upsc/mock-questions', { params: { subject, count } }),
  getPrivateSections: () => api.get('/upsc/private-sections'),
};

// ─── Admin ───────────────────────────────────────────────────
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getSections: () => api.get('/admin/sections'),
  addSection: (data: { name: string; description?: string; icon?: string }) =>
    api.post('/admin/sections', data),
  updateSection: (id: string, data: Partial<{ name: string; description: string; enabled: boolean; order: number }>) =>
    api.put(`/admin/sections/${id}`, data),
  addAnnouncement: (data: { title: string; content: string; category?: string; pinned?: boolean }) =>
    api.post('/admin/announcements', data),
  getContent: () => api.get('/admin/content'),
};

export default api;

