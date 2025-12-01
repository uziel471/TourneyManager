export interface UserAttributes {
  id: string
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: "admin" | "organizer" | "player"
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface TournamentAttributes {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  maxTeams: number
  status: "draft" | "registration" | "active" | "completed" | "cancelled"
  organizerId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TeamAttributes {
  id: string
  name: string
  description?: string
  logo?: string
  foundedDate?: string
  captainId?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface TournamentTeamAttributes {
  id: string
  tournamentId: string
  teamId: string
  registrationDate: Date
  points: number
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  position?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface PlayerTeamAttributes {
  id: string
  userId: string
  teamId: string
  tournamentId: string
  jerseyNumber: number
  position: "goalkeeper" | "defender" | "midfielder" | "forward"
  joinDate: Date
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchAttributes {
  id: string
  tournamentId: string
  homeTeamId: string
  awayTeamId: string
  matchDate: Date
  homeScore?: number
  awayScore?: number
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "postponed"
  round?: number
  venue?: string
  refereeId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface PlayerStatisticAttributes {
  id: string
  userId: string
  tournamentId: string
  matchesPlayed: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  fouls: number
  minutesPlayed: number
  createdAt?: Date
  updatedAt?: Date
}

export interface GoalAttributes {
  id: string
  matchId: string
  playerId: string
  assistPlayerId?: string
  minute: number
  goalType: "regular" | "penalty" | "own_goal" | "free_kick"
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CardAttributes {
  id: string
  matchId: string
  playerId: string
  cardType: "yellow" | "red"
  minute: number
  reason?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface FoulAttributes {
  id: string
  matchId: string
  playerId: string
  minute: number
  foulType: "minor" | "major" | "technical"
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

// Creation attributes (optional fields for creation)
export type UserCreationAttributes = Omit<UserAttributes, "id" | "createdAt" | "updatedAt">
export type TournamentCreationAttributes = Omit<TournamentAttributes, "id" | "createdAt" | "updatedAt">
export type TeamCreationAttributes = Omit<TeamAttributes, "id" | "createdAt" | "updatedAt">
export type TournamentTeamCreationAttributes = Omit<TournamentTeamAttributes, "id" | "createdAt" | "updatedAt">
export type PlayerTeamCreationAttributes = Omit<PlayerTeamAttributes, "id" | "createdAt" | "updatedAt">
export type MatchCreationAttributes = Omit<MatchAttributes, "id" | "createdAt" | "updatedAt">
export type PlayerStatisticCreationAttributes = Omit<PlayerStatisticAttributes, "id" | "createdAt" | "updatedAt">
export type GoalCreationAttributes = Omit<GoalAttributes, "id" | "createdAt" | "updatedAt">
export type CardCreationAttributes = Omit<CardAttributes, "id" | "createdAt" | "updatedAt">
export type FoulCreationAttributes = Omit<FoulAttributes, "id" | "createdAt" | "updatedAt">
