import { DataTypes, Model, type Sequelize } from "sequelize"
import type { TournamentAttributes, TournamentCreationAttributes } from "../types"

export class Tournament
  extends Model<TournamentAttributes, TournamentCreationAttributes>
  implements TournamentAttributes
{
  public id!: string
  public name!: string
  public description?: string
  public startDate!: string
  public endDate!: string
  public dayOfWeek!: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  public maxTeams!: number
  public status!: "draft" | "registration" | "active" | "completed" | "cancelled"
  public organizerId!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initTournament = (sequelize: Sequelize): typeof Tournament => {
  Tournament.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dayOfWeek: {
        type: DataTypes.ENUM("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"),
        allowNull: false,
      },
      maxTeams: {
        type: DataTypes.INTEGER,
        defaultValue: 16,
      },
      status: {
        type: DataTypes.ENUM("draft", "registration", "active", "completed", "cancelled"),
        defaultValue: "draft",
      },
      organizerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "tournaments",
      timestamps: true,
    },
  )

  return Tournament
}
