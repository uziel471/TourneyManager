import { NextRequest, NextResponse } from "next/server";
import { ensureDatabaseConnection } from "./src/lib/database/singleton";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	try {
		await ensureDatabaseConnection();
	} catch (error) {
		console.error("❌ Error inicializando la base de datos:", error);
		// En caso de error, permitir que la aplicación continúe
		// pero registrar el error para debugging
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Coincidir con todas las rutas de peticiones excepto las que comienzan con:
		 * - api (rutas API)
		 * - _next/static (archivos estáticos)
		 * - _next/image (optimización de imágenes)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
