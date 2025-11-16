"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  id: number
  sender: "user" | "bot"
  message: string
  timestamp: string
}

const chatScript: Omit<ChatMessage, 'id' | 'timestamp'>[] = [
  { sender: "user", message: "How does RAG technology work?" },
  { sender: "bot", message: "RAG retrieves relevant information from your knowledge base before generating responses, ensuring accurate and contextual answers." },
  { sender: "user", message: "Can I customize responses?" },
  { sender: "bot", message: "Absolutely! You can train your chatbot with custom documents, set specific responses, and fine-tune the AI behavior to match your needs." },
  { sender: "user", message: "What file formats are supported?" },
  { sender: "bot", message: "We support PDF, DOCX, TXT, and more. Simply upload your documents and the AI will learn from them instantly." }
]

export default function ChatPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentIndex < chatScript.length) {
      const timer = setTimeout(() => {
        const currentMessage = chatScript[currentIndex]
        
        if (currentMessage.sender === "bot") {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            setMessages(prev => [...prev, {
              id: currentIndex,
              ...currentMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
            setCurrentIndex(prev => prev + 1)
          }, 1500) // Bot typing delay
        } else {
          setMessages(prev => [...prev, {
            id: currentIndex,
            ...currentMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])
          setCurrentIndex(prev => prev + 1)
        }
      }, currentIndex === 0 ? 1000 : 2500) // Initial delay and between messages

      return () => clearTimeout(timer)
    } else {
      // Reset animation after completion
      const resetTimer = setTimeout(() => {
        setMessages([])
        setCurrentIndex(0)
        setIsTyping(false)
      }, 5000)
      
      return () => clearTimeout(resetTimer)
    }
  }, [currentIndex, messages.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isTyping])

  const formatTime = (timestamp: string) => {
    return timestamp
  }

  return (
    <div className="relative h-96 w-full max-w-md mx-auto">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Chat Container */}
      <div className="relative h-full backdrop-blur-xl bg-white/10 rounded-3xl border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-lg"></div>
            </div>
            <div className="text-black/90 font-medium text-sm">AI Assistant</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-black/70 text-xs">Online</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 space-y-4 overflow-y-auto h-72 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105 ${
                  message.sender === "user" 
                    ? "bg-white/20 backdrop-blur-sm border border-primary/40 text-black/80 ml-8 shadow-white/10" 
                    : "bg-primary/30 backdrop-blur-sm border border-primary/40 text-white mr-8 shadow-primary/20"
                }`}>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-black/60" : "text-white/80"}`}>{formatTime(message.timestamp)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="bg-primary/30 backdrop-blur-sm border border-primary/40 rounded-2xl px-4 py-3 mr-8 shadow-lg shadow-primary/20">
                  <div className="flex items-center gap-1">
                    <span className="text-white/80 text-sm">AI is typing</span>
                    <div className="flex gap-1 ml-2">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 bg-white/60 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-white/60 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-white/60 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
      </div>
    </div>
  )
}
