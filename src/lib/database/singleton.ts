import initializeDatabase from "./init";

class DatabaseSingleton {
	private static instance: DatabaseSingleton;
	private isInitializing = false;
	private isInitialized = false;
	private initPromise: Promise<void> | null = null;

	private constructor() {}

	public static getInstance(): DatabaseSingleton {
		if (!DatabaseSingleton.instance) {
			DatabaseSingleton.instance = new DatabaseSingleton();
		}
		return DatabaseSingleton.instance;
	}

	public async initialize() {
		if (this.isInitialized) {
			return;
		}

		if (this.isInitializing && this.initPromise) {
			return this.initPromise;
		}

		this.isInitializing = true;
		this.initPromise = this.performInitialization();

		try {
			await this.initPromise;
			this.isInitialized = true;
		} catch (error) {
			this.isInitializing = false;
			this.initPromise = null;
			throw error;
		}
	}

	private async performInitialization() {
		console.log("🚀 Inicializando conexión a la base de datos...");
		await initializeDatabase();
		console.log("✅ Base de datos inicializada correctamente");
	}

	public getStatus() {
		return {
			isInitialized: this.isInitialized,
			isInitializing: this.isInitializing,
		};
	}
}

export const ensureDatabaseConnection = async () => {
	const dbSingleton = DatabaseSingleton.getInstance();
	await dbSingleton.initialize();
};

export default DatabaseSingleton;
