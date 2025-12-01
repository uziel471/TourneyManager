import * as yup from "yup";
import { ApiResponseHandler } from "./response";

export const createUserSchema = yup.object().shape({
	name: yup
		.string()
		.required("El nombre es requerido")
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.trim(),
	last_name: yup
		.string()
		.required("El apellido es requerido")
		.min(2, "El apellido debe tener al menos 2 caracteres")
		.trim(),
	email: yup.string().email("Email inválido").optional(),
	cellphone: yup
		.string()
		.required("El teléfono es requerido")
		.test(
			"is-valid-phone",
			"El teléfono debe tener entre 10 y 20 dígitos",
			(value) => {
				if (!value) return false;
				const cleanPhone = value.replace(/\D/g, "");
				return cleanPhone.length >= 10 && cleanPhone.length <= 20;
			}
		),
	role_id: yup
		.string()
		.required("El rol es requerido")
		.uuid("El rol debe ser un UUID válido"),
	category_id: yup
		.string()
		.required("La categoría es requerida")
		.uuid("La categoría debe ser un UUID válido"),
	birth_date: yup
		.string()
		.required("La fecha de nacimiento es requerida")
		.test("is-valid-date", "La fecha debe ser válida", (value) => {
			if (!value) return false;
			return !isNaN(new Date(value).getTime());
		}),
	photo: yup.string().url("La foto debe ser una URL válida").optional(),
	active: yup.boolean().default(true),
});

export const updateUserSchema = createUserSchema.partial();

export const createTeamSchema = yup.object().shape({
	name: yup
		.string()
		.required("El nombre del equipo es requerido")
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.trim(),
	owner_id: yup
		.string()
		.uuid("El propietario debe ser un UUID válido")
		.optional(),
	active: yup.boolean().default(true),
});

export const updateTeamSchema = createTeamSchema.partial();

export const paginationSchema = yup.object().shape({
	page: yup
		.number()
		.integer("La página debe ser un número entero")
		.min(1, "La página debe ser mayor a 0")
		.default(1),
	limit: yup
		.number()
		.integer("El límite debe ser un número entero")
		.min(1, "El límite debe ser al menos 1")
		.max(100, "El límite no puede ser mayor a 100")
		.default(10),
});

export type CreateUserData = yup.InferType<typeof createUserSchema>;
export type FormUserData = CreateUserData;
export type UpdateUserData = yup.InferType<typeof updateUserSchema>;
export type CreateTeamData = yup.InferType<typeof createTeamSchema>;
export type UpdateTeamData = yup.InferType<typeof updateTeamSchema>;
export type PaginationParams = yup.InferType<typeof paginationSchema>;

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

export async function validateCreateUserData(data: unknown) {
	try {
		const validatedData = await createUserSchema.validate(data, {
			abortEarly: false,
			stripUnknown: true,
		});

		return {
			success: true as const,
			data: validatedData,
		};
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return {
				success: false as const,
				response: ApiResponseHandler.unprocessableEntity(
					"Error de validación en los datos enviados",
					mapSchemaErrors(error)
				),
			};
		}

		return {
			success: false as const,
			response: ApiResponseHandler.badRequest("Datos inválidos"),
		};
	}
}

export async function validateCreateTeamData(data: unknown) {
	try {
		const validatedData = await createTeamSchema.validate(data, {
			abortEarly: false,
			stripUnknown: true,
		});

		return {
			success: true as const,
			data: validatedData,
		};
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return {
				success: false as const,
				response: ApiResponseHandler.unprocessableEntity(
					"Error de validación en los datos enviados",
					mapSchemaErrors(error)
				),
			};
		}

		return {
			success: false as const,
			response: ApiResponseHandler.badRequest("Datos inválidos"),
		};
	}
}

export function validatePaginationParams(searchParams: URLSearchParams) {
	const pageStr = searchParams.get("page") || "1";
	const limitStr = searchParams.get("limit") || "10";

	try {
		const validatedData = paginationSchema.validateSync(
			{
				page: parseInt(pageStr),
				limit: parseInt(limitStr),
			},
			{ abortEarly: false }
		);

		return {
			success: true as const,
			data: validatedData,
		};
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return {
				success: false as const,
				response: ApiResponseHandler.badRequest(
					"Parámetros de paginación inválidos",
					mapSchemaErrors(error)
				),
			};
		}

		return {
			success: false as const,
			response: ApiResponseHandler.badRequest("Parámetros inválidos"),
		};
	}
}

const mapSchemaErrors = (error: yup.ValidationError) => {
	const formattedErrors: Record<string, string[]> = {};

	error.inner.forEach((err) => {
		if (err.path) {
			if (!formattedErrors[err.path?.replace("_", " ")]) {
				formattedErrors[err.path.replace("_", " ")] = [];
			}
			formattedErrors[err.path.replace("_", " ")].push(err.message);
		}
	});

	return formattedErrors;
};
