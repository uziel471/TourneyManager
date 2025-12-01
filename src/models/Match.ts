import { DataTypes, Model, type Sequelize } from "sequelize"
import type { MatchAttributes, MatchCreationAttributes } from "../types"

export class Match extends Model<MatchAttributes, MatchCreationAttributes> implements MatchAttributes {
  public id!: string
  public tournamentId!: string
  public homeTeamId!: string
  public awayTeamId!: string
  public matchDate!: Date
  public homeScore?: number
  public awayScore?: number
  public status!: "scheduled" | "in_progress" | "completed" | "cancelled" | "postponed"
  public round?: number
  public venue?: string
  public refereeId?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initMatch = (sequelize: Sequelize): typeof Match => {
  Match.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tournamentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "tournaments",
          key: "id",
        },
      },
      homeTeamId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "teams",
          key: "id",
        },
      },
      awayTeamId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "teams",
          key: "id",
        },
      },
      matchDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      homeScore: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      awayScore: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM("scheduled", "in_progress", "completed", "cancelled", "postponed"),
        defaultValue: "scheduled",
      },
      round: {
        type: DataTypes.INTEGER,
      },
      venue: {
        type: DataTypes.STRING,
      },
      refereeId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "matches",
      timestamps: true,
    },
  )

  return Match
}
