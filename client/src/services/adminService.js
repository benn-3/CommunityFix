import api from './api'
import { authHeader } from './auth'

export default {
  getAnalytics: async () => {
    const headers = authHeader()
    const res = await api.get('/admin/analytics', { headers })
    return res.data
  },
  getWorkers: async () => {
    const headers = authHeader()
    const res = await api.get('/admin/workers', { headers })
    return res.data
  },
  deleteWorker: async (id) => {
    const headers = authHeader()
    await api.delete(`/admin/workers/${id}`, { headers })
  }
}
