import {QueryRunner, Table} from 'typeorm';

export async function createTable(queryRunner: QueryRunner) {
  await queryRunner.query(`
  create table if not exists app_fom.cut_block 
  ( 
  cut_block_id serial not null primary key ,  
  submission_id integer not null references app_fom.submission (submission_id) , 
  geometry GEOMETRY(POLYGON, 3005) not null  ,  
  planned_development_date date not null  ,  
  planned_area_ha real not null , 

  revision_count integer not null default 0 ,
  create_timestamp timestamptz not null default now() ,  
  create_user varchar not null ,  
  update_timestamp timestamptz  default now()  ,  
  update_user varchar 
  );
  
  comment on table  app_fom.cut_block is 'An area in which trees will be cut down.';

  comment on column app_fom.cut_block.cut_block_id is 'Primary key ';
  comment on column app_fom.cut_block.submission_Id is 'Parent submission. ';
  comment on column app_fom.cut_block.geometry is 'The spatial area ';
  comment on column app_fom.cut_block.planned_development_date is 'Date when activity is planned to start. ';
  comment on column app_fom.cut_block.planned_area_ha is 'Area of the cutbock in which trees will be removed. Units of Hectares. ';

  comment on column app_fom.cut_block.create_timestamp is 'Time of creation of the record.';
  comment on column app_fom.cut_block.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
  comment on column app_fom.cut_block.update_timestamp is 'Time of most recent update to the record.';
  comment on column app_fom.cut_block.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
  comment on column app_fom.cut_block.revision_count is 'Standard column for optimistic locking on updates.';

  `);
/*
  await queryRunner.createTable(new Table({
    name: 'app_fom.cut_block',
    columns: [
      {
        name: 'id',
        type: 'serial',
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
        name: 'planned_area_ha',
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
  */
}

export async function dropTable(queryRunner: QueryRunner) {
  await queryRunner.dropTable('app_fom.cut_block');
}
