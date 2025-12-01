import { NextRequest } from "next/server";
import { Team, Person } from "@/lib/database/models";
import { ApiResponseHandler, handleApiError } from "@/lib/api/response";
import {
	handlePaginatedGet,
	PaginatedEndpointConfig,
} from "@/lib/api/pagination";

export async function GET(request: NextRequest) {
	const config: PaginatedEndpointConfig<Team> = {
		model: Team,
		entityName: "Team",
		entityNamePlural: "Teams",
	};
	return handlePaginatedGet(request, config);
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validación básica
		const { name, owner_id } = body;

		if (!name) {
			return ApiResponseHandler.badRequest(
				"El nombre del equipo es requerido",
				{ name: ["El campo name es obligatorio"] }
			);
		}

		// Verificar que el propietario existe (si se proporciona)
		if (owner_id) {
			const owner = await Person.findByPk(owner_id);
			if (!owner) {
				return ApiResponseHandler.badRequest(
					"El propietario especificado no existe"
				);
			}
		}

		const newTeam = await Team.create(body);

		// Obtener el equipo creado con sus relaciones
		const teamWithRelations = await Team.findByPk(newTeam.id, {
			include: [
				{ model: Person, as: "owner", attributes: ["id", "name", "last_name"] },
				{
					model: Person,
					as: "members",
					attributes: ["id", "name", "last_name"],
				},
			],
		});

		return ApiResponseHandler.created(
			teamWithRelations,
			"Equipo creado exitosamente"
		);
	} catch (error) {
		return handleApiError(error, "Error al crear el equipo");
	}
}
