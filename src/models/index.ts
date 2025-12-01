import type { Sequelize, Op } from "sequelize"
import { initUser, type User } from "./User"
import { initTournament, type Tournament } from "./Tournament"
import { initTeam, type Team } from "./Team"
import { initTournamentTeam, type TournamentTeam } from "./TournamentTeam"
import { initPlayerTeam, type PlayerTeam } from "./PlayerTeam"
import { initMatch, type Match } from "./Match"
import { initPlayerStatistic, type PlayerStatistic } from "./PlayerStatistic"
import { initGoal, type Goal } from "./Goal"
import { initCard, type Card } from "./Card"
import { initFoul, type Foul } from "./Foul"

export interface DB {
  sequelize: Sequelize
  User: typeof User
  Tournament: typeof Tournament
  Team: typeof Team
  TournamentTeam: typeof TournamentTeam
  PlayerTeam: typeof PlayerTeam
  Match: typeof Match
  PlayerStatistic: typeof PlayerStatistic
  Goal: typeof Goal
  Card: typeof Card
  Foul: typeof Foul
}

export const initializeDatabase = (sequelize: Sequelize): DB => {
  // Initialize all models
  const models = {
    User: initUser(sequelize),
    Tournament: initTournament(sequelize),
    Team: initTeam(sequelize),
    TournamentTeam: initTournamentTeam(sequelize),
    PlayerTeam: initPlayerTeam(sequelize),
    Match: initMatch(sequelize),
    PlayerStatistic: initPlayerStatistic(sequelize),
    Goal: initGoal(sequelize),
    Card: initCard(sequelize),
    Foul: initFoul(sequelize),
  }

  // Define associations
  // User associations
  models.User.hasMany(models.Tournament, { foreignKey: "organizerId", as: "organizedTournaments" })
  models.User.hasMany(models.PlayerTeam, { foreignKey: "userId", as: "playerTeams" })
  models.User.hasMany(models.PlayerStatistic, { foreignKey: "userId", as: "statistics" })
  models.User.hasMany(models.Goal, { foreignKey: "playerId", as: "goals" })
  models.User.hasMany(models.Goal, { foreignKey: "assistPlayerId", as: "assists" })
  models.User.hasMany(models.Card, { foreignKey: "playerId", as: "cards" })
  models.User.hasMany(models.Foul, { foreignKey: "playerId", as: "fouls" })
  models.User.hasMany(models.Match, { foreignKey: "refereeId", as: "refereesMatches" })

  // Tournament associations
  models.Tournament.belongsTo(models.User, { foreignKey: "organizerId", as: "organizer" })
  models.Tournament.hasMany(models.TournamentTeam, { foreignKey: "tournamentId", as: "tournamentTeams" })
  models.Tournament.hasMany(models.PlayerTeam, { foreignKey: "tournamentId", as: "playerTeams" })
  models.Tournament.hasMany(models.Match, { foreignKey: "tournamentId", as: "matches" })
  models.Tournament.hasMany(models.PlayerStatistic, { foreignKey: "tournamentId", as: "playerStatistics" })

  // Team associations
  models.Team.belongsTo(models.User, { foreignKey: "captainId", as: "captain" })
  models.Team.hasMany(models.TournamentTeam, { foreignKey: "teamId", as: "tournamentTeams" })
  models.Team.hasMany(models.PlayerTeam, { foreignKey: "teamId", as: "playerTeams" })
  models.Team.hasMany(models.Match, { foreignKey: "homeTeamId", as: "homeMatches" })
  models.Team.hasMany(models.Match, { foreignKey: "awayTeamId", as: "awayMatches" })

  // TournamentTeam associations
  models.TournamentTeam.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" })
  models.TournamentTeam.belongsTo(models.Team, { foreignKey: "teamId", as: "team" })

  // PlayerTeam associations
  models.PlayerTeam.belongsTo(models.User, { foreignKey: "userId", as: "player" })
  models.PlayerTeam.belongsTo(models.Team, { foreignKey: "teamId", as: "team" })
  models.PlayerTeam.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" })

  // Match associations
  models.Match.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" })
  models.Match.belongsTo(models.Team, { foreignKey: "homeTeamId", as: "homeTeam" })
  models.Match.belongsTo(models.Team, { foreignKey: "awayTeamId", as: "awayTeam" })
  models.Match.belongsTo(models.User, { foreignKey: "refereeId", as: "referee" })
  models.Match.hasMany(models.Goal, { foreignKey: "matchId", as: "goals" })
  models.Match.hasMany(models.Card, { foreignKey: "matchId", as: "cards" })
  models.Match.hasMany(models.Foul, { foreignKey: "matchId", as: "fouls" })

  // PlayerStatistic associations
  models.PlayerStatistic.belongsTo(models.User, { foreignKey: "userId", as: "player" })
  models.PlayerStatistic.belongsTo(models.Tournament, { foreignKey: "tournamentId", as: "tournament" })

  // Goal associations
  models.Goal.belongsTo(models.Match, { foreignKey: "matchId", as: "match" })
  models.Goal.belongsTo(models.User, { foreignKey: "playerId", as: "player" })
  models.Goal.belongsTo(models.User, { foreignKey: "assistPlayerId", as: "assistPlayer" })

  // Card associations
  models.Card.belongsTo(models.Match, { foreignKey: "matchId", as: "match" })
  models.Card.belongsTo(models.User, { foreignKey: "playerId", as: "player" })

  // Foul associations
  models.Foul.belongsTo(models.Match, { foreignKey: "matchId", as: "match" })
  models.Foul.belongsTo(models.User, { foreignKey: "playerId", as: "player" })

  return {
    sequelize,
    ...models,
  }
}

export type { Op }
export * from "./User"
export * from "./Tournament"
export * from "./Team"
export * from "./TournamentTeam"
export * from "./PlayerTeam"
export * from "./Match"
export * from "./PlayerStatistic"
export * from "./Goal"
export * from "./Card"
export * from "./Foul"
