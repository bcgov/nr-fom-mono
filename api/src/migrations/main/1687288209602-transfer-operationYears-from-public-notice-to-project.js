const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class transferOperationYearsFromPublicNoticeToProject1687288209602 {

  async up(queryRunner) {
		console.log('Starting project (add new columns - operation_start_year, operation_end_year) migration');
		await queryRunner.query(`

		-- add new column - operation_start_year, nullable (for existing data before new column exists)
			ALTER TABLE app_fom.project ADD COLUMN operation_start_year integer;

		-- add new column - operation_end_year, nullable (for existing data before new column exists)
			ALTER TABLE app_fom.project ADD COLUMN operation_end_year integer;

		-- comment on column - operation_start_year
			COMMENT ON COLUMN app_fom.project.operation_start_year IS
				'Starting Year of planned duration of the FOM operations';
			
		-- comment on column - operation_end_year
			COMMENT ON COLUMN app_fom.project.operation_end_year IS
				'Ending Year of planned duration of the FOM operations';

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

		`);

	}

	async down(queryRunner) {
		console.log('Starting project (drop columns - operation_start_year, operation_end_year) migration');
		await queryRunner.query(`

			-- drop new columns - operation_start_year, operation_end_year
				ALTER TABLE app_fom.project DROP COLUMN operation_start_year;
				ALTER TABLE app_fom.project DROP COLUMN operation_end_year;

		`);
	}
}
        