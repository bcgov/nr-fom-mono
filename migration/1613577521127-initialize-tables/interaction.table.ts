import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'interaction',
    columns: [
      {
        name: 'id',
        type: 'serial',
        isPrimary: true
      },
      {
        name: 'stakeholder',
        type: 'varchar'
      },
      {
        name: 'communication_date',
        type: 'timestamp'
      },
      {
        name: 'communication_details',
        type: 'varchar'
      },
      {
        name: 'project_id',
        type: 'int'
      },
      {
        name: 'attachment_id',
        type: 'int'
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
  await queryRunner.dropTable('interaction');
}
