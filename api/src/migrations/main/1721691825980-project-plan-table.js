const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class ProjectPlanTable1721691825980 {

    async up(queryRunner) {
        console.log('Starting new project_plan_code migration.');
        await queryRunner.query(`
        -- add new table - project_plan_code
            drop table if exists app_fom.project_plan_code;  
            create table if not exists app_fom.project_plan_code  
            ( 
                code varchar(15) not null primary key,
                description varchar not null,  
                revision_count integer not null default 1,
                create_timestamp timestamptz not null default now(),  
                create_user varchar not null,  
                update_timestamp timestamptz,  
                update_user varchar  
            );

        -- comments on columns.
            comment on table  app_fom.project_plan_code is 'Categories to classify FOM submission from different licensee plan';
            comment on column app_fom.project_plan_code.code is 'Code value';
            comment on column app_fom.project_plan_code.description is 'Code description';
            comment on column app_fom.project_plan_code.create_timestamp is 'Time of creation of the record.';
            comment on column app_fom.project_plan_code.create_user is 'The user id who created the record.';
            comment on column app_fom.project_plan_code.update_timestamp is 'Time of most recent update to the record.';
            comment on column app_fom.project_plan_code.update_user is 'The user id who last updated the record.';
            comment on column app_fom.project_plan_code.revision_count is 'Standard column for optimistic locking on updates.';

        -- add code values.
            INSERT INTO app_fom.project_plan_code(code, description, create_user) VALUES
            ('FSP', 'Forest Stewardship Plan', CURRENT_USER), 
            ('WOODLOT', 'Woodlot License Plan', CURRENT_USER); 

        `);

        console.log('Starting new columns project.project_plan_code, project.woodlot_license_number migration.');
        await queryRunner.query(`
        -- add new column: app_fom.project.project_plan_code column
            ALTER TABLE app_fom.project ADD COLUMN project_plan_code varchar NOT NULL DEFAULT 'FSP' references app_fom.project_plan_code(code);
            comment on column app_fom.project.project_plan_code is 'Tracks project FOM submission from different licensee plans';

        -- add new index: app_fom.project (project_plan_code)
            create index IF NOT EXISTS project_project_plan_code_idx on app_fom.project (project_plan_code);

        -- add new column: app_fom.project.woodlot_license_number column
            ALTER TABLE app_fom.project ADD COLUMN woodlot_license_number varchar(5) NULL;
            comment on column app_fom.project.woodlot_license_number is 'Woodlot license plan number applies to FOM under WOODLOT plan type';
        `)

        console.log('Starting fsp_id column drop NOT NULL migration');
        await queryRunner.query(`
        -- alter fsp_id to nullable
            ALTER TABLE app_fom.project ALTER COLUMN fsp_id DROP NOT NULL;  
        `)
    }

    async down(queryRunner) {
        console.log('Starting project (drop columns: project_plan_code, woodlot_license_number, drop table: project_plan_code) migration');
        await queryRunner.query(`
        -- drop index
            drop index IF EXISTS project_project_plan_code_idx;

        -- drop columns - project_plan_code, woodlot_license_number
            ALTER TABLE app_fom.project DROP COLUMN project_plan_code;
            ALTER TABLE app_fom.project DROP COLUMN woodlot_license_number;
    
        -- add constraint
            ALTER TABLE app_fom.project ALTER COLUMN fsp_id SET typeorm migration:revert -- -d path-to-datasource-configNOT NULL;
        
        -- drop table - project_plan_code
            drop table if exists app_fom.project_plan_code; 

        `);

    }

}
