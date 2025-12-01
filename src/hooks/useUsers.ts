import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api/response";
import useSnackNotification from "@/hooks/useMessages";

export interface User {
	id: string;
	name: string;
	last_name: string;
	email?: string;
	cellphone: string;
	birth_date: string;
	photo?: string;
	active: boolean;
	role_id: string;
	category_id: string;
	role: {
		id: string;
		name: string;
	};
	category: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
}

export type UsersApiResponse = ApiResponse<User[]>;
export type UserApiResponse = ApiResponse<User>;
export type DeleteUserApiResponse = ApiResponse<null>;

interface CreateUserData {
	name: string;
	last_name: string;
	email?: string;
	cellphone: string;
	role_id: string;
	birth_date: string;
	category_id: string;
	active?: boolean;
}

interface UpdateUserData extends CreateUserData {
	id: string;
}

const USERS_QUERY_KEY = ["users"];

const fetchUsers = async (): Promise<UsersApiResponse> => {
	const response = await fetch("/api/users");
	if (!response.ok) {
		throw new Error("Error al cargar usuarios");
	}
	return response.json();
};

const createUser = async (
	userData: CreateUserData
): Promise<UserApiResponse> => {
	const response = await fetch("/api/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		throw new Error("Error al crear usuario");
	}

	return response.json();
};

const updateUser = async (
	userData: UpdateUserData
): Promise<UserApiResponse> => {
	const response = await fetch("/api/users", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		throw new Error("Error al actualizar usuario");
	}

	return response.json();
};

const deleteUser = async (userId: string): Promise<DeleteUserApiResponse> => {
	const response = await fetch(`/api/users/${userId}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Error al eliminar usuario");
	}

	return response.json();
};

// React Query Hooks
export function useUsers() {
	return useQuery({
		queryKey: USERS_QUERY_KEY,
		queryFn: fetchUsers,
		select: (data: UsersApiResponse) => data.data || [], // Extract users array from response
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

export function useCreateUser() {
	const queryClient = useQueryClient();
	const snackNotification = useSnackNotification();
	return useMutation<UserApiResponse, Error, CreateUserData>({
		mutationFn: createUser,
		onSuccess: (data: UserApiResponse) => {
			snackNotification.successMessage(
				data?.message || "Usuario creado exitosamente"
			);
			queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
		},
		onError: (error) => {
			snackNotification.errorMessage(error.message);
		},
	});
}

export function useUpdateUser() {
	const queryClient = useQueryClient();
	const snackNotification = useSnackNotification();
	return useMutation<UserApiResponse, Error, UpdateUserData>({
		mutationFn: updateUser,
		onSuccess: (data: UserApiResponse) => {
			snackNotification.successMessage(
				data?.message || "Usuario actualizado exitosamente"
			);
			queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
			console.log("Usuario actualizado:", data.data);
		},
		onError: (error: Error) => {
			snackNotification.errorMessage(error.message);
		},
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();
	const snackNotification = useSnackNotification();
	return useMutation<DeleteUserApiResponse, Error, string>({
		mutationFn: deleteUser,
		onSuccess: (data: DeleteUserApiResponse) => {
			snackNotification.successMessage(
				data?.message || "Usuario eliminado exitosamente"
			);
			queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
			console.log("Usuario eliminado:", data.message);
		},
		onError: (error: Error) => {
			snackNotification.errorMessage(error.message);
		},
	});
}
