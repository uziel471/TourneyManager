import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	dialect: "mysql",
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "3306"),
	database: process.env.DB_NAME || "tourneymanager",
	username: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	logging: process.env.NODE_ENV === "development" ? console.log : false,
	define: {
		timestamps: true,
		underscored: true,
		freezeTableName: true,
	},
});

export default sequelize;
