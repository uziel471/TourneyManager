"use strict";

module.exports = {
	async up(queryInterface) {
		const teams = [
			{
				id: "3caafbe4-5630-47e8-af9c-961be1bbfe03",
				name: "Real Franja",
				owner_id: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: "7f4e1c2d-8f4b-4c3a-9d2e-5b6a7c8d9e0f",
				name: "Tigres UANL",
				owner_id: "d0f6b42e-9e7b-4e53-ad91-3ccaa5b5ea4a",
				created_at: new Date(),
				updated_at: new Date(),
			},
		];
		await queryInterface.bulkInsert("team", teams, {});
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("team", null, {});
	},
};
