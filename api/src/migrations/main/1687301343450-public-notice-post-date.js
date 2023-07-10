const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class PublicNoticePostDate1687301343450 {

    async up(queryRunner) {
        console.log('Starting public_notice (add new column - post_date) migration');
        await queryRunner.query(`
    
        -- add new column - post_date, nullable (for existing data before new column exists)
            ALTER TABLE app_fom.public_notice ADD COLUMN post_date date;

        -- comment on column - post_date
            COMMENT ON COLUMN app_fom.public_notice.post_date IS
            'Date planed for online public notice posted (visible to public) before the FOM reaches the commenting open period';
            
        `);

        console.log('Starting data migration to set initial public_notice (post_date) for past records.');
        await queryRunner.query(`
        -- set post_date value to app_fom.project.commenting_open_date for the past data as default value.
            with project_for_update as (
                select *
                from app_fom.project
                where workflow_state_code != 'INITIAL' 
            )
            update app_fom.public_notice pn set post_date = (
                select p.commenting_open_date from project_for_update p 
                where p.project_id = pn.project_id )
            from project_for_update pu
            where post_date is null and pn.project_id = pu.project_id;
        `);
    }

    async down(queryRunner) {
        console.log('Starting public_notice (drop columns - post_date) migration');
        await queryRunner.query(`
    
        -- drop new columns - post_date
            ALTER TABLE app_fom.public_notice DROP COLUMN post_date;
        `);
    }

}
