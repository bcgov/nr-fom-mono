const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CascadesDistrictEmailUpdate1719525022462 {

    async up(queryRunner) {
        console.log('Starting district (update email - Forests.CascadesDistrictOffice to  CASTENWO) migration');
        await queryRunner.query(`
            UPDATE app_fom.district set email = 'CASTENWO', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where email = 'Forests.CascadesDistrictOffice';
        `);
    }

    async down(queryRunner) {
        // No reversion of this change
    }

}
