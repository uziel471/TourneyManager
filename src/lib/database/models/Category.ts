import { DataTypes, Model } from "sequelize";
import sequelize from "../config";
import type { ModelsType } from "./index";

class Category extends Model {
	public id!: string;
	public name!: string;
	public active!: boolean;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	static associate(models: ModelsType) {
		Category.hasMany(models.Person, {
			foreignKey: "category_id",
			as: "persons",
		});
	}
}

Category.init(
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
		modelName: "category",
		tableName: "category",
		timestamps: true,
	}
);

export default Category;
