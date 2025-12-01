import "dotenv/config";
import initializeDatabase from "./lib/database/init";
import { Category, Role, Person, Fields, Team } from "./lib/database/models";

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

		// Probar inserción básica en cada tabla
		console.log("\n🧪 Probando inserción de datos de prueba...");

		// 1. Crear una categoría
		const category = await Category.create({
			name: "Juvenil",
			active: true,
		});
		console.log("✅ Categoría creada:", category.toJSON());

		// 2. Crear un rol
		const role = await Role.create({
			name: "Jugador",
			active: true,
		});
		console.log("✅ Rol creado:", role.toJSON());

		// 3. Crear una persona
		const person = await Person.create({
			name: "Juan",
			last_name: "Pérez",
			email: "juan.perez@example.com",
			cellphone: "1234567890",
			role_id: role.id,
			birth_date: new Date("1995-05-15"),
			active: true,
			category_id: category.id,
		});
		console.log("✅ Persona creada:", person.toJSON());

		// 4. Crear un campo
		const field = await Fields.create({
			name: "Cancha Principal",
			active: true,
		});
		console.log("✅ Campo creado:", field.toJSON());

		// 5. Crear un equipo
		const team = await Team.create({
			name: "Los Tigres",
			active: true,
			owner_id: person.id,
		});
		console.log("✅ Equipo creado:", team.toJSON());

		console.log("\n✨ ¡Todas las pruebas completadas exitosamente!");
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
