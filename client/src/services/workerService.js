import api from './api'

export default {
  // placeholder for worker endpoints
  assignTask: async (taskId, workerId) => api.post(`/worker/tasks/${taskId}/assign`, { workerId })
}
