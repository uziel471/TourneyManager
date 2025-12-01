import { DataTypes, Model } from "sequelize";
import sequelize from "../config";

class Fields extends Model {
	public id!: string;
	public name!: string;
	public active!: boolean;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Fields.init(
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
		modelName: "Fields",
		tableName: "fields",
	}
);

export default Fields;
