import sequelize from "../config";
import Category from "./Category";
import Role from "./Role";
import Person from "./Person";
import Fields from "./Fields";
import Team from "./Team";
import TeamsHasPersons from "./TeamsHasPersons";

const models = {
	Category,
	Role,
	Person,
	Fields,
	Team,
	TeamsHasPersons,
};

export type ModelsType = typeof models;

const initializeAssociations = () => {
	Object.values(models).forEach((model) => {
		if ("associate" in model && typeof model.associate === "function") {
			model.associate(models);
		}
	});
};

export {
	sequelize,
	Category,
	Role,
	Person,
	Fields,
	Team,
	TeamsHasPersons,
	initializeAssociations,
};
