'use client'

import { useEffect, useState } from 'react'

const FunnelPreview = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state after a short delay to ensure iframe is ready
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full my-8 flex justify-center">
      <div className="relative">
        <iframe
          src="https://app.funnelmods.ai/v2/preview/VBy8edn41ycWoKTRaK94?notrack=true"
          title="FunnelMods Beta Preview"
          width="100%"
          height="600"
          style={{
            width: '0px',
            height: '0px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            background: 'transparent',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  )
}

export default FunnelPreview
