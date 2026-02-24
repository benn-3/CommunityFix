import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import issueService from '../../services/issueService'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
    approved: { label: 'Approved', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
    assigned: { label: 'Assigned', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
    in_progress: { label: 'In Progress', bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
    resolved: { label: 'Resolved', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
    closed: { label: 'Closed', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
}

export default function IssueDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [issue, setIssue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [commentText, setCommentText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => { loadIssue() }, [id])

    async function loadIssue() {
        try {
            setLoading(true)
            const data = await issueService.getById(id)
            setIssue(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpvote() {
        if (!user) return alert('Please login to upvote')
        try {
            const updated = await issueService.upvote(id)
            setIssue(updated)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleComment(e) {
        e.preventDefault()
        if (!user) return alert('Please login to comment')
        if (!commentText.trim()) return
        setSubmitting(true)
        try {
            const updated = await issueService.addComment(id, commentText)
            setIssue(updated)
            setCommentText('')
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <div className="skeleton h-8 w-32 rounded-lg" />
            <div className="skeleton h-64 rounded-2xl" />
            <div className="skeleton h-48 rounded-2xl" />
        </div>
    )
    if (!issue) return (
        <div className="text-center py-20">
            <p className="text-4xl mb-3">😢</p>
            <p className="text-lg font-medium text-slate-600">Issue not found</p>
        </div>
    )

    const hasUpvoted = user && issue.upvotes?.includes(user.id || user._id)
    const statusSteps = ['pending', 'approved', 'assigned', 'in_progress', 'resolved', 'closed']
    const currentStepIndex = statusSteps.indexOf(issue.status)
    const sc = statusConfig[issue.status] || statusConfig.pending

    return (
        <div className="w-full max-w-4xl mx-auto space-y-5">
            {/* Back */}
            <button onClick={() => navigate(-1)} className="text-sm text-slate-400 hover:text-navy-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
            </button>

            {/* Main Card */}
            <Card className="p-6 md:p-8" hover={false}>
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-5">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-navy-900 mb-2.5">{issue.title}</h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold">{issue.category}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${sc.bg} ${sc.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                {sc.label}
                            </span>
                            {issue.location && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {issue.location}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Upvote */}
                    <button
                        onClick={handleUpvote}
                        className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${hasUpvoted
                                ? 'border-navy-500 bg-navy-50 text-navy-700'
                                : 'border-slate-200 hover:border-navy-300 text-slate-500 hover:text-navy-600'
                            }`}
                    >
                        <svg className="w-5 h-5" fill={hasUpvoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                        <span className="text-xs font-bold mt-1">{issue.upvotes?.length || 0}</span>
                    </button>
                </div>

                {/* Progress */}
                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                    <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Progress</h3>
                    <div className="flex items-center justify-between">
                        {statusSteps.map((step, index) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${index <= currentStepIndex
                                            ? 'bg-navy-700 text-white shadow-sm'
                                            : 'bg-slate-200 text-slate-400'
                                        }`}>
                                        {index < currentStepIndex ? '✓' : index + 1}
                                    </div>
                                    <span className={`text-[10px] mt-1.5 text-center leading-tight ${index <= currentStepIndex ? 'text-navy-900 font-medium' : 'text-slate-400'
                                        }`}>
                                        {step.replace('_', ' ')}
                                    </span>
                                </div>
                                {index < statusSteps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1.5 rounded ${index < currentStepIndex ? 'bg-navy-700' : 'bg-slate-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Description</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{issue.description}</p>
                </div>

                {/* Photos */}
                {issue.photos && issue.photos.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Photos</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {issue.photos.map((photo, idx) => (
                                <img
                                    key={idx}
                                    src={photo}
                                    alt={`Issue ${idx + 1}`}
                                    className="w-full h-48 object-cover rounded-xl border border-slate-200"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif"%3EImage not available%3C/text%3E%3C/svg%3E'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Reporter */}
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-500">
                        {issue.reporter?.name?.[0] || '?'}
                    </div>
                    Reported by <span className="font-medium text-slate-500">{issue.reporter?.name || issue.reporter?.email || 'Anonymous'}</span> on {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </Card>

            {/* Comments */}
            <Card className="p-6" hover={false}>
                <h2 className="text-lg font-bold text-navy-900 mb-5 flex items-center gap-2">
                    Comments
                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{issue.comments?.length || 0}</span>
                </h2>

                {user ? (
                    <form onSubmit={handleComment} className="mb-6">
                        <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Add your comment…"
                            className="w-full p-3.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 bg-slate-50 focus:bg-white transition-all"
                            rows="3"
                        />
                        <div className="flex justify-end mt-2">
                            <Button variant="primary" size="sm" type="submit" disabled={submitting || !commentText.trim()}>
                                {submitting ? 'Posting…' : 'Post Comment'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl text-center text-sm text-slate-500">
                        Please <a href="/login" className="text-navy-700 font-semibold hover:underline">sign in</a> to comment
                    </div>
                )}

                <div className="space-y-3">
                    {issue.comments && issue.comments.length > 0 ? (
                        issue.comments.map((comment, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-700 to-teal-600 text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                        {comment.user?.name?.[0] || comment.user?.email?.[0] || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-navy-900">{comment.user?.name || comment.user?.email || 'User'}</span>
                                            <span className="text-[11px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-400 text-sm py-10">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </Card>
        </div>
    )
}
