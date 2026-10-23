'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import type { LatLng } from '@/lib/bus-data'

export type MapSegment = { positions: LatLng[]; color: string; weight?: number; opacity?: number }
export type MapStop = {
  id: string
  name: string
  position: LatLng
  badge?: string
  tone?: 'passenger' | 'driver' | 'muted'
  highlight?: boolean
}

export type BusMapProps = {
  center: LatLng
  zoom?: number
  segments?: MapSegment[]
  stops?: MapStop[]
  bus?: { position: LatLng; label: string }
  user?: LatLng
  radiusMeters?: number
  follow?: LatLng
}

const BUS_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>'

function stopIcon(stop: MapStop) {
  const toneClass =
    stop.tone === 'driver'
      ? 'bg-driver text-driver-foreground'
      : stop.tone === 'muted'
        ? 'bg-muted-foreground text-white'
        : 'bg-passenger text-passenger-foreground'
  const ring = stop.highlight ? 'ring-4 ring-traffic-busy' : 'ring-2 ring-white'
  const content = stop.badge
    ? `<span class="text-[11px] font-bold leading-none">${stop.badge}</span>`
    : '<span class="block size-2 rounded-full bg-white"></span>'
  return L.divIcon({
    className: '',
    html: `<div class="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 shadow-md ${toneClass} ${ring}">${content}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function busIcon(label: string) {
  return L.divIcon({
    className: '',
    html: `<div class="flex items-center gap-1 rounded-full bg-driver py-1 pl-1.5 pr-2.5 text-driver-foreground shadow-lg ring-4 ring-white">${BUS_SVG}<span class="text-xs font-bold">${label}</span></div>`,
    iconSize: [72, 30],
    iconAnchor: [36, 15],
  })
}

const userIcon = L.divIcon({
  className: '',
  html: '<div class="relative flex size-5 items-center justify-center"><span class="absolute inline-flex size-full animate-ping rounded-full bg-sky-500/50"></span><span class="relative size-4 rounded-full border-[3px] border-white bg-sky-600 shadow"></span></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function FollowPosition({ position }: { position?: LatLng }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.panTo(position, { animate: true, duration: 1 })
  }, [map, position])
  return null
}

export default function BusMap({
  center,
  zoom = 15,
  segments = [],
  stops = [],
  bus,
  user,
  radiusMeters,
  follow,
}: BusMapProps) {
  const icons = useMemo(() => new Map(stops.map((s) => [s.id, stopIcon(s)])), [stops])
  const currentBusIcon = useMemo(() => (bus ? busIcon(bus.label) : null), [bus])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="size-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {segments.map((segment, i) => (
        <Polyline
          key={i}
          positions={segment.positions}
          pathOptions={{
            color: segment.color,
            weight: segment.weight ?? 7,
            opacity: segment.opacity ?? 0.95,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      ))}
      {bus && radiusMeters ? (
        <Circle
          center={bus.position}
          radius={radiusMeters}
          pathOptions={{ color: '#1d4ed8', weight: 1.5, dashArray: '6 6', fillOpacity: 0.04 }}
        />
      ) : null}
      {stops.map((stop) => (
        <Marker key={stop.id} position={stop.position} icon={icons.get(stop.id)}>
          <Tooltip direction="top" offset={[0, -12]}>
            {stop.name}
          </Tooltip>
        </Marker>
      ))}
      {user ? <Marker position={user} icon={userIcon} /> : null}
      {bus && currentBusIcon ? (
        <Marker position={bus.position} icon={currentBusIcon} zIndexOffset={1000} />
      ) : null}
      <FollowPosition position={follow} />
    </MapContainer>
  )
}
