import { magnitude, overallEnergy } from '../audioMetrics'
import type { ModeRenderer } from '../types'
import { fineDisc, FINE_PIXEL_SIZE } from './finePixels'
import { createCityScroll } from './cityScroll'

const CITY_GRID = '#050914'
const CITY_SKY = ['#29469a', '#25418f', '#203a82', '#1b3374', '#162b64', '#101f4e']
const CITY_MOON = '#c7dcf4'
const CITY_CLOUD = ['#294c91', '#345ba0']
const CITY_FAR_BUILDING = ['#111c38', '#142142', '#18264a']
const CITY_FAR_WINDOW = '#344d78'
const CITY_BUILDING = ['#080b16', '#0b1020', '#0e1425']
const CITY_NEON = ['#18d7d1', '#ff3fa4', '#8a5cff', '#f0b52e']
const CITY_NEON_DIM = ['#0c7472', '#8c245c', '#49318a', '#83651d']
const CITY_WINDOW = '#d5c56f'
const CITY_WINDOW_DIM = '#665f3c'

interface Building {
  x: number
  w: number
  h: number
  roof: number
  seed: number
  band: number
}

type FarBuilding = Omit<Building, 'band'>

export const createNeonCityMode = (): ModeRenderer => {
  const scale = 2
  const motion = createCityScroll()
  let loopWidth = 0
  let buildings: Building[] = []
  let farLoopWidth = 0
  let farBuildings: FarBuilding[] = []

  return {
    resize: ({ cols, rows }) => {
      const baseRows = rows / scale
      buildings = []
      farBuildings = []
      motion.reset()

      const targetWidth = Math.max(cols + 24 * scale, Math.round(cols * 1.3))
      let x = 0
      let index = 0
      while (x < targetWidth) {
        const seed = (index * 37 + 17) % 97
        const width = (4 + (seed % 6)) * scale
        const minHeight = Math.max(4, Math.round(baseRows * 0.18))
        const range = Math.max(5, Math.round(baseRows * 0.58))
        const height = Math.min(
          baseRows - 4,
          seed % 5 === 0 ? minHeight : minHeight + ((seed * 11) % range),
        ) * scale
        buildings.push({
          x,
          w: width,
          h: height,
          roof: seed % 4,
          seed,
          band: index % 12,
        })
        x += width + (seed % 4 === 0 ? scale : 0)
        index++
      }
      loopWidth = x

      const farTargetWidth = Math.max(cols + 18 * scale, Math.round(cols * 1.2))
      let farX = 0
      let farIndex = 0
      while (farX < farTargetWidth) {
        const seed = (farIndex * 29 + 11) % 83
        const width = (3 + (seed % 5)) * scale
        const minHeight = Math.max(4, Math.round(baseRows * 0.13))
        const range = Math.max(4, Math.round(baseRows * 0.36))
        const height = Math.min(Math.round(baseRows * 0.58), minHeight + ((seed * 7) % range)) * scale
        farBuildings.push({
          x: farX,
          w: width,
          h: height,
          roof: seed % 3,
          seed,
        })
        farX += width + (seed % 5 === 0 ? scale : 0)
        farIndex++
      }
      farLoopWidth = farX
    },
    draw: frame => {
      const {
        cell,
        cols,
        rows,
        frequency,
        flash,
        tick,
        context,
        canvas,
        resetFillCache,
      } = frame
      const energy = overallEnergy(frequency)
      if (!loopWidth || !farLoopWidth) return
      const cellSize = FINE_PIXEL_SIZE
      const distance = motion.advance(frame.now, frame.musicTiming) / cellSize
      // Let nearby buildings sweep past while the distant skyline drifts.
      const scroll = (distance * 3) % loopWidth
      const farScroll = (distance * 0.4) % farLoopWidth
      const cloudScroll = distance * 0.12
      const wholeScroll = Math.floor(scroll)
      const wholeFarScroll = Math.floor(farScroll)

      context.fillStyle = CITY_GRID
      context.fillRect(0, 0, canvas.width, canvas.height)
      resetFillCache(CITY_GRID)

      for (let row = 0; row < rows; row++) {
        const factor = row / rows
        const color =
          CITY_SKY[Math.min(CITY_SKY.length - 1, Math.floor(factor * CITY_SKY.length))]
        for (let column = 0; column < cols; column++) cell(column, row, color)
      }

      const moonX = Math.round(cols * 0.78)
      const moonY = Math.round(rows * 0.78)
      const moonRadius = Math.max(3, Math.round(rows * 0.1))
      fineDisc(cell, moonX, moonY, moonRadius, () => CITY_MOON)

      const cloudSpan = cols + 30 * scale
      for (let index = 0; index < 3; index++) {
        const rawX =
          (Math.round(cols * (0.12 + index * 0.42)) - Math.floor(cloudScroll) + cloudSpan) %
          cloudSpan
        const x = rawX - 15 * scale
        const y = Math.round(rows * (0.61 + (index % 2) * 0.11))
        const width = (9 + (index % 3) * 3) * scale
        const cloud = CITY_CLOUD[index % CITY_CLOUD.length]
        for (let column = x; column < x + width; column++) cell(column, y, cloud)
        for (let column = x + 2; column < x + width - 2; column++)
          cell(column, y + 1, cloud)
        cell(x - 1, y, cloud)
        cell(x + width, y, cloud)
        cell(x + 1, y + 1, cloud)
        cell(x + width - 2, y + 1, cloud)
      }

      const drawFarBuilding = (building: FarBuilding, x: number) => {
        if (x >= cols || x + building.w < 0) return
        const body = CITY_FAR_BUILDING[building.seed % CITY_FAR_BUILDING.length]
        const left = Math.max(0, x)
        const right = Math.min(cols - 1, x + building.w - 1)
        for (let column = left; column <= right; column++)
          for (let row = 0; row <= building.h; row++) cell(column, row, body)
        const middle = x + Math.floor(building.w / 2)
        if (building.roof === 1) cell(middle, building.h + 1, body)
        else if (building.roof === 2)
          for (let column = x + 1; column < x + building.w - 1; column++)
            cell(column, building.h + 1, body)
        for (let windowY = 3; windowY < building.h - 1; windowY += 4)
          for (let windowX = 1; windowX < building.w - 1; windowX += 3)
            if ((building.seed + windowX * 5 + windowY * 3) % 7 === 0)
              cell(x + windowX, windowY, CITY_FAR_WINDOW)
      }

      for (const building of farBuildings)
        for (const wrap of [-farLoopWidth, 0, farLoopWidth])
          drawFarBuilding(building, building.x - wholeFarScroll + wrap)

      const drawBuilding = (building: Building, x: number) => {
        if (x >= cols || x + building.w < 0) return
        const body = CITY_BUILDING[building.seed % CITY_BUILDING.length]
        const left = Math.max(0, x)
        const right = Math.min(cols - 1, x + building.w - 1)
        for (let column = left; column <= right; column++)
          for (let row = 0; row <= building.h; row++) cell(column, row, body)

        const middle = x + Math.floor(building.w / 2)
        if (building.roof === 1 || building.roof === 2) {
          for (let column = x; column < x + building.w; column++) {
            const distance = Math.min(column - x, x + building.w - 1 - column)
            const rise = building.roof === 1 ? Math.min(3, distance) : distance
            for (let row = building.h + 1; row <= building.h + rise; row++)
              cell(column, row, body)
            cell(column, building.h + rise + 1, body)
          }
        } else if (building.roof === 3) {
          for (let row = building.h + 1; row <= building.h + 2 * scale; row++)
            cell(x + scale, row, body)
        }

        const signal = magnitude(
          frequency,
          building.band / 12,
          (building.band + 1) / 12,
        )
        const neonIndex = building.seed % CITY_NEON.length
        const pulsing = flash > 0 || signal > 0.28 + (building.seed % 3) * 0.08
        const neon = pulsing ? CITY_NEON[neonIndex] : CITY_NEON_DIM[neonIndex]
        const windowColor = signal > 0.34 || flash > 0 ? CITY_WINDOW : CITY_WINDOW_DIM
        const litLevel = 2 + Math.round(signal * 5) + (flash > 0 ? 2 : 0)

        for (let windowY = 2; windowY < building.h - 1; windowY += 3)
          for (let windowX = 1; windowX < building.w - 1; windowX += 2)
            if ((building.seed + windowX * 11 + windowY * 7) % 10 < litLevel)
              cell(x + windowX, windowY, windowColor)

        if (building.seed % 3 !== 1) {
          const signStyle = building.seed % 4
          if (signStyle === 0) {
            const signX = x + Math.max(1, building.w - 2)
            for (
              let row = Math.max(2, Math.round(building.h * 0.25));
              row < building.h - 1;
              row++
            )
              cell(signX, row, neon)
          } else if (signStyle === 1) {
            const signY = Math.max(3, Math.round(building.h * 0.55))
            for (let column = x + 1; column < x + building.w - 1; column++) {
              cell(column, signY, neon)
              if (signY + 2 < building.h) cell(column, signY + 2, neon)
            }
          } else if (signStyle === 2) {
            const signY = Math.max(2, Math.round(building.h * 0.45))
            for (let column = x + 1; column < Math.min(x + building.w - 1, x + 4); column++)
              for (let row = signY; row < Math.min(building.h, signY + 3); row++)
                cell(column, row, neon)
          } else {
            cell(middle, Math.min(rows - 1, building.h + 2), neon)
            if (building.w > 5) cell(middle + 1, Math.min(rows - 1, building.h + 2), neon)
          }
        }
      }

      for (const building of buildings)
        for (const wrap of [-loopWidth, 0, loopWidth])
          drawBuilding(building, building.x - wholeScroll + wrap)

      const rainCount = Math.min(
        Math.round(cols * 0.14),
        Math.max(
          10,
          Math.round(cols * (0.025 + energy * 0.07 + (flash > 0 ? 0.055 : 0))),
        ),
      )
      for (let index = 0; index < rainCount; index++) {
        const travel = Math.floor(tick * (0.55 + (index % 4) * 0.12) * scale)
        const headColumn = (index * 47 + travel) % cols
        const rawRow = (index * 31 - travel) % rows
        const headRow = (rawRow + rows) % rows
        const length = (2 + (index % 3) + (flash > 0 ? 2 : 0)) * scale
        const rain = flash > 0 ? '#eef7ff' : index % 3 === 0 ? '#9cc9ff' : '#6fa7ed'
        for (let offset = 0; offset < length; offset++) {
          const column = headColumn - offset
          const row = headRow + offset
          if (column >= 0 && column < cols && row >= 0 && row < rows) {
            cell(column, row, rain)
          }
        }
      }
    },
  }
}
