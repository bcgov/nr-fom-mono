const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class RemoveOperationPeriodFromPublicNotice1689185591902 {

    async up(queryRunner) {
        console.log('Starting public_notice (remove columns - operation_start_year, operation_end_year) migration');
		await queryRunner.query(`

		-- remove operation_start_year and operation_end_year columns from the public_notice table
			ALTER TABLE app_fom.public_notice
			DROP COLUMN IF EXISTS operation_start_year,
			DROP COLUMN IF EXISTS operation_end_year;

		`);
    }

    async down(queryRunner) {
    }

}
