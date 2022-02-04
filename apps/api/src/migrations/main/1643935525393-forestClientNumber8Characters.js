const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class forestClientNumber8Characters1643935525393 {

    async up(queryRunner) {
        console.log('Starting forest client number 8 character migration');

        await queryRunner.query(`
        -- Disable foreign key constraints (implemented as triggers)
        alter table app_fom.project disable trigger all;
        
        update app_fom.project set forest_client_number = lpad(forest_client_number, 8, '0');
        
        -- Remove duplicated entries 
        delete from app_fom.forest_client where forest_client_number in ('35631', '100497');
        
        update app_fom.forest_client set forest_client_number = lpad(forest_client_number, 8, '0');
        
        alter table app_fom.project enable trigger all;
        `);
        
    }

    async down(queryRunner) {
        console.log('ERROR: Reversing the forest client number 8 character migration is not possible.');
    }
}
        