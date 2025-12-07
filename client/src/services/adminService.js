import api from './api'

export default {
  // placeholder for admin endpoints
  approveIssue: async (id) => api.post(`/admin/issues/${id}/approve`)
}
