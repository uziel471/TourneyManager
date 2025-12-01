import { NextRequest } from "next/server";
import {
	Model,
	ModelStatic,
	FindOptions,
	Includeable,
	Order,
	Op,
} from "sequelize";
import { ApiResponseHandler, handleApiError } from "./response";
import { validatePaginationParams } from "./validation";

// Configuración para diferentes entidades
export interface PaginatedEndpointConfig<T extends Model> {
	model: ModelStatic<T>;
	include?: Includeable[];
	defaultOrder?: Order;
	searchFields?: string[]; // Campos donde buscar
	excludeAttributes?: string[];
	entityName: string; // Nombre para los mensajes
	entityNamePlural: string;
}

export async function handlePaginatedGet<T extends Model>(
	request: NextRequest,
	config: PaginatedEndpointConfig<T>
) {
	try {
		const { searchParams } = new URL(request.url);

		const paginationValidation = validatePaginationParams(searchParams);
		if (!paginationValidation.success) {
			return paginationValidation.response;
		}

		const { page, limit } = paginationValidation.data;
		const offset = (page - 1) * limit;

		const search = searchParams.get("search")?.trim();

		const findOptions: FindOptions = {
			include: config.include || [],
			order: config.defaultOrder || [["createdAt", "DESC"]],
			limit,
			offset,
		};

		if (config.excludeAttributes && config.excludeAttributes.length > 0) {
			findOptions.attributes = {
				exclude: config.excludeAttributes,
			};
		}

		if (search && config.searchFields && config.searchFields.length > 0) {
			const searchConditions = config.searchFields.map((field) => ({
				[field]: {
					[Op.like]: `%${search}%`,
				},
			}));

			findOptions.where = {
				[Op.or]: searchConditions,
			};
		}

		const { rows: data, count: total } = await config.model.findAndCountAll(
			findOptions
		);

		if (search) {
			return ApiResponseHandler.paginated(
				data,
				page,
				limit,
				total,
				`Se encontraron ${total} ${config.entityNamePlural} que coinciden con "${search}"`
			);
		}

		return ApiResponseHandler.paginated(
			data,
			page,
			limit,
			total,

			`Se encontraron ${total} ${config.entityNamePlural}`
		);
	} catch (error) {
		return handleApiError(error, `Error al obtener ${config.entityNamePlural}`);
	}
}

// Función simplificada para endpoints sin paginación (getAllSimple)
export async function handleSimpleGetAll<T extends Model>(
	config: Omit<PaginatedEndpointConfig<T>, "entityNamePlural"> & {
		entityNamePlural: string;
	}
) {
	try {
		const findOptions: FindOptions = {
			include: config.include || [],
			order: config.defaultOrder || [["createdAt", "DESC"]],
		};

		if (config.excludeAttributes && config.excludeAttributes.length > 0) {
			findOptions.attributes = {
				exclude: config.excludeAttributes,
			};
		}

		const data = await config.model.findAll(findOptions);

		return ApiResponseHandler.success(
			data,
			`Se encontraron ${data.length} ${config.entityNamePlural}`
		);
	} catch (error) {
		return handleApiError(error, `Error al obtener ${config.entityNamePlural}`);
	}
}
