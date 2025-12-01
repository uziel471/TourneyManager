import sequelize from "./config";
import { initializeAssociations } from "./models";

const initializeDatabase = async () => {
	try {
		// Probar la conexión
		await sequelize.authenticate();
		console.log("Conexión a MySQL establecida correctamente.");

		// Inicializar las asociaciones
		initializeAssociations();

		// Sincronizar los modelos (crear tablas si no existen)
		// En producción, usa migraciones en lugar de sync
		if (process.env.NODE_ENV === "development") {
			await sequelize.sync({ alter: true });
			console.log("Modelos sincronizados con la base de datos.");
		}

		return sequelize;
	} catch (error) {
		console.error("No se pudo conectar a la base de datos:", error);
		throw error;
	}
};

export default initializeDatabase;
