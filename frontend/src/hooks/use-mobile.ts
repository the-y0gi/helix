import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with undefined or a sensible default to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // 1. Check for window existence (SSR safety)
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // 2. Optimized handler using the event's matches property
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }

    // 3. Set initial state correctly
    setIsMobile(mql.matches)

    // 4. Modern listener (support for older browsers included)
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty array: we only want to set up the listener once

  return isMobile
}