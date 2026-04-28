'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export function Logo({ width = 120, height = 40, className = '' }: LogoProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use light logo (white text) when in dark mode
  // Use dark logo (black text) when in light mode
  const currentTheme = theme === 'system' ? systemTheme : theme
  const logoSrc = currentTheme === 'dark' ? '/logo-light.png' : '/logo-dark.png'

  if (!mounted) {
    return <div style={{ width, height }} className={className} />
  }

  return (
    <Image
      src={logoSrc}
      alt="Zynk"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
