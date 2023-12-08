import { useEffect, useRef, useState } from 'react'
import { UseWindowScrollOptions, UseWindowScrollReturn } from '../types/useWindowScroll'

export function useWindowScroll(options: UseWindowScrollOptions = {}): UseWindowScrollReturn {
  const { window: customWindow = window, behavior = 'auto' } = options

  const [position, setPosition] = useState({
    x: customWindow.scrollX || 0,
    y: customWindow.scrollY || 0,
  })

  const internalX = useRef(position.x)
  const internalY = useRef(position.y)

  useEffect(() => {
    const handleScroll = () => {
      internalX.current = customWindow.scrollX
      internalY.current = customWindow.scrollY
      setPosition({ x: internalX.current, y: internalY.current })
    }

    customWindow.addEventListener('scroll', handleScroll, {
      capture: false,
      passive: true,
    })

    return () => {
      customWindow.removeEventListener('scroll', handleScroll)
    }
  }, [customWindow])

  const setScrollPosition = (newX: number, newY: number) => {
    if (customWindow) {
      customWindow.scrollTo({
        left: newX,
        top: newY,
        behavior,
      })
    }
  }

  return { x: position.x, y: position.y, setScrollPosition }
}
