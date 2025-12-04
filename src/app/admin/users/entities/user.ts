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
