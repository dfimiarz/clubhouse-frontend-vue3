export interface PassInfo {
  host: number
  guest: number
  pass_type: number
}

export interface OverlapInfo {
  date: string
  start: string
  end: string
  court: number
}

export interface ImageSrc {
  name: string
  src: string
}

export interface ClubInfo {
  id: number
  name: string
  time_zone: string
  dafault_cal_start: string
  default_cal_end: string
  default_cal_start_min: number
  default_cal_end_min: number
  images: ImageSrc[]
}
