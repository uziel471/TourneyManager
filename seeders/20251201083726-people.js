"use strict";

module.exports = {
	async up(queryInterface) {
		const people = [
			{
				id: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				name: "Alexander",
				last_name: "Vazquez Jocobi",
				cellphone: "6647738664",
				role_id: "12909860-b37b-47f5-a24e-8995bfd9a7e4",
				birth_date: new Date("2000-03-20"),
				category_id: "1402bebd-b0b0-4587-8a54-991f2f7ccd80",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: "d0f6b42e-9e7b-4e53-ad91-3ccaa5b5ea4a",
				name: "Uziel",
				last_name: "Estrada Marin",
				cellphone: "6647738664",
				role_id: "63d27400-e244-46d3-b527-cc5a7f63c9c4",
				birth_date: new Date("2000-03-20"),
				category_id: "1402bebd-b0b0-4587-8a54-991f2f7ccd80",
				created_at: new Date(),
				updated_at: new Date(),
			},
		];
		await queryInterface.bulkInsert("person", people, {});
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("person", null, {});
	},
};
