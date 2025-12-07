export default function handleError(err) {
  if (!err) return { message: 'Unknown error' }
  return { message: err?.response?.data?.message || err.message || 'Request failed' }
}
