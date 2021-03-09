import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'interaction',
    columns: [
      {
        name: 'id',
        type: 'int',
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
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('interaction');
}
