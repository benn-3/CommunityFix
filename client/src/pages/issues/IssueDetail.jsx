import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import issueService from '../../services/issueService'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function IssueDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [issue, setIssue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [commentText, setCommentText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadIssue()
    }, [id])

    async function loadIssue() {
        try {
            setLoading(true)
            const data = await issueService.getById(id)
            setIssue(data)
        } catch (err) {
            console.error(err)
            alert('Failed to load issue')
        } finally {
            setLoading(false)
        }
    }

    async function handleUpvote() {
        if (!user) {
            alert('Please login to upvote')
            return
        }
        try {
            const updated = await issueService.upvote(id)
            setIssue(updated)
        } catch (err) {
            console.error(err)
            alert('Failed to upvote')
        }
    }

    async function handleComment(e) {
        e.preventDefault()
        if (!user) {
            alert('Please login to comment')
            return
        }
        if (!commentText.trim()) return

        setSubmitting(true)
        try {
            const updated = await issueService.addComment(id, commentText)
            setIssue(updated)
            setCommentText('')
        } catch (err) {
            console.error(err)
            alert('Failed to add comment')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-10 text-center text-slate-500">Loading issue...</div>
    if (!issue) return <div className="p-10 text-center text-red-600">Issue not found</div>

    const hasUpvoted = user && issue.upvotes?.includes(user.id || user._id)
    const statusSteps = ['pending', 'approved', 'assigned', 'in_progress', 'resolved', 'closed']
    const currentStepIndex = statusSteps.indexOf(issue.status)

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                ← Back to Issues
            </button>

            {/* Issue Header */}
            <Card className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{issue.title}</h1>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">{issue.category}</span>
                            <span className={`px-3 py-1 rounded-full font-medium ${issue.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {issue.status.replace('_', ' ')}
                            </span>
                            {issue.location && <span className="text-slate-500">📍 {issue.location}</span>}
                        </div>
                    </div>

                    {/* Upvote Button */}
                    <button
                        onClick={handleUpvote}
                        className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${hasUpvoted
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-300 hover:border-blue-400 text-slate-600'
                            }`}
                    >
                        <span className="text-2xl">{hasUpvoted ? '👍' : '👍🏻'}</span>
                        <span className="text-xs font-bold mt-1">{issue.upvotes?.length || 0}</span>
                    </button>
                </div>

                {/* Status Progress */}
                <div className="my-6 p-4 bg-slate-50 rounded-lg">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Issue Progress</h3>
                    <div className="flex items-center justify-between">
                        {statusSteps.map((step, index) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index <= currentStepIndex
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-200 text-slate-400'
                                        }`}>
                                        {index < currentStepIndex ? '✓' : index + 1}
                                    </div>
                                    <span className={`text-xs mt-1 text-center ${index <= currentStepIndex ? 'text-slate-900 font-medium' : 'text-slate-400'
                                        }`}>
                                        {step.replace('_', ' ')}
                                    </span>
                                </div>
                                {index < statusSteps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 ${index < currentStepIndex ? 'bg-blue-600' : 'bg-slate-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Description</h3>
                    <p className="text-slate-600 leading-relaxed">{issue.description}</p>
                </div>

                {/* Photos */}
                {issue.photos && issue.photos.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-700 mb-2">Photos</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {issue.photos.map((photo, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={photo}
                                        alt={`Issue ${idx + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border border-slate-200"
                                        onError={(e) => {
                                            console.error('Image failed to load:', photo)
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif"%3EImage not available%3C/text%3E%3C/svg%3E'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reporter Info */}
                <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                    Reported by {issue.reporter?.name || issue.reporter?.email || 'Anonymous'} on {new Date(issue.createdAt).toLocaleDateString()}
                </div>
            </Card>

            {/* Comments Section */}
            <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Comments ({issue.comments?.length || 0})
                </h2>

                {/* Comment Form */}
                {user ? (
                    <form onSubmit={handleComment} className="mb-6">
                        <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Add your comment or suggestion..."
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            rows="3"
                        />
                        <div className="flex justify-end mt-2">
                            <Button type="submit" disabled={submitting || !commentText.trim()}>
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg text-center text-slate-600">
                        Please <a href="/login" className="text-blue-600 font-medium">login</a> to comment
                    </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                    {issue.comments && issue.comments.length > 0 ? (
                        issue.comments.map((comment, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {comment.user?.name?.[0] || comment.user?.email?.[0] || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-slate-900">{comment.user?.name || comment.user?.email || 'User'}</span>
                                            <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-700 text-sm">{comment.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-8">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </Card>
        </div>
    )
}
