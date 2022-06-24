const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class publicNoticeTable1646848498456 {

    async up(queryRunner) {
        console.log('Starting public-notice-table migration');
    
        // Run the master DDL script
        await queryRunner.query(`
            drop table if exists app_fom.public_notice;  
            create table if not exists app_fom.public_notice  
            ( 
            public_notice_id serial not null primary key ,  
            project_id integer not null references app_fom.project (project_id) on delete cascade , 
            review_address varchar not null,
            review_business_hours varchar not null,
            is_receive_comments_same_as_review boolean not null default true,
            receive_comments_address varchar,
            receive_comments_business_hours varchar,
            mailing_address varchar not null,
            email varchar not null,

            revision_count integer not null default 1 ,
            create_timestamp timestamptz not null default now() ,  
            create_user varchar not null ,  
            update_timestamp timestamptz ,  
            update_user varchar  
            );  
            alter sequence app_fom.public_notice_public_notice_id_seq restart with 1000;

            create index on app_fom.public_notice (project_id);
            
            comment on table app_fom.public_notice is 'Information for the online public notice for a FOM to meet regulatory requirements. One-to-one relationship between this table and project.';

            comment on column app_fom.public_notice.public_notice_id is 'Primary key';
            comment on column app_fom.public_notice.project_id is 'Parent project';
            comment on column app_fom.public_notice.review_address is 'Location(s) that the FOM can be reviewed by the public. Normally one location, but multiple are possible.';
            comment on column app_fom.public_notice.review_business_hours is 'Business hours during which the FOM can be reviewed by the public.';
            comment on column app_fom.public_notice.is_receive_comments_same_as_review is 'If false, the receive_comments address and business hours will be required.';
            comment on column app_fom.public_notice.receive_comments_address is 'Location(s) that can receive comments from the public regarding the FOM. Normally one location, but multiple are possible.';
            comment on column app_fom.public_notice.receive_comments_business_hours is 'Business hours during which comments from the public can be received.';
            comment on column app_fom.public_notice.mailing_address is 'Mailing address of the FOM holder.';
            comment on column app_fom.public_notice.email is 'Email address of the FOM holder.';

            comment on column app_fom.public_notice.create_timestamp is 'Time of creation of the record.';
            comment on column app_fom.public_notice.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
            comment on column app_fom.public_notice.update_timestamp is 'Time of most recent update to the record.';
            comment on column app_fom.public_notice.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
            comment on column app_fom.public_notice.revision_count is 'Standard column for optimistic locking on updates.';            
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            drop table if exists app_fom.public_notice;
        `);
      }
}
        