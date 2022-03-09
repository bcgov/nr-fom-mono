const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class publicNoticeData1646848536366 {

    // Project 3 - open for commenting.
    // Project 5 - closed for commenting.
    async up(queryRunner) {
        console.log('Starting public notice test data migration');
        await queryRunner.query(`
            INSERT INTO app_fom.public_notice(public_notice_id, project_id, review_address, review_business_hours, mailing_address, email, create_user) values
            (30, 3, 'Suite #123, 456 Some Very Long Name Street, Vancouver BC', 'Monday to Friday 8am to 5pm, Weekends 10am - 3pm', 'P.O. Box 12345678 Surrey BC', 'info@industrydomain.com', 'testdata')
            , (50, 5, 'Suite #987, 654 Some Name Street, Vancouver BC', 'Monday to Friday 8am to 5pm, Weekends 10am - 3pm', 'P.O. Box 12345678 Surrey BC', 'info@industrydomain.com', 'testdata')
            ;
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DELETE FROM app_fom.public_notice where public_notice_id < 1000;
        `);
    }
}
        