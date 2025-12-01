import { DataTypes, Model } from "sequelize";
import sequelize from "../config";
import type { ModelsType } from "./index";

class Role extends Model {
	public id!: string;
	public name!: string;
	public active!: boolean;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	static associate(models: ModelsType) {
		// Role has many Persons
		Role.hasMany(models.Person, { foreignKey: "role_id", as: "persons" });
	}
}

Role.init(
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
	},
	{
		sequelize,
		modelName: "role",
		tableName: "role",
	}
);

export default Role;
