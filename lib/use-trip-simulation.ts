'use client'

import { useEffect, useMemo, useState } from 'react'
import { MAP_COLORS, ROUTE_08_SEGMENTS, ROUTE_08_STOPS, SEGMENTS_PER_LEG, type LatLng } from './bus-data'

export type TrafficLevel = 'free' | 'busy' | 'jam'

type Chunk = { start: number; end: number; leg: number }

const POINTS: LatLng[] = []
const STOP_INDEX: number[] = []
ROUTE_08_SEGMENTS.forEach((leg, legIndex) => {
  STOP_INDEX[legIndex] = POINTS.length === 0 ? 0 : POINTS.length - 1
  leg.forEach((p, i) => {
    if (legIndex > 0 && i === 0) return
    POINTS.push(p)
  })
})
STOP_INDEX[ROUTE_08_SEGMENTS.length] = POINTS.length - 1

const CHUNKS: Chunk[] = []
for (let leg = 0; leg < ROUTE_08_SEGMENTS.length; leg++) {
  const from = STOP_INDEX[leg]
  const to = STOP_INDEX[leg + 1]
  const size = Math.max(1, Math.ceil((to - from) / SEGMENTS_PER_LEG))
  for (let s = from; s < to; s += size) {
    CHUNKS.push({ start: s, end: Math.min(to, s + size), leg })
  }
}

const TRAFFIC_PATTERN: TrafficLevel[] = ['free', 'busy', 'free', 'jam', 'busy', 'free', 'free', 'busy', 'jam', 'free', 'busy']
const TICK_MS = 1000
const PLANNED_TICKS_PER_POINT = 1.6
const TICKS_PER_POINT: Record<TrafficLevel, number> = { free: 1, busy: 2, jam: 4 }
const AVG_SPEED_KMH: Record<TrafficLevel, number> = { free: 28, busy: 16, jam: 6 }
const BASE_WAITING = [4, 12, 7, 5, 9, 15, 6, 3]
const START_INDEX = Math.floor(STOP_INDEX[1] * 0.45)

function trafficFor(chunkIndex: number, phase: number): TrafficLevel {
  return TRAFFIC_PATTERN[(chunkIndex + phase) % TRAFFIC_PATTERN.length]
}

function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function pathDistance(from: number, to: number) {
  let total = 0
  for (let i = from; i < to; i++) total += distanceMeters(POINTS[i], POINTS[i + 1])
  return total
}

export function useTripSimulation() {
  const [state, setState] = useState({ index: START_INDEX, ticks: 0, carry: 0 })

  const phase = Math.floor(state.ticks / 45)
  const chunkAtBus = Math.max(0, CHUNKS.findIndex((c) => state.index >= c.start && state.index < c.end))
  const levelAtBus = trafficFor(chunkAtBus, phase)

  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => {
        const chunk = Math.max(0, CHUNKS.findIndex((c) => prev.index >= c.start && prev.index < c.end))
        const level = trafficFor(chunk, Math.floor(prev.ticks / 45))
        const carry = prev.carry + 1
        const advance = carry >= TICKS_PER_POINT[level]
        let index = advance ? prev.index + 1 : prev.index
        let ticks = prev.ticks + 1
        if (index >= POINTS.length - 1) {
          index = START_INDEX
          ticks = 0
        }
        return { index, ticks, carry: advance ? 0 : carry }
      })
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    const position = POINTS[state.index]

    const segments = CHUNKS.flatMap((chunk, i) => {
      const color = MAP_COLORS[trafficFor(i, phase)]
      if (chunk.end <= state.index) {
        return [{ positions: POINTS.slice(chunk.start, chunk.end + 1), color: MAP_COLORS.passed, weight: 6, opacity: 0.7 }]
      }
      if (chunk.start < state.index) {
        return [
          { positions: POINTS.slice(chunk.start, state.index + 1), color: MAP_COLORS.passed, weight: 6, opacity: 0.7 },
          { positions: POINTS.slice(state.index, chunk.end + 1), color, weight: 8 },
        ]
      }
      return [{ positions: POINTS.slice(chunk.start, chunk.end + 1), color, weight: 8 }]
    })

    const nextStopIdx = STOP_INDEX.findIndex((pointIndex) => pointIndex > state.index)
    const waitingJitter = (stop: number) => ((state.ticks >> 3) + stop * 3) % 3 - 1

    const upcoming = ROUTE_08_STOPS.map((stop, i) => {
      const meters = i >= nextStopIdx ? pathDistance(state.index, STOP_INDEX[i]) : 0
      const etaMin = Math.max(1, Math.round(meters / ((AVG_SPEED_KMH[levelAtBus] * 1000) / 60)))
      return {
        ...stop,
        order: i,
        passed: i < nextStopIdx,
        meters,
        etaMin,
        waiting: Math.max(0, BASE_WAITING[i] + waitingJitter(i)),
      }
    })

    const plannedIndex = START_INDEX + state.ticks / PLANNED_TICKS_PER_POINT
    const deviationSeconds = Math.round((plannedIndex - state.index) * PLANNED_TICKS_PER_POINT * 6)

    const trafficAhead = CHUNKS.slice(chunkAtBus, chunkAtBus + 4).map((_, offset) => trafficFor(chunkAtBus + offset, phase))

    return {
      position,
      segments,
      stops: upcoming,
      nextStop: upcoming[nextStopIdx] ?? upcoming[upcoming.length - 1],
      levelAtBus,
      trafficAhead,
      deviationSeconds,
      speedKmh: AVG_SPEED_KMH[levelAtBus],
    }
  }, [state, phase, chunkAtBus, levelAtBus])
}
