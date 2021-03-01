import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'retention_area',
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
        name: 'planned_area_ha',
        type: 'real'
      },
      {
        name: 'submission_id',
        type: 'int'
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('retention_area');
}
