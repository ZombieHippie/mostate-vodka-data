
export interface DataSponsor {
  name: string
  letters: string
  twitter: string
  nickname?: string
  colors?: string[]
}

export interface DataEvent {
  sponsor: DataSponsor
  description: string
  startTime: number
  endTime?: number
  location: string
  locationAddress?: string
  meetTime?: number
  meetLocation?: string
  meetLocationAddress?: string
}
