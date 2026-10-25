import { useEffect, useState } from 'react'

// Like useState, but remembers the value in this browser between visits.
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initial : (JSON.parse(saved) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be blocked (private window); the app still works, it just forgets.
    }
  }, [key, value])

  return [value, setValue] as const
}
