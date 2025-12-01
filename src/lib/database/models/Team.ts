import { DataTypes, Model } from "sequelize";
import sequelize from "../config";
import type { ModelsType } from "./index";

class Team extends Model {
	public id!: string;
	public name!: string;
	public active!: boolean;
	public owner_id?: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	static associate(models: ModelsType) {
		Team.belongsTo(models.Person, { foreignKey: "owner_id", as: "owner" });
		Team.belongsToMany(models.Person, {
			through: models.TeamsHasPersons,
			foreignKey: "team_id",
			otherKey: "person_id",
			as: "members",
		});
	}
}

Team.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		active: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 1,
		},
		owner_id: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: "person",
				key: "id",
			},
		},
	},
	{
		sequelize,
		modelName: "team",
		tableName: "team",
		timestamps: true,
	}
);

export default Team;
