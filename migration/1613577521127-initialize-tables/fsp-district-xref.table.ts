import {QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'fsp_district_xref',
    columns: [
      {
        name: 'id',
        type: 'serial',
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
  await queryRunner.dropTable('fsp_district_xref');
}
