const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ProjectAddColumnBctsManagerName1698445357799 {

    async up(queryRunner) {
        console.log('Starting project (add new column - bcts_manager_name) migration');
        await queryRunner.query(`
    
        -- add new column - bcts_manager_name
            ALTER TABLE app_fom.project ADD COLUMN bcts_manager_name varchar;
    
        -- comment on column - bcts_manager_name
            COMMENT ON COLUMN app_fom.project.bcts_manager_name IS
                'BCTS timber sales manager''s name when it is a BCTS FOM.';
        `);
    }

    async down(queryRunner) {
        console.log('Starting project (drop column - bcts_manager_name) migration');
        await queryRunner.query(`
    
        -- drop new column - bcts_manager_name
            ALTER TABLE app_fom.project DROP COLUMN bcts_manager_name;
        `);
    }

}
