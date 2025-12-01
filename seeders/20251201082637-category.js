"use strict";

module.exports = {
	async up(queryInterface) {
		const categories = [
			{
				id: "95b993fd-b833-45e7-97da-a156b0dd3669",
				name: "2010-2013",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				id: "1402bebd-b0b0-4587-8a54-991f2f7ccd80",
				name: "Open",
				created_at: new Date(),
				updated_at: new Date(),
			},
		];
		await queryInterface.bulkInsert("category", categories, {});
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("category", null, {});
	},
};
