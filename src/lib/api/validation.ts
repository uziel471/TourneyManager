import { ApiResponseHandler } from "./response";

// Tipos para validación
export interface CreateUserData {
	name: string;
	last_name: string;
	email?: string;
	cellphone: string;
	role_id: string;
	birth_date: string;
	photo?: string;
	active?: boolean;
	category_id: string;
}

export interface UpdateUserData {
	name?: string;
	last_name?: string;
	email?: string;
	cellphone?: string;
	role_id?: string;
	birth_date?: string;
	photo?: string;
	active?: boolean;
	category_id?: string;
}

export interface CreateTeamData {
	name: string;
	owner_id?: string;
	active?: boolean;
}

export interface UpdateTeamData {
	name?: string;
	owner_id?: string;
	active?: boolean;
}

export interface PaginationParams {
	page: number;
	limit: number;
}

// Funciones de validación
export function isValidUUID(value: string): boolean {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(value);
}

export function isValidEmail(value: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(value);
}

export function isValidDate(value: string): boolean {
	const date = new Date(value);
	return !isNaN(date.getTime());
}

export function isValidPhone(value: string): boolean {
	const cleanPhone = value.replace(/\D/g, "");
	return cleanPhone.length >= 10 && cleanPhone.length <= 20;
}

// Validación de datos de usuario
export function validateCreateUserData(data: unknown) {
	if (!data || typeof data !== "object") {
		return {
			success: false as const,
			response: ApiResponseHandler.badRequest(
				"Los datos deben ser un objeto válido"
			),
		};
	}

	const user = data as Record<string, unknown>;
	const errors: Record<string, string[]> = {};

	// Validar campos requeridos
	if (
		!user.name ||
		typeof user.name !== "string" ||
		user.name.trim().length < 2
	) {
		errors.name = ["El nombre es requerido y debe tener al menos 2 caracteres"];
	}

	if (
		!user.last_name ||
		typeof user.last_name !== "string" ||
		user.last_name.trim().length < 2
	) {
		errors.last_name = [
			"El apellido es requerido y debe tener al menos 2 caracteres",
		];
	}

	if (
		!user.cellphone ||
		typeof user.cellphone !== "string" ||
		!isValidPhone(user.cellphone)
	) {
		errors.cellphone = [
			"El teléfono es requerido y debe tener entre 10 y 20 dígitos",
		];
	}

	if (
		!user.role_id ||
		typeof user.role_id !== "string" ||
		!isValidUUID(user.role_id)
	) {
		errors.role_id = ["El rol es requerido y debe ser un UUID válido"];
	}

	if (
		!user.category_id ||
		typeof user.category_id !== "string" ||
		!isValidUUID(user.category_id)
	) {
		errors.category_id = [
			"La categoría es requerida y debe ser un UUID válido",
		];
	}

	if (
		!user.birth_date ||
		typeof user.birth_date !== "string" ||
		!isValidDate(user.birth_date)
	) {
		errors.birth_date = [
			"La fecha de nacimiento es requerida y debe ser una fecha válida",
		];
	}

	// Validar campos opcionales
	if (
		user.email &&
		(typeof user.email !== "string" || !isValidEmail(user.email))
	) {
		errors.email = ["El email debe ser una dirección válida"];
	}

	if (
		user.photo &&
		(typeof user.photo !== "string" || !user.photo.startsWith("http"))
	) {
		errors.photo = ["La foto debe ser una URL válida"];
	}

	if (Object.keys(errors).length > 0) {
		return {
			success: false as const,
			response: ApiResponseHandler.unprocessableEntity(
				"Error de validación en los datos enviados",
				errors
			),
		};
	}

	return {
		success: true as const,
		data: user as unknown as CreateUserData,
	};
}

// Validación de datos de equipo
export function validateCreateTeamData(data: unknown) {
	if (!data || typeof data !== "object") {
		return {
			success: false as const,
			response: ApiResponseHandler.badRequest(
				"Los datos deben ser un objeto válido"
			),
		};
	}

	const team = data as Record<string, unknown>;
	const errors: Record<string, string[]> = {};

	// Validar campos requeridos
	if (
		!team.name ||
		typeof team.name !== "string" ||
		team.name.trim().length < 2
	) {
		errors.name = [
			"El nombre del equipo es requerido y debe tener al menos 2 caracteres",
		];
	}

	// Validar campos opcionales
	if (
		team.owner_id &&
		(typeof team.owner_id !== "string" || !isValidUUID(team.owner_id))
	) {
		errors.owner_id = ["El propietario debe ser un UUID válido"];
	}

	if (Object.keys(errors).length > 0) {
		return {
			success: false as const,
			response: ApiResponseHandler.unprocessableEntity(
				"Error de validación en los datos enviados",
				errors
			),
		};
	}

	return {
		success: true as const,
		data: team as unknown as CreateTeamData,
	};
}

export function validatePaginationParams(searchParams: URLSearchParams) {
	const pageStr = searchParams.get("page") || "1";
	const limitStr = searchParams.get("limit") || "10";

	const page = parseInt(pageStr);
	const limit = parseInt(limitStr);

	const errors: Record<string, string[]> = {};

	if (isNaN(page) || page < 1) {
		errors.page = ["La página debe ser un número mayor a 0"];
	}

	if (isNaN(limit) || limit < 1 || limit > 100) {
		errors.limit = ["El límite debe ser un número entre 1 y 100"];
	}

	if (Object.keys(errors).length > 0) {
		return {
			success: false as const,
			response: ApiResponseHandler.badRequest(
				"Parámetros de paginación inválidos",
				errors
			),
		};
	}

	return {
		success: true as const,
		data: { page, limit } as PaginationParams,
	};
}
