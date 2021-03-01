import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'forest_stewardship_plan',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true
      },
      {
        name: '',
        type: ''
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('forest_stewardship_plan');
}
