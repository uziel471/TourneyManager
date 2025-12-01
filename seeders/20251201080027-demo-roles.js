"use strict";

module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"role",
			[
				{
					id: "63d27400-e244-46d3-b527-cc5a7f63c9c4",
					name: "player",
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					id: "34114b76-8779-46d8-8a8e-634ccfb3b4a0",
					name: "coach",
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					id: "12909860-b37b-47f5-a24e-8995bfd9a7e4",
					name: "admin",
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete(
			"role",
			{
				id: {
					[Sequelize.Op.in]: [
						"63d27400-e244-46d3-b527-cc5a7f63c9c4",
						"34114b76-8779-46d8-8a8e-634ccfb3b4a0",
						"12909860-b37b-47f5-a24e-8995bfd9a7e4",
					],
				},
			},
			{}
		);
	},
};
