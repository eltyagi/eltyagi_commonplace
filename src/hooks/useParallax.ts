import { useEffect } from 'react'

const DESKTOP_BREAKPOINT = 768

/**
 * Hook that sets --scroll-y CSS custom property on the document root.
 * Enables CSS-based parallax effects via calc() transforms.
 *
 * Automatically disabled on mobile (<=768px) to prevent jank.
 * Respects prefers-reduced-motion via CSS.
 */
export const useParallax = () => {
  useEffect(() => {
    const handleScroll = () => {
      // Disable on mobile for performance
      if (window.innerWidth <= DESKTOP_BREAKPOINT) {
        document.documentElement.style.setProperty('--scroll-y', '0')
        return
      }

      // Update scroll position as CSS variable
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}`)
    }

    // Initialize on mount
    handleScroll()

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])
}
