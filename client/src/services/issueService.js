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
  }
}
