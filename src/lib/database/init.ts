import sequelize from "./config";
import { initializeAssociations } from "./models";

let isInitialized = false;

const initializeDatabase = async () => {
	if (!isInitialized) {
		try {
			await sequelize.authenticate();
			console.log("✅ Conexión a MySQL establecida correctamente.");

			initializeAssociations();
			console.log("✅ Asociaciones de modelos inicializadas.");
			// Sincronizar los modelos (crear tablas si no existen)
			// En producción, usa migraciones en lugar de sync
			if (process.env.NODE_ENV === "development") {
				await sequelize.sync({ alter: true });
				console.log("✅ Modelos sincronizados con la base de datos.");
			}

			isInitialized = true;
			return sequelize;
		} catch (error) {
			console.error("❌ No se pudo conectar a la base de datos:", error);
			throw error;
		}
	}

	return sequelize;
};

export function isDatabaseInitialized(): boolean {
	return isInitialized;
}

export function resetInitialization(): void {
	isInitialized = false;
}

export default initializeDatabase;
