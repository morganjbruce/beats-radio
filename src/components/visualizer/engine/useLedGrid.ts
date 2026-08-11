import { useEffect, useState, type RefObject } from 'react'

import type { GridSize } from '../types'

export const useLedGrid = (wrapperRef: RefObject<HTMLDivElement | null>, cellSize: number) => {
  const [grid, setGrid] = useState<GridSize>({ cols: 0, rows: 0 })

  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return

    const measure = () => {
      const cols = Math.max(16, Math.ceil(element.clientWidth / cellSize))
      const rows = Math.max(8, Math.ceil(element.clientHeight / cellSize))
      setGrid(current =>
        current.cols === cols && current.rows === rows ? current : { cols, rows },
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [cellSize, wrapperRef])

  return grid
}
