import { DataTypes, Model, type Sequelize } from "sequelize"
import type { PlayerStatisticAttributes, PlayerStatisticCreationAttributes } from "../types"

export class PlayerStatistic
  extends Model<PlayerStatisticAttributes, PlayerStatisticCreationAttributes>
  implements PlayerStatisticAttributes
{
  public id!: string
  public userId!: string
  public tournamentId!: string
  public matchesPlayed!: number
  public goals!: number
  public assists!: number
  public yellowCards!: number
  public redCards!: number
  public fouls!: number
  public minutesPlayed!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initPlayerStatistic = (sequelize: Sequelize): typeof PlayerStatistic => {
  PlayerStatistic.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      tournamentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "tournaments",
          key: "id",
        },
      },
      matchesPlayed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      goals: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      assists: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      yellowCards: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      redCards: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      fouls: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      minutesPlayed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "player_statistics",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "tournamentId"],
        },
      ],
    },
  )

  return PlayerStatistic
}
