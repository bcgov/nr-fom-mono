const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class publicNoticeData1646848536366 {

    // Project 3 - open for commenting.
    // Project 5 - closed for commenting.
    async up(queryRunner) {
        console.log('Starting public notice test data migration');
        await queryRunner.query(`
            alter sequence app_fom.public_notice_public_notice_id_seq restart with 100000;

            INSERT INTO app_fom.public_notice(public_notice_id, project_id, review_address, review_business_hours, mailing_address, email, create_user) values
            (30, 3, 'Suite #123, 456 Some Very Long Name Street, Vancouver BC', 'Monday to Friday 8am to 5pm, Weekends 10am - 3pm', 'P.O. Box 12345678 Surrey BC', 'info@industrydomain.com', 'testdata')
            , (50, 5, 'Suite #987, 654 Some Name Street, Vancouver BC', 'Monday to Friday 8am to 5pm, Weekends 10am - 3pm', 'P.O. Box 12345678 Surrey BC', 'info@industrydomain.com', 'testdata')
            , (1036, 1036, 'Suite #1036, 1036th Street, Vancouver BC', 'Monday to Friday 8am to 5pm, Weekends 10am - 3pm', 'P.O. Box 1036 Surrey BC', 'info@co1036ltd.com', 'testdata')
            , (1072, 1072, 'Suite #1072, 1072th Street, Vancouver BC', 'Monday to Friday 8am to 5pm, Weekends 10am - 3pm', 'P.O. Box 1072 Surrey BC', 'info@co1072ltd.com', 'testdata')
            , (1108, 1108, 'Suite #1108, 1108th Street, Vancouver BC', 'Monday to Friday 8am to 5pm, Weekends 10am - 3pm', 'P.O. Box 1108 Surrey BC', 'info@co1108ltd.com', 'testdata')
            ;

            -- Fix missing data from large volume test migration
            UPDATE app_fom.project set district_id = 56 where district_id is null and project_id < 50000;
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DELETE FROM app_fom.public_notice where public_notice_id < 100000;
        `);
    }
}
        