'use client'

import { useEffect, useState } from 'react'

interface SpotsData {
  taken: number
  total: number
  remaining: number
}

const BetaSpotsTracker = () => {
  const [spotsData, setSpotsData] = useState<SpotsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Access the data sent from the iframe
      const receivedData = event.data
      if (receivedData?.message !== 's2c') {
        return // Ignore messages from unknown origins
      }

      console.log('Received s2c data from iframe:', receivedData)

      // Extract spots data from the message
      const taken = parseInt(receivedData.spotsTaken)
      const total = parseInt(receivedData.totalSpots)
      const remaining = total - taken

      // Validate the data
      if (
        isNaN(taken) ||
        isNaN(total) ||
        taken < 0 ||
        total <= 0 ||
        taken > total
      ) {
        console.warn('Invalid spots data received:', {
          taken,
          total,
          remaining,
        })
        return
      }

      console.log('Updating spots data:', { taken, total, remaining })

      // Update the spots data with real data from iframe
      setSpotsData({ taken, total, remaining })
      setIsLoading(false)
    }

    window.addEventListener('message', handleMessage)

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-background border border-primary/10 rounded-xl">
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/20 text-muted-foreground rounded-md text-sm">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse"></div>
              Loading availability...
            </div>
          </div>
          <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary/30 rounded-full animate-pulse w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!spotsData) {
    return null
  }

  const progressPercentage = (spotsData.taken / spotsData.total) * 100
  const isUrgent = spotsData.remaining <= 10
  const isLow = spotsData.remaining <= 25

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background border border-primary/10 rounded-xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20">
            {isUrgent
              ? 'LIMITED AVAILABILITY'
              : isLow
                ? 'FILLING QUICKLY'
                : 'LIMITED AVAILABILITY'}
          </div>

          <h3 className="text-lg font-semibold text-primary">
            {spotsData.remaining} spots remaining
          </h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Spots taken</span>
            <span className="font-medium text-primary">
              {spotsData.taken}/{spotsData.total}
            </span>
          </div>

          <div className="relative">
            <div className="h-2 bg-muted/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  progressPercentage >= 80
                    ? 'bg-gradient-to-r from-primary via-orange-500 to-destructive'
                    : progressPercentage >= 60
                      ? 'bg-gradient-to-r from-primary to-orange-500'
                      : 'bg-primary'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isUrgent && (
              <span className="font-medium text-primary">
                Only {spotsData.remaining} spots left
              </span>
            )}
            {isLow && !isUrgent && (
              <span>
                Join {spotsData.taken} founders who secured their access
              </span>
            )}
            {!isLow && <span>Early access for founding members</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BetaSpotsTracker
