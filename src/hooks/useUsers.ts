// Ejemplo de hook personalizado para manejar usuarios
import { useState, useEffect } from "react";

interface User {
	id: string;
	name: string;
	last_name: string;
	email?: string;
	cellphone: string;
	birth_date: string;
	photo?: string;
	active: boolean;
	role: {
		id: string;
		name: string;
	};
	category: {
		id: string;
		name: string;
	};
}

interface ApiResponse {
	success: boolean;
	data: User[];
	count: number;
	error?: string;
}

export function useUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch("/api/users");
			const data: ApiResponse = await response.json();

			if (data.success) {
				setUsers(data.data);
			} else {
				setError(data.error || "Error al cargar usuarios");
			}
		} catch (err) {
			setError("Error de conexión");
			console.error("Error fetching users:", err);
		} finally {
			setLoading(false);
		}
	};

	const createUser = async (
		userData: Omit<User, "id" | "role" | "category"> & {
			role_id: string;
			category_id: string;
		}
	) => {
		try {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (data.success) {
				// Actualizar la lista de usuarios
				await fetchUsers();
				return { success: true, data: data.data };
			} else {
				return { success: false, error: data.error };
			}
		} catch (err) {
			console.error("Error creating user:", err);
			return { success: false, error: "Error de conexión" };
		}
	};

	const createUserFromForm = async (formData: {
		name: string;
		last_name: string;
		email?: string;
		cellphone: string;
		role_id: string;
		birth_date: string;
		category_id: string;
		active?: boolean;
	}) => {
		try {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.success) {
				// Actualizar la lista de usuarios
				await fetchUsers();
				return { success: true, data: data.data };
			} else {
				return { success: false, error: data.error };
			}
		} catch (err) {
			console.error("Error creating user from form:", err);
			return { success: false, error: "Error de conexión" };
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return {
		users,
		loading,
		error,
		fetchUsers,
		createUser,
		createUserFromForm,
		refetch: fetchUsers,
	};
}
