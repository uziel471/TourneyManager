import type { ApiResponse } from "../api/response";

export interface HttpClientConfig {
	baseURL?: string;
	timeout?: number;
	headers?: Record<string, string>;
}

export interface RequestOptions {
	headers?: Record<string, string>;
	timeout?: number;
	signal?: AbortSignal;
}

export class HttpClient {
	private baseURL: string;
	private defaultHeaders: Record<string, string>;
	private timeout: number;

	constructor(config: HttpClientConfig = {}) {
		this.baseURL = config.baseURL || "";
		this.defaultHeaders = {
			"Content-Type": "application/json",
			...config.headers,
		};
		this.timeout = config.timeout || 10000; // 10 segundos por defecto
	}

	private async request<T>(
		url: string,
		options: RequestInit & RequestOptions = {}
	): Promise<ApiResponse<T>> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		const fullUrl = this.baseURL + url;
		const headers = {
			...this.defaultHeaders,
			...options.headers,
		};

		try {
			const response = await fetch(fullUrl, {
				...options,
				headers,
				signal: options.signal || controller.signal,
			});

			clearTimeout(timeoutId);

			// Intentamos parsear como JSON
			let responseData: ApiResponse<T>;
			try {
				responseData = await response.json();
			} catch {
				// Si no es JSON válido, creamos una respuesta genérica
				responseData = {
					success: response.ok,
					message: response.ok ? "Operación exitosa" : "Error en la operación",
				};
			}

			if (!response.ok) {
				// Si la respuesta no es exitosa, lanzamos un error con la información
				throw new HttpError(
					responseData.error || responseData.message || "Error en la petición",
					response.status,
					responseData
				);
			}

			return responseData;
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof HttpError) {
				throw error;
			}

			if (error instanceof DOMException && error.name === "AbortError") {
				throw new HttpError("Timeout: La petición tardó demasiado", 408);
			}

			if (error instanceof TypeError && error.message.includes("fetch")) {
				throw new HttpError("Error de conexión", 0);
			}

			throw new HttpError(
				error instanceof Error ? error.message : "Error desconocido",
				0
			);
		}
	}

	async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
		return this.request<T>(url, { method: "GET", ...options });
	}

	async post<T>(
		url: string,
		body?: unknown,
		options?: RequestOptions
	): Promise<ApiResponse<T>> {
		return this.request<T>(url, {
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
			...options,
		});
	}

	async put<T>(
		url: string,
		body?: unknown,
		options?: RequestOptions
	): Promise<ApiResponse<T>> {
		return this.request<T>(url, {
			method: "PUT",
			body: body ? JSON.stringify(body) : undefined,
			...options,
		});
	}

	async patch<T>(
		url: string,
		body?: unknown,
		options?: RequestOptions
	): Promise<ApiResponse<T>> {
		return this.request<T>(url, {
			method: "PATCH",
			body: body ? JSON.stringify(body) : undefined,
			...options,
		});
	}

	async delete<T>(
		url: string,
		options?: RequestOptions
	): Promise<ApiResponse<T>> {
		return this.request<T>(url, { method: "DELETE", ...options });
	}

	// Método para configurar headers globales (útil para tokens de autenticación)
	setHeader(key: string, value: string): void {
		this.defaultHeaders[key] = value;
	}

	// Método para remover headers globales
	removeHeader(key: string): void {
		delete this.defaultHeaders[key];
	}

	// Método para obtener una nueva instancia con configuración específica
	create(config: HttpClientConfig): HttpClient {
		return new HttpClient({
			baseURL: this.baseURL,
			timeout: this.timeout,
			headers: { ...this.defaultHeaders },
			...config,
		});
	}
}

// Clase de error personalizada para manejar errores HTTP
export class HttpError extends Error {
	public status: number;
	public response?: ApiResponse<unknown>;

	constructor(
		message: string,
		status: number,
		response?: ApiResponse<unknown>
	) {
		super(message);
		this.name = "HttpError";
		this.status = status;
		this.response = response;
	}

	get isClientError(): boolean {
		return this.status >= 400 && this.status < 500;
	}

	get isServerError(): boolean {
		return this.status >= 500;
	}

	get isNetworkError(): boolean {
		return this.status === 0;
	}

	get isTimeoutError(): boolean {
		return this.status === 408;
	}
}

// Instancia global del cliente
export const httpClient = new HttpClient();

// Función de conveniencia para crear instancias personalizadas
export const createHttpClient = (config: HttpClientConfig): HttpClient => {
	return new HttpClient(config);
};
