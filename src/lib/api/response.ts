import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	errors?: Record<string, string[]>; // Para errores de validación
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
		totalPages?: number;
	};
}

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
	SUCCESS: "Operación exitosa",
	CREATED: "Recurso creado exitosamente",
	UPDATED: "Recurso actualizado exitosamente",
	DELETED: "Recurso eliminado exitosamente",
	NOT_FOUND: "Recurso no encontrado",
	VALIDATION_ERROR: "Error de validación",
	UNAUTHORIZED: "No autorizado",
	FORBIDDEN: "Acceso prohibido",
	INTERNAL_ERROR: "Error interno del servidor",
} as const;

export class ApiResponseHandler {
	static success<T>(
		data: T,
		message?: string,
		meta?: ApiResponse<T>["meta"]
	): NextResponse {
		const response: ApiResponse<T> = {
			success: true,
			data,
			message: message || MESSAGES.SUCCESS,
			...(meta && { meta }),
		};
		return NextResponse.json(response, { status: HTTP_STATUS.OK });
	}

	static created<T>(data: T, message?: string): NextResponse {
		const response: ApiResponse<T> = {
			success: true,
			data,
			message: message || MESSAGES.CREATED,
		};
		return NextResponse.json(response, { status: HTTP_STATUS.CREATED });
	}

	static noContent(message?: string): NextResponse {
		const response: ApiResponse = {
			success: true,
			message: message || MESSAGES.SUCCESS,
		};
		return NextResponse.json(response, { status: HTTP_STATUS.OK });
	}

	static badRequest(
		error: string,
		errors?: Record<string, string[]>
	): NextResponse {
		const response: ApiResponse = {
			success: false,
			error,
			...(errors && { errors }),
		};
		return NextResponse.json(response, { status: HTTP_STATUS.BAD_REQUEST });
	}

	static notFound(error?: string): NextResponse {
		const response: ApiResponse = {
			success: false,
			error: error || MESSAGES.NOT_FOUND,
		};
		return NextResponse.json(response, { status: HTTP_STATUS.NOT_FOUND });
	}

	static unauthorized(error?: string): NextResponse {
		const response: ApiResponse = {
			success: false,
			error: error || MESSAGES.UNAUTHORIZED,
		};
		return NextResponse.json(response, { status: HTTP_STATUS.UNAUTHORIZED });
	}

	static forbidden(error?: string): NextResponse {
		const response: ApiResponse = {
			success: false,
			error: error || MESSAGES.FORBIDDEN,
		};
		return NextResponse.json(response, { status: HTTP_STATUS.FORBIDDEN });
	}

	static unprocessableEntity(
		error: string,
		errors: Record<string, string[]>
	): NextResponse {
		const response: ApiResponse = {
			success: false,
			error,
			errors,
		};
		return NextResponse.json(response, {
			status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
		});
	}

	static internalError(error?: string): NextResponse {
		const response: ApiResponse = {
			success: false,
			error: error || MESSAGES.INTERNAL_ERROR,
		};
		return NextResponse.json(response, {
			status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
		});
	}

	static paginated<T>(
		data: T[],
		page: number,
		limit: number,
		total: number,
		message?: string
	): NextResponse {
		const totalPages = Math.ceil(total / limit);

		const response: ApiResponse<T[]> = {
			success: true,
			data,
			message: message || MESSAGES.SUCCESS,
			meta: {
				page,
				limit,
				total,
				totalPages,
			},
		};
		return NextResponse.json(response, { status: HTTP_STATUS.OK });
	}
}

export function handleApiError(
	error: unknown,
	customMessage?: string
): NextResponse {
	console.error("API Error:", error);

	if (error && typeof error === "object" && "name" in error) {
		const err = error as Record<string, unknown>;

		if (err.name === "SequelizeValidationError") {
			const validationErrors: Record<string, string[]> = {};
			const errors = err.errors as Array<{ path: string; message: string }>;
			errors?.forEach((e) => {
				if (!validationErrors[e.path]) {
					validationErrors[e.path] = [];
				}
				validationErrors[e.path].push(e.message);
			});

			return ApiResponseHandler.unprocessableEntity(
				"Error de validación en los datos",
				validationErrors
			);
		}

		if (err.name === "SequelizeUniqueConstraintError") {
			return ApiResponseHandler.badRequest("Este registro ya existe");
		}

		if (err.name === "SequelizeForeignKeyConstraintError") {
			return ApiResponseHandler.badRequest("Referencia inválida en los datos");
		}
	}

	return ApiResponseHandler.internalError(customMessage);
}
