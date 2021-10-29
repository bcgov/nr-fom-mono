const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class projectAddColumnCommentClassificationMandatory1635437500519 {

  async up(queryRunner) {
    console.log('Starting project (add new column - comment_classification_mandatory) migration');
    await queryRunner.query(`

    -- add new column - comment_classification_mandatory
        ALTER TABLE app_fom.project ADD COLUMN comment_classification_mandatory boolean NOT NULL DEFAULT true;

    -- comment on column - comment_classification_mandatory
        COMMENT ON COLUMN app_fom.project.comment_classification_mandatory IS
            'A flag to indicate that all comments be classified; default to true';
    `);
  }

  async down(queryRunner) {
    console.log('Starting project (drop column - comment_classification_mandatory) migration');
    await queryRunner.query(`

    -- drop new column - comment_classification_mandatory
        ALTER TABLE app_fom.project DROP COLUMN comment_classification_mandatory;
    `);
  }
}
        