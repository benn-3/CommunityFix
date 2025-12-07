import useFetch from '../../hooks/useFetch'

export default function UserDashboard() {
  const { data, loading } = useFetch('/issues')
  if (loading) return <p>Loading...</p>
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Open issues: {data?.issues?.length || 0}</p>
    </div>
  )
}
