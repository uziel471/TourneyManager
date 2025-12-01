import { DataTypes, Model, type Sequelize } from "sequelize"
import type { FoulAttributes, FoulCreationAttributes } from "../types"

export class Foul extends Model<FoulAttributes, FoulCreationAttributes> implements FoulAttributes {
  public id!: string
  public matchId!: string
  public playerId!: string
  public minute!: number
  public foulType!: "minor" | "major" | "technical"
  public description?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initFoul = (sequelize: Sequelize): typeof Foul => {
  Foul.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      matchId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "matches",
          key: "id",
        },
      },
      playerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      minute: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 120,
        },
      },
      foulType: {
        type: DataTypes.ENUM("minor", "major", "technical"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "fouls",
      timestamps: true,
    },
  )

  return Foul
}
