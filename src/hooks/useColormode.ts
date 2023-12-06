/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'

export type BasicColorMode = 'light' | 'dark'
export type BasicColorSchema = BasicColorMode | 'auto'

export interface UseColorModeOptions<T extends string = BasicColorMode> {
  selector?: string
  attribute?: string
  initialValue?: T | BasicColorSchema | (() => T | BasicColorSchema)
  modes?: Partial<Record<T | BasicColorSchema, string>>
  onChanged?: (mode: T | BasicColorMode) => void
  storageRef?: React.MutableRefObject<T | BasicColorSchema | null>
  storageKey?: string | null
  storage?: Storage
  emitAuto?: boolean
  disableTransition?: boolean
}

export type UseColorModeReturn<T extends string = BasicColorMode> = {
  mode: T | BasicColorSchema
  setMode: React.Dispatch<React.SetStateAction<T | BasicColorMode>>
}

export function useColorMode<T extends string = BasicColorMode>(
  initialMode: T | BasicColorMode,
  options: UseColorModeOptions<T> = {},
): UseColorModeReturn<T> {
  const { selector = 'body' } = options

  const modes = {
    light: 'light',
    dark: 'dark',
    ...(options.modes || {}),
  } as Record<BasicColorSchema | T, string>

  const [mode, setMode] = useState<T | BasicColorMode>(initialMode)

  const updateHTMLAttrs = (selector: string, value: string) => {
    const element = document.querySelector(selector) as Element

    const current = element.getAttribute('data-theme')
    if (current) {
      element.setAttribute('data-theme', value)
    }
  }

  const onChange = (mode: T | BasicColorMode) => {
    updateHTMLAttrs(selector, modes[mode] || mode)
  }

  useEffect(() => {
    onChange(mode)
  }, [mode])

  return {
    mode,
    setMode,
  }
}
