"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Send, Plus, Loader2 } from "lucide-react"
import ChatHeader from "@/components/chat/chat-header"
import { useChatHistory, useChatMessages, useCreateThread } from "@/hooks/useChat"
import { createClient } from "@/lib/supabase/client"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState<unknown>(null)

  // Custom hooks for data management
  const { chatHistory, loading: historyLoading, error: historyError, refreshHistory } = useChatHistory()
  const { messages, threadInfo, loading: messagesLoading, error: messagesError, sending, sendMessage } = useChatMessages(selectedChat)
  const { createThread, creating } = useCreateThread()

  const supabase = createClient()

  // Get user info for unauthorized access redirect
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  // Auto-select first chat if available and none selected
  useEffect(() => {
    if (chatHistory.length > 0 && !selectedChat) {
      setSelectedChat(chatHistory[0].id)
    }
  }, [chatHistory, selectedChat])

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async () => {
    if (message.trim() && selectedChat) {
      const success = await sendMessage(message)
      if (success) {
        setMessage("")
        // Refresh history to update preview and timestamp
        refreshHistory()
      }
    }
  }

  const handleCreateNewThread = async () => {
    if (message.trim()) {
      // Create thread with first message
      const thread = await createThread(
        message.substring(0, 50) + (message.length > 50 ? '...' : ''), // Auto-generate title from first 50 chars
        { content: message, role: 'user' }
      )
      
      if (thread) {
        setMessage("")
        setSelectedChat(thread.id)
        refreshHistory()
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (selectedChat) {
        handleSubmit()
      } else if (message.trim()) {
        handleCreateNewThread()
      }
    }
  }

  // Show loading state for unauthorized users
  if (!user) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <ChatHeader /> 

      {/* Sidebar - Fixed position */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">History</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedChat(null)
                setMessage("")
              }}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search History" 
              className="pl-10 bg-gray-50 border-gray-200" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {historyLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : historyError ? (
            <div className="p-4 text-center text-red-500 text-sm">
              {historyError}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            filteredHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === chat.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{chat.title}</h3>
                  <span className="text-xs text-gray-500 ml-2">{chat.date}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{chat.preview}</p>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{chat.message_count || 0} messages</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-2 flex-shrink-0 pt-16">
          {selectedChat && threadInfo ? (
            <>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">{threadInfo.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{threadInfo.id.substring(0, 8)}</span>
                </div>
                <span>|</span>
                <span>{messages.length} messages</span>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Start a New Conversation</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Type your message below to begin</span>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : messagesError ? (
            <div className="text-center text-red-500">
              {messagesError}
            </div>
          ) : messages.length === 0 && selectedChat ? (
            <div className="text-center text-gray-500">
              No messages in this conversation yet.
            </div>
          ) : selectedChat ? (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${msg.isUser ? "order-1" : "order-2"}`}>
                  <div className={`flex items-center gap-2 mb-2 ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    <span className="font-semibold text-gray-900 text-sm">{msg.sender}</span>
                    <span className="text-xs text-gray-500">Code: {msg.code}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.isUser ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 h-full flex items-center justify-center">
              <div>
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Welcome to Chat</p>
                <p className="text-sm">Start typing below to begin a new conversation</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-b border-t border-gray-200 flex-shrink-0">
          <div className="relative">
            <Textarea
              placeholder={selectedChat ? "Type your message..." : "Start a new conversation..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[80px] resize-none border-gray-200 pr-12"
              disabled={sending || creating}
            />
            <Button
              onClick={selectedChat ? handleSubmit : handleCreateNewThread}
              size="sm"
              disabled={!message.trim() || sending || creating}
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {(sending || creating) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {messagesError && (
            <div className="mt-2 text-sm text-red-500">
              {messagesError}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
