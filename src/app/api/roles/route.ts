import { NextRequest } from "next/server";
import {
	handlePaginatedGet,
	PaginatedEndpointConfig,
} from "@/lib/api/pagination";
import { Role } from "@/lib/database/models";

export async function GET(request: NextRequest) {
	const config: PaginatedEndpointConfig<Role> = {
		model: Role,
		entityName: "Role",
		entityNamePlural: "Roles",
	};
	return handlePaginatedGet(request, config);
}
