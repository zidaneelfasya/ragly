"use client"

import { useCounterAnimation } from "@/hooks/use-counter-animation"

interface CounterStatProps {
  value: string
  className?: string
}

export function CounterStat({ value, className = "" }: CounterStatProps) {
  // Parse the value to extract number and suffix
  const parseValue = (val: string) => {
    // Handle percentages (e.g., "98.5%", "99.9%")
    if (val.includes("%")) {
      const num = parseFloat(val.replace("%", ""))
      const isDecimal = val.includes(".")
      // For decimals, multiply by 10 to get whole number for counter, then divide when displaying
      return { 
        number: isDecimal ? Math.round(num * 10) : num, 
        suffix: "%", 
        isDecimal,
        divisor: 10 
      }
    }
    
    // Handle K suffix (e.g., "50K+", "10K+")
    if (val.includes("K")) {
      const num = parseInt(val.replace(/[K+]/g, ""))
      return { number: num, suffix: "K+", isDecimal: false }
    }
    
    // Handle M suffix (e.g., "2M+")
    if (val.includes("M")) {
      const num = parseInt(val.replace(/[M+]/g, ""))
      return { number: num, suffix: "M+", isDecimal: false }
    }
    
    // Handle special cases like "<2s"
    if (val.startsWith("<")) {
      const num = parseInt(val.replace(/[<s]/g, ""))
      return { number: num, suffix: "s", prefix: "<", isDecimal: false }
    }
    
    // Default: just return the value as is
    return { number: 0, suffix: "", text: val, isDecimal: false }
  }

  const parsed = parseValue(value)
  const { count, ref } = useCounterAnimation({ 
    end: parsed.number,
    duration: 2000 
  })

  // If it's just text (not a number), return as is
  if (parsed.text) {
    return <span className={className}>{parsed.text}</span>
  }

  return (
    <span ref={ref as any} className={className}>
      {parsed.prefix}
      {parsed.isDecimal && parsed.divisor 
        ? (count / parsed.divisor).toFixed(1) 
        : count}
      {parsed.suffix}
    </span>
  )
}
