const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class publicNoticeAddColumnOperationYears1661461702043 {

  async up(queryRunner) {
    console.log('Starting public_notice (add new columns - operation_start_year, operation_end_year) migration');
    await queryRunner.query(`

    -- add new column - operation_start_year, nullable (for existing data before new column exists)
      ALTER TABLE app_fom.public_notice ADD COLUMN operation_start_year integer;

    -- add new column - operation_end_year, nullable (for existing data before new column exists)
	    ALTER TABLE app_fom.public_notice ADD COLUMN operation_end_year integer;

    -- comment on column - operation_start_year
      COMMENT ON COLUMN app_fom.public_notice.operation_start_year IS
        'Starting Year of planned duration of the FOM operations';
      
    -- comment on column - operation_end_year
      COMMENT ON COLUMN app_fom.public_notice.operation_end_year IS
        'Ending Year of planned duration of the FOM operations';

    `);
  }

  async down(queryRunner) {
    console.log('Starting public_notice (drop columns - operation_start_year, operation_end_year) migration');
    await queryRunner.query(`

    -- drop new columns - operation_start_year, operation_end_year
        ALTER TABLE app_fom.public_notice DROP COLUMN operation_start_year;
        ALTER TABLE app_fom.public_notice DROP COLUMN operation_end_year;

    `);

  }
}
        