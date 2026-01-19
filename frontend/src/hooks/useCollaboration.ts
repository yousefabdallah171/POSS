import { useCallback, useEffect, useRef, useState } from 'react'

export interface Participant {
  userId: number
  username: string
  color: string
  isActive: boolean
}

export interface RemoteCursor {
  userId: number
  username: string
  position: number
  line: number
  column: number
  color: string
  timestamp: Date
}

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

export interface EditOperation {
  type: 'insert' | 'delete' | 'retain'
  operation: 'insert' | 'delete' | 'retain'
  position: number
  content: string
  length: number
}

export interface UseCollaborationReturn {
  isConnected: boolean
  sessionId: string | null
  participants: Participant[]
  remoteCursors: RemoteCursor[]
  comments: Comment[]
  error: Error | null
  sendEdit: (operation: EditOperation) => void
  updateCursor: (position: number, line: number, column: number) => void
  addComment: (text: string, position: number, lineNumber: number) => void
  resolveComment: (commentId: number) => void
}

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1'
const WS_BASE_URL = (process.env.REACT_APP_WS_URL || 'ws://localhost:8080').replace('http', 'ws')

/**
 * useCollaboration hook for real-time collaborative editing
 *
 * @param resourceId - The resource ID (component or theme)
 * @param resourceType - Type of resource ('component' or 'theme')
 * @returns Collaboration state and functions
 *
 * @example
 * const {
 *   participants,
 *   remoteCursors,
 *   comments,
 *   sendEdit,
 * } = useCollaboration(123, 'component')
 */
export function useCollaboration(
  resourceId: number,
  resourceType: 'component' | 'theme'
): UseCollaborationReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState<Error | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Connect to WebSocket
  useEffect(() => {
    const connect = () => {
      try {
        const url = new URL(`${WS_BASE_URL}/ws/collaborate/${resourceId}`)
        url.searchParams.set('type', resourceType)
        if (sessionId) {
          url.searchParams.set('session_id', sessionId)
        }

        const ws = new WebSocket(url.toString())

        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          setError(null)
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            handleMessage(message)
          } catch (err) {
            console.error('Failed to parse message:', err)
          }
        }

        ws.onclose = () => {
          console.log('WebSocket closed')
          setIsConnected(false)
          scheduleReconnect()
        }

        ws.onerror = (event) => {
          console.error('WebSocket error:', event)
          setError(new Error('WebSocket connection error'))
        }

        wsRef.current = ws

        // Setup ping/pong
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }))
          }
        }, 30000)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Connection failed'))
        scheduleReconnect()
      }
    }

    const scheduleReconnect = () => {
      reconnectTimeoutRef.current = setTimeout(connect, 3000)
    }

    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [resourceId, resourceType, sessionId])

  // Handle incoming messages
  const handleMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'session_info':
        setSessionId(message.session_id)
        break

      case 'user_joined':
        setParticipants((prev) => [
          ...prev,
          {
            userId: message.user_id,
            username: message.username,
            color: message.color,
            isActive: true,
          },
        ])
        break

      case 'user_left':
        setParticipants((prev) => prev.filter((p) => p.userId !== message.user_id))
        setRemoteCursors((prev) => prev.filter((c) => c.userId !== message.user_id))
        break

      case 'edit':
        // Broadcast edit event - would update content in editor
        break

      case 'cursor':
        setRemoteCursors((prev) => {
          const filtered = prev.filter((c) => c.userId !== message.user_id)
          return [
            ...filtered,
            {
              userId: message.user_id,
              username: message.username,
              position: message.position,
              line: message.line,
              column: message.column,
              color: message.color,
              timestamp: new Date(message.timestamp),
            },
          ]
        })
        break

      case 'comment':
        setComments((prev) => {
          const existing = prev.find((c) => c.id === message.comment.id)
          if (existing) {
            return prev.map((c) => (c.id === message.comment.id ? message.comment : c))
          }
          return [...prev, message.comment]
        })
        break

      case 'pong':
        // Pong received
        break

      case 'error':
        setError(new Error(message.error))
        break
    }
  }, [])

  // Send edit operation
  const sendEdit = useCallback((operation: EditOperation) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    wsRef.current.send(
      JSON.stringify({
        type: 'edit',
        operation: operation.operation,
        position: operation.position,
        content: operation.content,
        length: operation.length,
      })
    )
  }, [])

  // Update cursor position
  const updateCursor = useCallback((position: number, line: number, column: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

    wsRef.current.send(
      JSON.stringify({
        type: 'cursor',
        position,
        line,
        column,
      })
    )
  }, [])

  // Add comment
  const addComment = useCallback((text: string, position: number, lineNumber: number) => {
    if (!sessionId) return

    fetch(`${API_BASE_URL}/collaboration/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        resource_id: resourceId,
        resource_type: resourceType,
        position,
        line_number: lineNumber,
        text,
      }),
    }).catch((err) => {
      console.error('Failed to add comment:', err)
      setError(err)
    })
  }, [sessionId, resourceId, resourceType])

  // Resolve comment
  const resolveComment = useCallback((commentId: number) => {
    fetch(`${API_BASE_URL}/collaboration/comments/${commentId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((err) => {
      console.error('Failed to resolve comment:', err)
      setError(err)
    })
  }, [])

  return {
    isConnected,
    sessionId,
    participants,
    remoteCursors,
    comments,
    error,
    sendEdit,
    updateCursor,
    addComment,
    resolveComment,
  }
}
