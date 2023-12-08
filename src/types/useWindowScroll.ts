export interface UseWindowScrollOptions {
  window?: Window
  behavior?: ScrollBehavior
}

export interface UseWindowScrollReturn {
  x: number
  y: number
  setScrollPosition: (x: number, y: number) => void
}
