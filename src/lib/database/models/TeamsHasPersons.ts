import { DataTypes, Model } from "sequelize";
import sequelize from "../config";

class TeamsHasPersons extends Model {
	public team_id!: string;
	public person_id!: string;
}

TeamsHasPersons.init(
	{
		team_id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			references: {
				model: "team",
				key: "id",
			},
		},
		person_id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			references: {
				model: "person",
				key: "id",
			},
		},
	},
	{
		sequelize,
		modelName: "TeamsHasPersons",
		tableName: "teams_has_persons",
		timestamps: false,
	}
);

export default TeamsHasPersons;
