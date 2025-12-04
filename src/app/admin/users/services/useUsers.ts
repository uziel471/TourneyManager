// Ejemplo de refactorización del servicio de usuarios usando el nuevo cliente HTTP

import { useHttpGet, useHttpPost, useHttpPut, useHttpDelete } from "@/lib/http";
import type { User } from "../entities/user";

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

export function useUsers() {
	return useHttpGet<User[]>(USERS_QUERY_KEY, "/api/users", {
		staleTime: 5 * 60 * 1000, // 5 minutos
	});
}

export function useUser(id: string, enabled = true) {
	return useHttpGet<User>([...USERS_QUERY_KEY, id], `/api/users/${id}`, {
		enabled,
	});
}

export function useCreateUser() {
	return useHttpPost<User, CreateUserData>("/api/users", {
		invalidateKeys: [USERS_QUERY_KEY],
		successMessage: "Usuario creado exitosamente",
		errorMessage: "Error al crear usuario",
	});
}

export function useUpdateUser() {
	return useHttpPut<User, UpdateUserData>(
		(variables) => `/api/users/${variables.id}`,
		{
			invalidateKeys: [USERS_QUERY_KEY],
			successMessage: "Usuario actualizado exitosamente",
			errorMessage: "Error al actualizar usuario",
		}
	);
}

export function useDeleteUser() {
	return useHttpDelete<null, string>((id) => `/api/users/${id}`, {
		invalidateKeys: [USERS_QUERY_KEY],
		successMessage: "Usuario eliminado exitosamente",
		errorMessage: "Error al eliminar usuario",
	});
}
