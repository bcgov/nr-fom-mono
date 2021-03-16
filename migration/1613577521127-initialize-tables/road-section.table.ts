import {QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'road_section',
    columns: [
      {
        name: 'road_section_id',
        type: 'serial',
        isPrimary: true
      },
      {
        name: 'geometry',
        type: 'geometry(lineString,3005)'
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
  await queryRunner.dropTable('road_section');
}
