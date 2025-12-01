import { DataTypes, Model, type Sequelize } from "sequelize"
import type { PlayerTeamAttributes, PlayerTeamCreationAttributes } from "../types"

export class PlayerTeam
  extends Model<PlayerTeamAttributes, PlayerTeamCreationAttributes>
  implements PlayerTeamAttributes
{
  public id!: string
  public userId!: string
  public teamId!: string
  public tournamentId!: string
  public jerseyNumber!: number
  public position!: "goalkeeper" | "defender" | "midfielder" | "forward"
  public joinDate!: Date
  public isActive!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initPlayerTeam = (sequelize: Sequelize): typeof PlayerTeam => {
  PlayerTeam.init(
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
      teamId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "teams",
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
      jerseyNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 99,
        },
      },
      position: {
        type: DataTypes.ENUM("goalkeeper", "defender", "midfielder", "forward"),
        allowNull: false,
      },
      joinDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "player_teams",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "tournamentId"],
        },
        {
          unique: true,
          fields: ["teamId", "tournamentId", "jerseyNumber"],
        },
      ],
    },
  )

  return PlayerTeam
}
