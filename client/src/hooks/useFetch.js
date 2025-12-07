import { useState, useEffect } from 'react'
import api from '../services/api'

export default function useFetch(path) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get(path).then(res => {
      if (!mounted) return
      setData(res.data)
    }).catch(err => setError(err)).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [path])

  return { data, loading, error }
}
