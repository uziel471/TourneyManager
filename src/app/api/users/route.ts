import { NextRequest } from "next/server";
import { Person, Role, Category } from "@/lib/database/models";
import { ApiResponseHandler, handleApiError } from "@/lib/api/response";
import { validateCreateUserData } from "@/lib/api/validation";
import {
	handlePaginatedGet,
	PaginatedEndpointConfig,
} from "@/lib/api/pagination";

export async function GET(request: NextRequest) {
	const config: PaginatedEndpointConfig<Person> = {
		model: Person,
		entityName: "Person",
		entityNamePlural: "People",
		include: [
			{ model: Role, as: "role" },
			{ model: Category, as: "category" },
		],
	};
	return handlePaginatedGet(request, config);
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const validation = validateCreateUserData(body);
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

		const userWithRelations = await Person.findByPk(newUser.id, {
			include: [
				{ model: Role, as: "role" },
				{ model: Category, as: "category" },
			],
		});

		return ApiResponseHandler.created(
			userWithRelations,
			"Usuario creado exitosamente"
		);
	} catch (error) {
		return handleApiError(error, "Error al crear el usuario");
	}
}
