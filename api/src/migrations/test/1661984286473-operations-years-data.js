const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class operationsYearsData1661984286473 {

    async up(queryRunner) {
        console.log('Starting public notice test data migration for operations years');
        await queryRunner.query(`
            -- Records with operation_start_year and operation_end_year
            UPDATE app_fom.public_notice set operation_start_year = 2025, operation_end_year = 2025 where project_id = 1108;
            UPDATE app_fom.public_notice set operation_start_year = 2024, operation_end_year = 2027 where project_id = 1072;
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
        -- Records with operation_start_year and operation_end_year
        UPDATE app_fom.public_notice set operation_start_year = null, operation_end_year = null where project_id = 1108;
        UPDATE app_fom.public_notice set operation_start_year = null, operation_end_year = null where project_id = 1072;
    `);
    }
}
        