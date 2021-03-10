import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'public_comment',
    columns: [
      {
        name: 'id',
        type: 'serial',
        isPrimary: true
      },
      {
        name: 'feedback',
        type: 'varchar'
      },
      {
        name: 'name',
        type: 'varchar'
      },
      {
        name: 'location',
        type: 'varchar'
      },
      {
        name: 'email',
        type: 'varchar'
      },
      {
        name: 'phone_number',
        type: 'varchar'
      },
      {
        name: 'response_details',
        type: 'varchar'
      },
      {
        name: 'project_id',
        type: 'int'
      },
      {
        name: 'response_code',
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
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('public_comment');
}
