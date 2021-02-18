import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'project',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true
      },
      {
        name: 'name',
        type: 'varchar'
      },
      {
        name: 'description',
        type: 'varchar'
      },
      {
        name: 'commenting_open_date',
        type: 'timestamp'
      },
      {
        name: 'commenting_closed_date',
        type: 'timestamp'
      },
      {
        name: 'fsp_id',
        type: 'int'
      },
      {
        name: 'district_id',
        type: 'int'
      },
      {
        name: 'forest_client_id',
        type: 'int'
      },
      {
        name: 'workflow_state_code',
        type: 'varchar'
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('project');
}
