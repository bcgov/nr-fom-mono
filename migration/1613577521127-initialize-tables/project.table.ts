import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'project',
    columns: [
      {
        name: 'id',
        type: 'serial',
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
        type: 'int',
        isNullable: true
      },
      {
        name: 'district_id',
        type: 'int',
        isNullable: true
      },
      {
        name: 'forest_client_id',
        type: 'int',
        isNullable: true
      },
      {
        name: 'workflow_state_code',
        type: 'varchar',
        isNullable: true
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
  await queryRunner.dropTable('project');
}
