import { useEffect, useState, useRef } from "react"
import { useInView } from "framer-motion"

interface UseCounterAnimationProps {
  end: number
  duration?: number
  startOnView?: boolean
}

export function useCounterAnimation({ 
  end, 
  duration = 2000,
  startOnView = true 
}: UseCounterAnimationProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if ((startOnView && !isInView) || hasAnimated.current) return
    
    hasAnimated.current = true
    const startTime = Date.now()
    const endTime = startTime + duration

    const timer = setInterval(() => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      setCount(Math.floor(easeProgress * end))

      if (now >= endTime) {
        setCount(end)
        clearInterval(timer)
      }
    }, 16) // ~60fps

    return () => clearInterval(timer)
  }, [end, duration, isInView, startOnView])

  return { count, ref }
}
