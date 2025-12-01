import { NextRequest } from "next/server";
import {
	handlePaginatedGet,
	PaginatedEndpointConfig,
} from "@/lib/api/pagination";
import { Category } from "@/lib/database/models";

export async function GET(request: NextRequest) {
	const config: PaginatedEndpointConfig<Category> = {
		model: Category,
		entityName: "Category",
		entityNamePlural: "Categories",
	};

	return handlePaginatedGet(request, config);
}
