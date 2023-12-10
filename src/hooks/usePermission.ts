import { useEffect, useRef, useState } from 'react'
import { useSupported } from './useSupported'

export interface UsePermissionOptions {
  controls?: boolean
}

export interface UsePermissionReturn {
  state: PermissionState | undefined
  query: () => Promise<PermissionStatus | undefined>
}

export function usePermission(permissionDesc: PermissionName, options: UsePermissionOptions = {}): UsePermissionReturn {
  const { controls = false } = options
  const isSupported = useSupported(() => navigator && 'permissions' in navigator)
  const [state, setState] = useState<PermissionState | undefined>(undefined)
  const permissionStatusRef = useRef<PermissionStatus | undefined>(undefined)

  const onChange = () => {
    if (permissionStatusRef.current) {
      setState(permissionStatusRef.current.state)
    }
  }

  const query = async () => {
    if (!isSupported) {
      return undefined
    }

    if (!permissionStatusRef.current) {
      try {
        permissionStatusRef.current = await navigator.permissions.query({
          name: permissionDesc,
        })

        permissionStatusRef.current.addEventListener('change', onChange)
        onChange()
      } catch {
        setState('prompt')
      }
    }

    return permissionStatusRef.current
  }

  useEffect(() => {
    query()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (controls) {
    return {
      state,
      query,
    }
  } else {
    return {
      state,
      query: async () => undefined,
    }
  }
}
