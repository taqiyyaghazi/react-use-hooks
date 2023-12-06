/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'

export interface UseClipboardOptions {
  read?: boolean
  copiedDuring?: number
  legacy?: boolean
}

export interface UseClipboardReturn {
  isSupported: boolean
  text: string
  copied: boolean
  copy: (text?: string) => Promise<void>
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { read = false, copiedDuring = 1000, legacy = false } = options

  const [isClipboardApiSupported, setIsClipboardApiSupported] = useState<boolean>(false)
  const [permissionRead, setPermissionRead] = useState<PermissionState>('granted')
  const [permissionWrite, setPermissionWrite] = useState<PermissionState>('granted')
  const [isSupported, setIsSupported] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setIsClipboardApiSupported(!!navigator?.clipboard)

    navigator?.permissions.query({ name: 'clipboard-read' as PermissionName }).then((result) => {
      setPermissionRead(result.state)
    })

    navigator?.permissions.query({ name: 'clipboard-write' as PermissionName }).then((result) => {
      setPermissionWrite(result.state)
    })

    setIsSupported(!!navigator?.clipboard || legacy)
  }, [legacy])

  const updateText = () => {
    if (isClipboardApiSupported && permissionRead !== 'denied') {
      navigator?.clipboard.readText().then((value) => {
        setText(value)
      })
    } else {
      setText(legacyRead())
    }
  }

  useEffect(() => {
    if (isSupported && read) {
      document.addEventListener('copy', updateText)
      document.addEventListener('cut', updateText)

      return () => {
        document.removeEventListener('copy', updateText)
        document.removeEventListener('cut', updateText)
      }
    }

    return () => {}
  }, [isSupported, read])

  const copy = async (value?: string) => {
    if (isSupported && value != null) {
      if (isClipboardApiSupported && permissionWrite !== 'denied') {
        await navigator?.clipboard.writeText(value)
      } else {
        legacyCopy(value)
      }

      setText(value)
      setCopied(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false)
      }, copiedDuring)
    }
  }

  const legacyCopy = (value: string) => {
    const ta = document.createElement('textarea')
    ta.value = value ?? ''
    ta.style.position = 'absolute'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }

  const legacyRead = () => {
    return document?.getSelection?.()?.toString() ?? ''
  }

  return {
    isSupported,
    text,
    copied,
    copy,
  }
}
