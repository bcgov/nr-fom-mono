const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class responseCodeChangeDescription1637356787852 {

    async up(queryRunner) {
        console.log('Starting responseCode (change description for code = "IRRELEVANT" to "Not Applicable") migration');
        await queryRunner.query(`

        -- update description for code = 'IRRELEVANT' to "Not Applicable"
            UPDATE app_fom.response_code SET description = 'Not Applicable' where code = 'IRRELEVANT';
        `);
    }

    async down(queryRunner) {
        console.log('Starting responseCode (revert description for code = "IRRELEVANT" back to "to "Irrelevant") migration');
        await queryRunner.query(`

        -- revert description for code=IRRELEVANT back to "to "Irrelevant"
            UPDATE app_fom.response_code SET description = 'Irrelevant' where code = 'IRRELEVANT';
        `);
    }
}
        