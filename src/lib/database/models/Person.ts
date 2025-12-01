import { DataTypes, Model } from "sequelize";
import sequelize from "../config";
import type { ModelsType } from "./index";

class Person extends Model {
	public id!: string;
	public name!: string;
	public last_name!: string;
	public email?: string;
	public cellphone!: string;
	public role_id!: string;
	public birth_date!: Date;
	public photo?: string;
	public active!: boolean;
	public category_id!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	static associate(models: ModelsType) {
		Person.belongsTo(models.Role, { foreignKey: "role_id", as: "role" });

		Person.belongsTo(models.Category, {
			foreignKey: "category_id",
			as: "category",
		});

		Person.hasMany(models.Team, { foreignKey: "owner_id", as: "ownedTeams" });

		Person.belongsToMany(models.Team, {
			through: models.TeamsHasPersons,
			foreignKey: "person_id",
			otherKey: "team_id",
			as: "teams",
		});
	}
}

Person.init(
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
		last_name: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: true,
		},
		cellphone: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		role_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "role",
				key: "id",
			},
		},
		birth_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		photo: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		active: {
			type: DataTypes.TINYINT,
			allowNull: false,
			defaultValue: 1,
		},
		category_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "category",
				key: "id",
			},
		},
	},
	{
		sequelize,
		modelName: "person",
		tableName: "person",
		timestamps: true,
	}
);

export default Person;
