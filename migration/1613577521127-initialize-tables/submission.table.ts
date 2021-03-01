import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'submission',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true
      },
      {
        name: 'geometry',
        type: 'geometry'
      },
      {
        name: 'project_id',
        type: 'int'
      },
      {
        name: 'submission_type_code',
        type: 'varchar'
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('submission');
}
