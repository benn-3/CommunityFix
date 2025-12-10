import api from './api'
import { authHeader } from './auth'

export default {
  create: async (data) => {
    const headers = authHeader()
    const res = await api.post('/issues', data, { headers })
    return res.data
  },
  list: async () => {
    const res = await api.get('/issues')
    return res.data.issues
  },
  update: async (id, data) => {
    const headers = authHeader()
    const res = await api.put(`/issues/${id}`, data, { headers })
    return res.data.issue
  },
  // Categories
  getCategories: async () => {
    const res = await api.get('/categories')
    return res.data
  },
  createCategory: async (data) => {
    const headers = authHeader()
    const res = await api.post('/categories', data, { headers })
    return res.data
  },
  deleteCategory: async (id) => {
    const headers = authHeader()
    await api.delete(`/categories/${id}`, { headers })
  },
  // Issue interactions
  getById: async (id) => {
    const res = await api.get(`/issues/${id}`)
    return res.data
  },
  upvote: async (id) => {
    const headers = authHeader()
    const res = await api.post(`/issues/${id}/upvote`, {}, { headers })
    return res.data
  },
  addComment: async (id, text) => {
    const headers = authHeader()
    const res = await api.post(`/issues/${id}/comment`, { text }, { headers })
    return res.data
  }
}
