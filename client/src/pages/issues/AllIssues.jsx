import useFetch from '../../hooks/useFetch'

export default function AllIssues() {
  const { data, loading } = useFetch('/issues')
  if (loading) return <p>Loading...</p>
  const issues = data?.issues || []
  return (
    <div>
      <h2>All Issues</h2>
      <ul>
        {issues.map(i => (
          <li key={i._id}>{i.title} — {i.status}</li>
        ))}
      </ul>
    </div>
  )
}
