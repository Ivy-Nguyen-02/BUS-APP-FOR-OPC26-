import { ROUTE_SEGMENTS, STOP_COORDS } from './route-08-geometry'

export type LatLng = [number, number]

export const MAP_COLORS = {
  passenger: '#16a34a',
  driver: '#1d4ed8',
  passed: '#9ca3af',
  free: '#16a34a',
  busy: '#eab308',
  jam: '#dc2626',
} as const

// `assisted`: a visually impaired rider has requested boarding help at this stop.
export const ROUTE_08_STOPS = [
  { id: 'bx-q8', name: 'Bến xe Quận 8', assisted: false },
  { id: 'bach-khoa', name: 'ĐH Bách Khoa', assisted: true },
  { id: 'bay-hien', name: 'Ngã tư Bảy Hiền', assisted: false },
  { id: 'hoang-van-thu', name: 'Công viên Hoàng Văn Thụ', assisted: false },
  { id: 'phu-nhuan', name: 'Ngã tư Phú Nhuận', assisted: false },
  { id: 'hang-xanh', name: 'Ngã tư Hàng Xanh', assisted: false },
  { id: 'thu-duc', name: 'Ngã tư Thủ Đức', assisted: true },
  { id: 'dhqg', name: 'ĐH Quốc gia', assisted: false },
].map((stop, index) => ({ ...stop, position: STOP_COORDS[index] as LatLng }))

export const ROUTE_08_SEGMENTS = ROUTE_SEGMENTS as LatLng[][]
export const SEGMENTS_PER_LEG = 3

export type BusRoute = {
  number: string
  name: string
  hours: string
  frequency: string
  fare: string
  operator: string
}

export const BUS_ROUTES: BusRoute[] = [
  { number: '08', name: 'Bến xe Quận 8 – ĐH Quốc gia', hours: '04:40 – 20:30', frequency: '8–12 phút/chuyến', fare: '7.000đ', operator: 'HTX Quyết Thắng' },
  { number: '10', name: 'ĐH Quốc gia – Bến xe Miền Tây', hours: '05:00 – 19:00', frequency: '10–15 phút/chuyến', fare: '7.000đ', operator: 'HTX 19/5' },
  { number: '19', name: 'Bến Thành – KCX Linh Trung – ĐH Quốc gia', hours: '05:00 – 19:00', frequency: '6–10 phút/chuyến', fare: '7.000đ', operator: 'Cty Xe khách Sài Gòn' },
  { number: '33', name: 'Bến xe An Sương – ĐH Quốc gia', hours: '05:00 – 20:00', frequency: '10–15 phút/chuyến', fare: '7.000đ', operator: 'HTX Quyết Thắng' },
  { number: '38', name: 'KDC Tân Quy Đông – Chợ Đầm Sen', hours: '05:15 – 19:00', frequency: '15–20 phút/chuyến', fare: '6.000đ', operator: 'HTX 19/5' },
  { number: '56', name: 'Chợ Lớn – ĐH Giao thông Vận tải', hours: '05:00 – 19:00', frequency: '12–15 phút/chuyến', fare: '6.000đ', operator: 'Cty Xe khách Sài Gòn' },
  { number: '93', name: 'Bến Thành – ĐH Nông Lâm', hours: '05:00 – 19:15', frequency: '8–12 phút/chuyến', fare: '7.000đ', operator: 'HTX Quyết Thắng' },
  { number: '150', name: 'Chợ Lớn – Ngã 3 Tân Vạn', hours: '04:30 – 20:00', frequency: '6–12 phút/chuyến', fare: '7.000đ', operator: 'Cty Xe khách Sài Gòn' },
]

export const USER_LOCATION: LatLng = [10.7712, 106.6589]

export type NearbyStop = {
  id: string
  name: string
  street: string
  distance: string
  position: LatLng
  waiting: number
  arrivals: { route: string; minutes: number; crowd: 'Vắng' | 'Vừa' | 'Đông' }[]
}

export const NEARBY_STOPS: NearbyStop[] = [
  {
    id: 'bk',
    name: 'ĐH Bách Khoa',
    street: '268 Lý Thường Kiệt',
    distance: '120 m',
    position: [10.77254, 106.65765],
    waiting: 12,
    arrivals: [
      { route: '08', minutes: 3, crowd: 'Vừa' },
      { route: '10', minutes: 7, crowd: 'Vắng' },
      { route: '56', minutes: 12, crowd: 'Đông' },
    ],
  },
  {
    id: 'phu-tho',
    name: 'Nhà thi đấu Phú Thọ',
    street: '1 Lữ Gia',
    distance: '350 m',
    position: [10.7676, 106.6587],
    waiting: 5,
    arrivals: [
      { route: '08', minutes: 5, crowd: 'Vắng' },
      { route: '38', minutes: 9, crowd: 'Vừa' },
    ],
  },
  {
    id: 'trung-vuong',
    name: 'Bệnh viện Trưng Vương',
    street: '266 Lý Thường Kiệt',
    distance: '480 m',
    position: [10.7745, 106.6604],
    waiting: 8,
    arrivals: [
      { route: '93', minutes: 4, crowd: 'Đông' },
      { route: '150', minutes: 11, crowd: 'Vừa' },
    ],
  },
]

