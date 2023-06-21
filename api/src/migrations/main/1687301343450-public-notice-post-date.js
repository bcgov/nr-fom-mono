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

        -- set post_date value to app_fom.project.commenting_open_date for the past data as default value.
            update app_fom.public_notice pn set post_date = (
                select p.commenting_open_date from app_fom.project p where p.project_id = pn.project_id );
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
