import * as yup from "yup";

export const userSchema = yup.object().shape({
	name: yup
		.string()
		.required("El nombre es requerido")
		.min(2, "El nombre debe tener al menos 2 caracteres"),
	last_name: yup
		.string()
		.required("El apellido es requerido")
		.min(2, "El apellido debe tener al menos 2 caracteres"),
	email: yup.string().email("Email inválido").optional(),
	cellphone: yup
		.string()
		.required("El teléfono es requerido")
		.min(10, "El teléfono debe tener al menos 10 dígitos"),
	role_id: yup.string().required("El rol es requerido"),
	category_id: yup.string().required("La categoría es requerida"),
	birth_date: yup.string().required("La fecha de nacimiento es requerida"),
	active: yup.boolean().optional().default(true),
});

export type UserFormData = yup.InferType<typeof userSchema>;
