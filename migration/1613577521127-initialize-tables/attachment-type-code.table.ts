import {QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.createTable(new Table({
    name: 'app_fom.attachment_type_code',
    columns: [
      {
        name: 'code',
        type: 'varchar',
        isPrimary: true,
      },
      {
        name: 'description',
        type: 'varchar',
        isNullable: false,
      }
    ]
  }), true);
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('app_fom.attachment_type_code');
}
