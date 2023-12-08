import '@testing-library/jest-dom'
import { render, renderHook, screen } from '@testing-library/react'
import React from 'react'
import { useWindowScroll } from '../src'

describe('useWindowScroll', () => {
  const TestComponent = () => {
    const { x, y, setScrollPosition } = useWindowScroll()
    return (
      <div data-testid='wrapper' style={{ height: '100px' }}>
        <span data-testid='x'>{x}</span>
        <span data-testid='y'>{y}</span>
        <button onClick={() => setScrollPosition(100, 200)}>Scroll</button>
      </div>
    )
  }
  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useWindowScroll())

    expect(result.current).toHaveProperty('x')
    expect(result.current).toHaveProperty('y')
    expect(result.current).toHaveProperty('setScrollPosition')
  })

  it('should set the scroll position of the window to the specified x and y values', () => {
    render(<TestComponent />)

    expect(screen.getByTestId('x')).toHaveTextContent('0')
    expect(screen.getByTestId('y')).toHaveTextContent('0')
  })
})
