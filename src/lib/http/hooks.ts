import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient, HttpError } from "./client";
import useSnackNotification from "@/hooks/useMessages";
import type { ApiResponse } from "../api/response";

export function useHttpGet<T>(
	queryKey: (string | number | boolean)[],
	url: string,
	options?: {
		enabled?: boolean;
		staleTime?: number;
		refetchOnWindowFocus?: boolean;
		showErrorNotification?: boolean;
	}
) {
	const { errorMessage } = useSnackNotification();

	return useQuery({
		queryKey,
		queryFn: async (): Promise<ApiResponse<T>> => {
			try {
				const response = await httpClient.get<T>(url);
				return response;
			} catch (error) {
				if (options?.showErrorNotification !== false) {
					if (error instanceof HttpError) {
						errorMessage(error.message);
					} else {
						errorMessage("Error al cargar los datos");
					}
				}
				throw error;
			}
		},
		enabled: options?.enabled ?? true,
		staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos por defecto
		refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
	});
}

export function useHttpPost<TData, TVariables = unknown>(
	url: string,
	options?: {
		invalidateKeys?: (string | number | boolean)[][];
		onSuccess?: (response: ApiResponse<TData>, variables: TVariables) => void;
		onError?: (error: HttpError, variables: TVariables) => void;
		successMessage?: string;
		errorMessage?: string;
	}
) {
	const queryClient = useQueryClient();
	const { successMessage, errorMessage } = useSnackNotification();

	return useMutation({
		mutationFn: async (variables: TVariables): Promise<ApiResponse<TData>> => {
			const response = await httpClient.post<TData>(url, variables);
			return response;
		},
		onSuccess: (response, variables) => {
			successMessage(
				response?.message || options?.successMessage || "Operación exitosa"
			);
			if (options?.invalidateKeys) {
				options.invalidateKeys.forEach((queryKey) => {
					queryClient.invalidateQueries({ queryKey });
				});
			}

			options?.onSuccess?.(response, variables);
		},
		onError: (error, variables) => {
			const errorMsg =
				error instanceof HttpError
					? error.message
					: options?.errorMessage || "Error en la operación";

			errorMessage(errorMsg);
			options?.onError?.(error as HttpError, variables);
		},
	});
}

export function useHttpPut<TData, TVariables = unknown>(
	url: string | ((variables: TVariables) => string),
	options?: {
		invalidateKeys?: (string | number | boolean)[][];
		onSuccess?: (response: ApiResponse<TData>, variables: TVariables) => void;
		onError?: (error: HttpError, variables: TVariables) => void;
		successMessage?: string;
		errorMessage?: string;
	}
) {
	const queryClient = useQueryClient();
	const { successMessage, errorMessage } = useSnackNotification();

	return useMutation({
		mutationFn: async (variables: TVariables): Promise<ApiResponse<TData>> => {
			const finalUrl = typeof url === "function" ? url(variables) : url;
			const response = await httpClient.put<TData>(finalUrl, variables);
			return response;
		},
		onSuccess: (response, variables) => {
			successMessage(
				response?.message || options?.successMessage || "Operación exitosa"
			);
			if (options?.invalidateKeys) {
				options.invalidateKeys.forEach((queryKey) => {
					queryClient.invalidateQueries({ queryKey });
				});
			}

			options?.onSuccess?.(response, variables);
		},
		onError: (error, variables) => {
			const errorMsg =
				error instanceof HttpError
					? error.message
					: options?.errorMessage || "Error en la operación";

			errorMessage(errorMsg);
			options?.onError?.(error as HttpError, variables);
		},
	});
}

export function useHttpDelete<TData = null, TVariables = string>(
	url: string | ((id: TVariables) => string),
	options?: {
		invalidateKeys?: (string | number | boolean)[][];
		onSuccess?: (response: ApiResponse<TData>, variables: TVariables) => void;
		onError?: (error: HttpError, variables: TVariables) => void;
		successMessage?: string;
		errorMessage?: string;
	}
) {
	const queryClient = useQueryClient();
	const { successMessage, errorMessage } = useSnackNotification();

	return useMutation({
		mutationFn: async (variables: TVariables): Promise<ApiResponse<TData>> => {
			const finalUrl = typeof url === "function" ? url(variables) : url;
			const response = await httpClient.delete<TData>(finalUrl);
			return response;
		},
		onSuccess: (response, variables) => {
			successMessage(
				response?.message || options?.successMessage || "Operación exitosa"
			);
			if (options?.invalidateKeys) {
				options.invalidateKeys.forEach((queryKey) => {
					queryClient.invalidateQueries({ queryKey });
				});
			}

			options?.onSuccess?.(response, variables);
		},
		onError: (error, variables) => {
			const errorMsg =
				error instanceof HttpError
					? error.message
					: options?.errorMessage || "Error en la operación";

			errorMessage(errorMsg);
			options?.onError?.(error as HttpError, variables);
		},
	});
}
