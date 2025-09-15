export enum TeamCategory {
  Primera = "Primera",
  Segunda = "Segunda",
  Juvenil = "Juvenil",
  Infantil = "Infantil",
}

export enum TeamStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

export interface Team {
  id: string
  name: string
  logo?: string
  category: TeamCategory
  coach: string
  coachPhone: string
  coachEmail: string
  foundedYear: number
  homeVenue: string
  status: TeamStatus
  playersCount: number
  tournaments: string[]
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export interface TeamFormData {
  name: string
  logo?: string
  category: TeamCategory
  coach: string
  coachPhone: string
  coachEmail: string
  foundedYear: number
  homeVenue: string
  status: TeamStatus
}