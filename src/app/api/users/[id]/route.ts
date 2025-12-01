import { NextRequest } from "next/server";
import { Person, Role, Category } from "@/lib/database/models";
import { ApiResponseHandler, handleApiError } from "@/lib/api/response";
import { withDatabase } from "@/middleware/database";

export const DELETE = withDatabase(
	async (_: NextRequest, { params }: { params: { id: string } }) => {
		try {
			const { id } = params;

			if (!id) {
				return ApiResponseHandler.badRequest("El ID del usuario es requerido");
			}

			const existingUser = await Person.findByPk(id);
			if (!existingUser) {
				return ApiResponseHandler.notFound("Usuario no encontrado");
			}

			await existingUser.update({ active: false });

			return ApiResponseHandler.success(null, "Usuario eliminado exitosamente");
		} catch (error) {
			return handleApiError(error, "Error al eliminar el usuario");
		}
	}
);

export const GET = withDatabase(
	async (request: NextRequest, { params }: { params: { id: string } }) => {
		try {
			const { id } = params;

			if (!id) {
				return ApiResponseHandler.badRequest("El ID del usuario es requerido");
			}

			const user = await Person.findByPk(id, {
				include: [
					{ model: Role, as: "role" },
					{ model: Category, as: "category" },
				],
			});

			if (!user) {
				return ApiResponseHandler.notFound("Usuario no encontrado");
			}

			return ApiResponseHandler.success(user, "Usuario encontrado");
		} catch (error) {
			return handleApiError(error, "Error al obtener el usuario");
		}
	}
);
