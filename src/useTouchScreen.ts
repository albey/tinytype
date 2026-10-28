import { useEffect, useState } from 'react'

// True on devices whose main pointer is a finger, i.e. without a mouse (and usually without a keyboard).
export function useTouchScreen(): boolean {
  const query = '(pointer: coarse)'
  const [touch, setTouch] = useState(() => matchMedia(query).matches)
  useEffect(() => {
    const list = matchMedia(query)
    const update = () => setTouch(list.matches)
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [])
  return touch
}
