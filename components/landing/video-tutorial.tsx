"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"

export default function VideoTutorial() {
  const ref = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden" id="tutorial">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5" />
      
      {/* Flowing Gradient Orbs */}
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{ 
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 right-20 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl"
      />

      {/* Diagonal Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,hsl(var(--border))_1px,transparent_1px),linear-gradient(-45deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Asymmetric Header Layout */}
          <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
            
            {/* Left: Title Section (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
                <Play className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Video Tutorial
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-[1.1]">
                <span className="block bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70">
                  Learn in
                </span>
                <span className="block text-5xl md:text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary mt-2">
                  Minutes
                </span>
              </h2>
            </motion.div>

            {/* Right: Description (5 cols) - positioned lower */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Watch our comprehensive guide to get started with AI-powered chatbots. 
                From setup to advanced features, everything you need in one place.
              </p>
            </motion.div>
          </div>

          {/* Video Container - Unique Shape */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Decorative Elements Around Video */}
            <div className="absolute -top-8 -left-8 w-32 h-32 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-b-2 border-r-2 border-secondary/30 rounded-br-3xl" />
            
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />

            {/* Main Video Card */}
            <div 
              className="relative bg-gradient-to-br from-card to-muted/50 rounded-2xl overflow-hidden border border-border/50 backdrop-blur-sm shadow-2xl"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {/* Video Element */}
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  src="/landing/videos/tutor.mp4"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-10 h-10 md:w-14 md:h-14 text-primary-foreground ml-1" fill="currentColor" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Custom Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: showControls || !isPlaying ? 1 : 0, y: showControls || !isPlaying ? 0 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6"
                >
                  <div className="flex items-center gap-4">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" fill="white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                      )}
                    </button>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Volume Toggle */}
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors flex items-center justify-center"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors flex items-center justify-center"
                    >
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Info Bar - Diagonal Cut */}
              <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 md:p-8 border-t border-border/30">
                {/* Diagonal Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="text-lg font-bold text-foreground">5 mins</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Level</div>
                    <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      Beginner-Friendly
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Topics Covered</div>
                    <div className="text-lg font-bold text-foreground">Setup • RAG • Deploy</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Feature Pills - Scattered Layout */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 flex flex-wrap gap-4 justify-center max-w-4xl mx-auto"
          >
            {[
              { label: "Step-by-step guide", gradient: "from-blue-500/10 to-cyan-500/10", border: "border-blue-500/30" },
              { label: "Real-world examples", gradient: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/30" },
              { label: "Best practices", gradient: "from-green-500/10 to-emerald-500/10", border: "border-green-500/30" },
              { label: "Quick start tips", gradient: "from-orange-500/10 to-red-500/10", border: "border-orange-500/30" },
            ].map((pill, index) => (
              <motion.div
                key={pill.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${pill.gradient} border ${pill.border} backdrop-blur-sm`}
              >
                <span className="text-sm font-medium text-foreground">{pill.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
