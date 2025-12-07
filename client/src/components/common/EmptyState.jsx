export default function EmptyState({ message = 'Nothing here' }) {
  return <div className="empty">{message}</div>
}
