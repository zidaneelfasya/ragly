'use client'

import { useRef, useState } from 'react'

export default function ProductDemoSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  const videoRefs = {
    landing: useRef<HTMLVideoElement>(null),
    create: useRef<HTMLVideoElement>(null),
    test: useRef<HTMLVideoElement>(null)
  }

  const handleMouseEnter = (cardId: string) => {
    setHoveredCard(cardId)
    const video = videoRefs[cardId as keyof typeof videoRefs].current
    if (video) {
      video.play().catch(() => {
        // Handle autoplay restrictions
      })
    }
  }

  const handleMouseLeave = (cardId: string) => {
    setHoveredCard(null)
    const video = videoRefs[cardId as keyof typeof videoRefs].current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }

  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Build AI Chatbots in Minutes
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            See how our RAG-powered chatbot platform works.
          </p>
        </div>

        {/* Floating Video Cards Container */}
        <div className="relative h-[800px] md:h-[900px]">
          
          {/* Top Center - Landing Page Demo */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-3xl transition-all duration-500 ease-out floating-card ${
              hoveredCard && hoveredCard !== 'landing' ? 'opacity-60' : 'opacity-100'
            }`}
            onMouseEnter={() => handleMouseEnter('landing')}
            onMouseLeave={() => handleMouseLeave('landing')}
          >
            <VideoCard
              videoRef={videoRefs.landing}
              videoSrc="/landing/videos/landing-demo.mp4"
              title="Landing Page"
              isHovered={hoveredCard === 'landing'}
            />
          </div>

          {/* Bottom Left - Create Chatbot Demo */}
          <div
            className={`absolute left-0 md:left-[5%] bottom-0 w-full max-w-2xl transition-all duration-500 ease-out floating-card-delayed ${
              hoveredCard && hoveredCard !== 'create' ? 'opacity-60' : 'opacity-100'
            }`}
            onMouseEnter={() => handleMouseEnter('create')}
            onMouseLeave={() => handleMouseLeave('create')}
          >
            <VideoCard
              videoRef={videoRefs.create}
              videoSrc="/videos/create-chatbot-demo.mp4"
              title="Create Chatbot"
              isHovered={hoveredCard === 'create'}
            />
          </div>

          {/* Bottom Right - Test Chatbot Demo */}
          <div
            className={`absolute right-0 md:right-[5%] bottom-0 w-full max-w-2xl transition-all duration-500 ease-out floating-card-slow ${
              hoveredCard && hoveredCard !== 'test' ? 'opacity-60' : 'opacity-100'
            }`}
            onMouseEnter={() => handleMouseEnter('test')}
            onMouseLeave={() => handleMouseLeave('test')}
          >
            <VideoCard
              videoRef={videoRefs.test}
              videoSrc="/landing/videos/test-chatbot-demo.mp4"
              title="Test Chatbot"
              isHovered={hoveredCard === 'test'}
            />
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .floating-card {
          animation: float 6s ease-in-out infinite;
        }

        .floating-card-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }

        .floating-card-slow {
          animation: float-slow 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}

interface VideoCardProps {
  videoRef: React.RefObject<HTMLVideoElement>
  videoSrc: string
  title: string
  isHovered: boolean
}

function VideoCard({ videoRef, videoSrc, title, isHovered }: VideoCardProps) {
  return (
    <div
      className={`group relative rounded-[20px] overflow-hidden border border-white/10 backdrop-blur-sm transition-all duration-500 ${
        isHovered ? 'scale-105 rotate-1 shadow-2xl shadow-primary/20' : 'shadow-xl shadow-black/50'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      }}
    >
      {/* Browser Header */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 text-center">
          <div className="inline-block px-4 py-1 rounded-md bg-white/5 text-white/40 text-xs font-medium">
            {title}
          </div>
        </div>
        <div className="w-14"></div>
      </div>

      {/* Video Container - 16:9 Aspect Ratio */}
      <div className="relative aspect-video bg-black/40">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        
        {/* Play Indicator */}
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Glow Effect */}
      <div
        className={`absolute inset-0 -z-10 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 rounded-[20px] scale-105"></div>
      </div>
    </div>
  )
}
