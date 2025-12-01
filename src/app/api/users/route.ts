import { NextRequest } from "next/server";
import { Person, Role, Category } from "@/lib/database/models";
import { ApiResponseHandler, handleApiError } from "@/lib/api/response";
import { validateCreateUserData } from "@/lib/api/validation";
import {
	handlePaginatedGet,
	PaginatedEndpointConfig,
} from "@/lib/api/pagination";
import { withDatabase } from "@/middleware/database";

export const GET = withDatabase(async (request: NextRequest) => {
	const config: PaginatedEndpointConfig<Person> = {
		model: Person,
		entityName: "Person",
		entityNamePlural: "People",
		include: [
			{ model: Role, as: "role" },
			{ model: Category, as: "category" },
		],
		searchFields: ["name", "last_name", "email", "cellphone"],
	};
	return handlePaginatedGet(request, config);
});

export const POST = withDatabase(async (request: NextRequest) => {
	try {
		const body = await request.json();
		const validation = await validateCreateUserData(body);
		if (!validation.success) {
			return validation.response;
		}

		const { role_id, category_id } = validation.data;

		const [role, category] = await Promise.all([
			Role.findByPk(role_id),
			Category.findByPk(category_id),
		]);

		if (!role) {
			return ApiResponseHandler.badRequest("El rol especificado no existe");
		}

		if (!category) {
			return ApiResponseHandler.badRequest(
				"La categoría especificada no existe"
			);
		}

		const newUser = await Person.create(
			validation.data as unknown as Record<string, unknown>
		);
		return ApiResponseHandler.created(newUser, "Usuario creado exitosamente");
	} catch (error) {
		return handleApiError(error, "Error al crear el usuario");
	}
});

export const PUT = withDatabase(async (request: NextRequest) => {
	try {
		const body = await request.json();
		const { id } = body;

		if (!id) {
			return ApiResponseHandler.badRequest("El ID del usuario es requerido");
		}

		const existingUser = await Person.findByPk(id);
		if (!existingUser) {
			return ApiResponseHandler.notFound("Usuario no encontrado");
		}

		if (body.role_id) {
			const role = await Role.findByPk(body.role_id);
			if (!role) {
				return ApiResponseHandler.badRequest("El rol especificado no existe");
			}
		}

		if (body.category_id) {
			const category = await Category.findByPk(body.category_id);
			if (!category) {
				return ApiResponseHandler.badRequest(
					"La categoría especificada no existe"
				);
			}
		}

		await existingUser.update(body);

		const updatedUser = await Person.findByPk(id, {
			include: [
				{ model: Role, as: "role" },
				{ model: Category, as: "category" },
			],
		});

		return ApiResponseHandler.success(
			updatedUser,
			"Usuario actualizado exitosamente"
		);
	} catch (error) {
		return handleApiError(error, "Error al actualizar el usuario");
	}
});

export const DELETE = withDatabase(async (request: NextRequest) => {
	try {
		const url = new URL(request.url);
		const id = url.pathname.split("/").pop();

		if (!id) {
			return ApiResponseHandler.badRequest("El ID del usuario es requerido");
		}

		const existingUser = await Person.findByPk(id);
		if (!existingUser) {
			return ApiResponseHandler.notFound("Usuario no encontrado");
		}

		await existingUser.update({
			active: false,
		});

		return ApiResponseHandler.success(null, "Usuario eliminado exitosamente");
	} catch (error) {
		return handleApiError(error, "Error al eliminar el usuario");
	}
});
