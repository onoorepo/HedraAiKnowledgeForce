import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Defer the initial check to the first paint 
    const id = requestAnimationFrame(onChange)
    window.addEventListener("resize", onChange)
    
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("resize", onChange)
    }
  }, [])

  return isMobile
}
