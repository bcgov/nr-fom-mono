import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'road_section',
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
        name: 'planned_development_date',
        type: 'timestamp'
      },
      {
        name: 'planned_length_km',
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
  await queryRunner.dropTable('road_section');
}
