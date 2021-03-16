import {QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'app_fom.attachment',
    columns: [
      {
        name: 'id',
        type: 'serial',
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
      },
      {
        name: 'revision_count',
        type: 'int'
      },
      {
        name: 'create_timestamp',
        type: 'timestamp'
      },
      {
        name: 'create_user',
        type: 'varchar'
      },
      {
        name: 'update_timestamp',
        type: 'timestamp'
      },
      {
        name: 'update_user',
        type: 'varchar'
      }
    ]
  }));
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('attachment');
}
