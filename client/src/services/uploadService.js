import api from './api'
import { authHeader } from './auth'

export default {
    uploadImage: async (file) => {
        const headers = authHeader()
        const formData = new FormData()
        formData.append('image', file)

        const res = await api.post('/upload/upload', formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data
    },

    uploadMultipleImages: async (files) => {
        const headers = authHeader()
        const formData = new FormData()

        files.forEach(file => {
            formData.append('images', file)
        })

        const res = await api.post('/upload/upload-multiple', formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data
    }
}
