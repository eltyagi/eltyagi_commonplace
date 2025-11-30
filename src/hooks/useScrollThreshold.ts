import { useEffect, useState } from 'react'
import { HEADER_SCROLL_THRESHOLD } from '../constants/layout'

const DESKTOP_BREAKPOINT = 768

export const useScrollThreshold = () => {
  const [isPastThreshold, setIsPastThreshold] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= DESKTOP_BREAKPOINT) {
        setIsPastThreshold(false)
        return
      }
      setIsPastThreshold(window.scrollY > HEADER_SCROLL_THRESHOLD)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return isPastThreshold
}
