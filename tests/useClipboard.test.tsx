import { renderHook, act } from '@testing-library/react-hooks'
import { useClipboard, UseClipboardOptions } from '../src/hooks/useClipboard'

describe('useClipboard', () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn(() => Promise.resolve('MockClipboardText')),
        writeText: jest.fn(),
      },
      permissions: {
        query: jest.fn().mockImplementation(() => Promise.resolve({ state: 'granted' })),
      },
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should initialize with the correct state', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useClipboard())

    await act(async () => await waitForNextUpdate())

    expect(result.current.isSupported).toBe(true)
    expect(result.current.text).toBe('')
    expect(result.current.copied).toBe(false)
  })

  it('should update text when copy is called', async () => {
    const options: UseClipboardOptions = { read: true }
    const { result, waitForNextUpdate } = renderHook(() => useClipboard(options))

    await act(async () => {
      await result.current.copy('NewClipboardText')
      await waitForNextUpdate({ timeout: 1000 })
    })

    expect(result.current.text).toBe('NewClipboardText')
  })

  it('should not copy text if clipboard API is not supported', async () => {
    Object.assign(navigator, { clipboard: undefined })
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('NewClipboardText')
    })

    expect(result.current.text).toBe('')
    expect(result.current.copied).toBe(false)
  })

  it('should not read text if read permission is denied', async () => {
    Object.assign(navigator.permissions, {
      query: jest.fn().mockImplementation(() => Promise.resolve({ state: 'denied' })),
    })
    const options: UseClipboardOptions = { read: true }
    const { result, waitForNextUpdate } = renderHook(() => useClipboard(options))

    await act(async () => await waitForNextUpdate())

    expect(result.current.text).toBe('')
  })
})
