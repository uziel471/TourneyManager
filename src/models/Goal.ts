import { DataTypes, Model, type Sequelize } from "sequelize"
import type { GoalAttributes, GoalCreationAttributes } from "../types"

export class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: string
  public matchId!: string
  public playerId!: string
  public assistPlayerId?: string
  public minute!: number
  public goalType!: "regular" | "penalty" | "own_goal" | "free_kick"
  public description?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initGoal = (sequelize: Sequelize): typeof Goal => {
  Goal.init(
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
      assistPlayerId: {
        type: DataTypes.UUID,
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
      goalType: {
        type: DataTypes.ENUM("regular", "penalty", "own_goal", "free_kick"),
        defaultValue: "regular",
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      tableName: "goals",
      timestamps: true,
    },
  )

  return Goal
}
