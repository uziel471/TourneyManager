import { NextRequest } from "next/server";
import { ensureDatabaseConnection } from "@/lib/database/singleton";

export function withDatabase<T extends unknown[]>(
	handler: (request: NextRequest, ...args: T) => Promise<Response>
) {
	return async (request: NextRequest, ...args: T): Promise<Response> => {
		await ensureDatabaseConnection();
		return handler(request, ...args);
	};
}
