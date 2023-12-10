import { useMemo } from 'react'
import { useMounted } from './useMounted'

export function useSupported(callback: () => boolean) {
  const isMounted = useMounted()

  const isFeatureSupported = useMemo(() => {
    if (isMounted) {
      return Boolean(callback())
    }

    return false
  }, [isMounted, callback])

  return isFeatureSupported
}
