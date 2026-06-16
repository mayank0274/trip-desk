export type Trip = {
  name: string
  slug: string
  origin: string
  destination: string
  start_date: string
  end_date: string
  price: number
  total_seats: number
  status: "open" | "closed"
  id: string
  description: string
  thumbnail: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface TripsResponse {
  data: {
    trips: Trip[]
    pagination: Pagination
  }
  message: string
}
