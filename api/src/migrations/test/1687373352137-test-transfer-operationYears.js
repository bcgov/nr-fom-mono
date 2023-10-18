const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class TestTransferOperationYears1687373352137 {

    async up(queryRunner) {
        console.log('Test transfer to project (add new columns - operation_start_year, operation_end_year) migration');
		await queryRunner.query(`

		-- transfer data to new column - operation_start_year, nullable (for existing data before new column exists) from public_notice table
			UPDATE app_fom.project
			SET operation_start_year = public_notice.operation_start_year 
			FROM app_fom.public_notice 
			WHERE project.project_id = public_notice.project_id
			AND public_notice.operation_start_year is not null;

		-- transfer data to new column - operation_end_year, nullable (for existing data before new column exists) from public_notice table
			UPDATE app_fom.project 
			SET operation_end_year = public_notice.operation_end_year 
			FROM app_fom.public_notice 
			WHERE project.project_id = public_notice.project_id
			AND public_notice.operation_end_year is not null;

		-- remove operation_start_year and operation_end_year columns from the public_notice table
			ALTER TABLE app_fom.public_notice
			DROP COLUMN IF EXISTS operation_start_year,
			DROP COLUMN IF EXISTS operation_end_year;

		`);
    }

    async down(queryRunner) {
    }

}
