import { NextRequest } from "next/server";
import {
	handlePaginatedGet,
	PaginatedEndpointConfig,
} from "@/lib/api/pagination";
import Fields from "@/models/Team";

export async function GET(request: NextRequest) {
	const config: PaginatedEndpointConfig<Fields> = {
		model: Fields,
		entityName: "Field",
		entityNamePlural: "Fields",
	};

	return handlePaginatedGet(request, config);
}
