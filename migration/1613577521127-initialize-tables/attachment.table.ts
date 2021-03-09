import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'attachment',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true
      },
      {
        name: 'file_name',
        type: 'varchar'
      },
      {
        name: 'file_contents',
        type: 'varchar'
      },
      {
        name: 'project_id',
        type: 'int'
      },
      {
        name: 'attachment_type_code',
        type: 'varchar'
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('attachment');
}
