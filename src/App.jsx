import { useEffect, useRef } from 'react'
import legacyMarkup from './legacyMarkup.html?raw'
import legacyScript from './legacyScript.js?raw'

/**
 * Bridge for the original interactive birthday-book experience.
 * Markup and behavior live in separate readable files to avoid giant escaped strings.
 */
export default function App() {
  const contentRef = useRef(null)

  useEffect(() => {
    const host = contentRef.current
    if (!host) return

    host.innerHTML = legacyMarkup

    const script = document.createElement('script')
    script.textContent = `(() => {\n${legacyScript}\n})();`
    host.appendChild(script)

    return () => {
      script.remove()
      host.replaceChildren()
    }
  }, [])

  return <div ref={contentRef} className="min-h-screen w-full" />
}
