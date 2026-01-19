import React, { useState } from 'react'
import styles from './CommentPanel.module.css'

export interface Comment {
  id: number
  text: string
  userId: number
  username: string
  position: number
  lineNumber: number
  resolved: boolean
  createdAt: Date
  reactions: { [emoji: string]: number }
  replies?: Comment[]
}

export interface CommentPanelProps {
  comments: Comment[]
  selectedRange: { start: number; end: number } | null
  onAddComment: (text: string) => void
  onResolveComment: (commentId: number) => void
  disabled?: boolean
}

export const CommentPanel: React.FC<CommentPanelProps> = ({
  comments,
  selectedRange,
  onAddComment,
  onResolveComment,
  disabled = false,
}) => {
  const [newCommentText, setNewCommentText] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())

  const handleAddComment = () => {
    if (!newCommentText.trim()) return
    onAddComment(newCommentText)
    setNewCommentText('')
    setShowCommentForm(false)
  }

  const toggleExpanded = (commentId: number) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Comments ({comments.length})</h3>
      </div>

      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <p className={styles.empty}>No comments yet. Select text to add one!</p>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              isExpanded={expandedComments.has(comment.id)}
              onToggleExpanded={() => toggleExpanded(comment.id)}
              onResolve={() => onResolveComment(comment.id)}
            />
          ))
        )}
      </div>

      {selectedRange && !disabled && (
        <div className={styles.formContainer}>
          {!showCommentForm ? (
            <button
              className={styles.addButton}
              onClick={() => setShowCommentForm(true)}
            >
              + Add comment
            </button>
          ) : (
            <div className={styles.form}>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                className={styles.input}
              />
              <div className={styles.formActions}>
                <button
                  className={styles.submitButton}
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim()}
                >
                  Comment
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setNewCommentText('')
                    setShowCommentForm(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface CommentThreadProps {
  comment: Comment
  isExpanded: boolean
  onToggleExpanded: () => void
  onResolve: () => void
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  isExpanded,
  onToggleExpanded,
  onResolve,
}) => {
  return (
    <div className={`${styles.comment} ${comment.resolved ? styles.resolved : ''}`}>
      <div className={styles.commentHeader}>
        <div className={styles.userInfo}>
          <span className={styles.username}>{comment.username}</span>
          <span className={styles.timestamp}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className={styles.actions}>
          {!comment.resolved && (
            <button
              className={styles.resolveButton}
              onClick={onResolve}
              title="Resolve comment"
            >
              ✓
            </button>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <button
              className={styles.expandButton}
              onClick={onToggleExpanded}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>
      </div>

      <p className={styles.text}>{comment.text}</p>

      {Object.entries(comment.reactions).length > 0 && (
        <div className={styles.reactions}>
          {Object.entries(comment.reactions).map(([emoji, count]) => (
            <span key={emoji} className={styles.reaction}>
              {emoji} {count}
            </span>
          ))}
        </div>
      )}

      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <div key={reply.id} className={styles.reply}>
              <div className={styles.replyAuthor}>{reply.username}</div>
              <div className={styles.replyText}>{reply.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

CommentPanel.displayName = 'CommentPanel'
