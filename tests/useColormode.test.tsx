import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BasicColorMode, useColorMode } from '../src/hooks/useColorMode'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}))

describe('useColorMode', () => {
  it('should update the data-theme attribute correctly', async () => {
    const TestComponent = () => {
      const { mode, setMode } = useColorMode<BasicColorMode>('light', { selector: 'div' })
      return (
        <div>
          <span data-testid='color-mode'>{mode}</span>
          <button onClick={() => setMode('dark')}>Toggle Mode</button>
        </div>
      )
    }

    render(<TestComponent />)

    expect(screen.getByTestId('color-mode')).toHaveTextContent('light')

    act(() => {
      userEvent.click(screen.getByText('Toggle Mode'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('color-mode')).toHaveTextContent('dark')
    })
  })
})
