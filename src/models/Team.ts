import { DataTypes, Model, type Sequelize } from "sequelize"
import type { TeamAttributes, TeamCreationAttributes } from "../types"

export class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
  public id!: string
  public name!: string
  public description?: string
  public logo?: string
  public foundedDate?: string
  public captainId?: string
  public isActive!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export const initTeam = (sequelize: Sequelize): typeof Team => {
  Team.init(
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
      logo: {
        type: DataTypes.STRING,
      },
      foundedDate: {
        type: DataTypes.DATEONLY,
      },
      captainId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "teams",
      timestamps: true,
    },
  )

  return Team
}
