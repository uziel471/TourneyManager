import { DataTypes, Model, type Sequelize } from "sequelize"
import type { CardAttributes, CardCreationAttributes } from "../types"

export class Card extends Model<CardAttributes, CardCreationAttributes> implements CardAttributes {
  public id!: string
  public matchId!: string
  public playerId!: string
  public cardType!: "yellow" | "red"
  public minute!: number
  public reason?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initCard = (sequelize: Sequelize): typeof Card => {
  Card.init(
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
      cardType: {
        type: DataTypes.ENUM("yellow", "red"),
        allowNull: false,
      },
      minute: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 120,
        },
      },
      reason: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "cards",
      timestamps: true,
    },
  )

  return Card
}
