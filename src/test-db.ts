import "dotenv/config";
import initializeDatabase from "./lib/database/init";

const testDatabaseConnection = async () => {
	console.log("🚀 Iniciando prueba de conexión a la base de datos...\n");

	try {
		// Inicializar la base de datos
		const sequelize = await initializeDatabase();

		console.log("✅ Conexión establecida exitosamente!");
		console.log("✅ Asociaciones inicializadas!");
		console.log("✅ Tablas sincronizadas!\n");

		// Verificar que las tablas existen
		console.log("📋 Verificando tablas creadas:");

		const tableNames = await sequelize.getQueryInterface().showAllTables();
		console.log("Tablas encontradas:", tableNames);
		console.log("📊 Base de datos configurada y funcionando correctamente.");
		// Cerrar la conexión
		await sequelize.close();
		console.log("🔒 Conexión cerrada.");
	} catch (error) {
		console.error("❌ Error durante la prueba:", error);
		process.exit(1);
	}
};

// Ejecutar la prueba
testDatabaseConnection();
