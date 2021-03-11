import {QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'workflow_state_code',
    columns: [
      {
        name: 'code',
        type: 'varchar',
        isPrimary: true
      },
      {
        name: 'description',
        type: 'varchar'
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('workflow_state_code');
}
