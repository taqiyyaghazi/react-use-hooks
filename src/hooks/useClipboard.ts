/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSupported } from './useSupported'
import { usePermission } from './usePermission'

export interface UseClipboardOptions {
  read?: boolean
  legacy?: boolean
  copiedDuring?: number
}

export interface UseClipboardReturn {
  isSupported: boolean
  text: string
  copied: boolean
  copy: (text?: string) => Promise<void>
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { read = false, legacy = false, copiedDuring = 1000 } = options

  const isClipboardApiSupported = useSupported(() => navigator && 'clipboard' in navigator)
  const permissionRead = usePermission('clipboard-read' as PermissionName)
  const permissionWrite = usePermission('clipboard-write' as PermissionName)
  const isSupported = useMemo(() => isClipboardApiSupported || legacy, [isClipboardApiSupported, legacy])
  const [text, setText] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const timeoutRef = useRef<number | null>(null)

  const updateText = () => {
    if (isClipboardApiSupported && permissionRead.state !== 'denied') {
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
      if (isClipboardApiSupported && permissionWrite.state !== 'denied') {
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