export type GuideStep = { kind: 'walk' | 'bus' | 'transfer' | 'arrive'; text: string }

export type Trip = {
  id: number
  name: string
  destination: string
  route: string
  duration: string
  steps: GuideStep[]
}

export const FAVORITE_TRIPS: Trip[] = [
  {
    id: 1,
    name: 'Đến trường',
    destination: 'ĐH Quốc gia',
    route: '08',
    duration: '55 phút',
    steps: [
      { kind: 'walk', text: 'Đi bộ 120 mét đến trạm ĐH Bách Khoa.' },
      { kind: 'bus', text: 'Đón xe buýt số 08, đi 6 trạm.' },
      { kind: 'arrive', text: 'Xuống tại trạm ĐH Quốc gia.' },
    ],
  },
  {
    id: 2,
    name: 'Đi chợ Bến Thành',
    destination: 'Chợ Bến Thành',
    route: '93',
    duration: '30 phút',
    steps: [
      { kind: 'walk', text: 'Đi bộ 480 mét đến trạm Bệnh viện Trưng Vương.' },
      { kind: 'bus', text: 'Đón xe buýt số 93, đi 9 trạm.' },
      { kind: 'arrive', text: 'Xuống tại trạm Chợ Bến Thành.' },
    ],
  },
  {
    id: 3,
    name: 'Đến bệnh viện Chợ Rẫy',
    destination: 'Bệnh viện Chợ Rẫy',
    route: '56',
    duration: '20 phút',
    steps: [
      { kind: 'walk', text: 'Đi bộ 120 mét đến trạm ĐH Bách Khoa.' },
      { kind: 'bus', text: 'Đón xe buýt số 56, đi 5 trạm.' },
      { kind: 'arrive', text: 'Xuống tại trạm Bệnh viện Chợ Rẫy.' },
    ],
  },
]

export const HOME_TRIP: Trip = {
  id: 0,
  name: 'Về nhà',
  destination: 'Nhà – Bến xe Quận 8',
  route: '08',
  duration: '25 phút',
  steps: [
    { kind: 'walk', text: 'Đi bộ 350 mét đến trạm Nhà thi đấu Phú Thọ.' },
    { kind: 'bus', text: 'Đón xe buýt số 08 hướng Bến xe Quận 8. Xe đến sau 5 phút.' },
    { kind: 'arrive', text: 'Xuống tại trạm cuối Bến xe Quận 8, đi bộ 200 mét về nhà.' },
  ],
}

const KNOWN_PLACES: { keywords: string[]; trip: Omit<Trip, 'id'> }[] = [
  {
    keywords: ['bến thành', 'ben thanh', 'chợ'],
    trip: FAVORITE_TRIPS[1],
  },
  {
    keywords: ['quốc gia', 'làng đại học', 'thủ đức'],
    trip: FAVORITE_TRIPS[0],
  },
  {
    keywords: ['chợ rẫy', 'bệnh viện'],
    trip: FAVORITE_TRIPS[2],
  },
  {
    keywords: ['miền đông', 'hàng xanh'],
    trip: {
      name: 'Đến Bến xe Miền Đông',
      destination: 'Bến xe Miền Đông',
      route: '08',
      duration: '40 phút',
      steps: [
        { kind: 'walk', text: 'Đi bộ 120 mét đến trạm ĐH Bách Khoa.' },
        { kind: 'bus', text: 'Đón xe buýt số 08, xuống tại Ngã tư Hàng Xanh.' },
        { kind: 'transfer', text: 'Đổi sang xe buýt số 19, đi 2 trạm.' },
        { kind: 'arrive', text: 'Xuống tại trạm Bến xe Miền Đông.' },
      ],
    },
  },
]

export function findTripForPlace(spoken: string): Trip {
  const text = spoken.toLowerCase()
  const match = KNOWN_PLACES.find((place) => place.keywords.some((k) => text.includes(k)))
  if (match) return { id: -1, ...match.trip }
  const destination = spoken.trim() || 'điểm đến'
  return {
    id: -1,
    name: `Đến ${destination}`,
    destination,
    route: '19',
    duration: '35 phút',
    steps: [
      { kind: 'walk', text: 'Đi bộ 120 mét đến trạm ĐH Bách Khoa.' },
      { kind: 'bus', text: `Đón xe buýt số 19 hướng ${destination}.` },
      { kind: 'arrive', text: `Xuống tại trạm gần ${destination} nhất. Ứng dụng sẽ báo trước khi đến trạm.` },
    ],
  }
}

export function tripToSpeech(trip: Trip) {
  return `${trip.name}. Tổng thời gian khoảng ${trip.duration}. ${trip.steps
    .map((step, i) => `Bước ${i + 1}: ${step.text}`)
    .join(' ')}`
}
