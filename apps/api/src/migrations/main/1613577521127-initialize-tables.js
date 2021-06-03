const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class initializeTables1613577521127 {
  async up(queryRunner) {
    // Run the master DDL script
    await queryRunner.query(`

create schema if not exists app_fom;

create extension if not exists plpgsql; 
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- Drop all tables with foreign keys in dependency order (children first, then parents, then external tables, then code tables) to allow this script to be rerunnable for testing.
drop table if exists app_fom.interaction;
drop table if exists app_fom.attachment;
drop table if exists app_fom.cut_block;
drop table if exists app_fom.retention_area;
drop table if exists app_fom.road_section;
drop table if exists app_fom.submission;
drop table if exists app_fom.public_comment;
drop table if exists app_fom.project;
drop table if exists app_fom.district;
drop table if exists app_fom.forest_client;


-- Creation of tables  listed in reverse dependency order (code tables, external tables, and parent tables listed first, in that order) in order to create foreign keys as part of table definition

-- CODE TABLES

/* ------- ddl script for app_fom.comment_scope_code ---------*/  
drop table if exists app_fom.comment_scope_code ;  
create table if not exists app_fom.comment_scope_code  
( 
code varchar not null primary key  ,
description varchar not null ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  

); 

comment on table  app_fom.comment_scope_code is 'Specifies what aspect of the project a comment applies to.';

comment on column app_fom.comment_scope_code.code is 'Code value ';
comment on column app_fom.comment_scope_code.description is 'Code description ';

comment on column app_fom.comment_scope_code.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.comment_scope_code.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.comment_scope_code.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.comment_scope_code.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.comment_scope_code.revision_count is 'Standard column for optimistic locking on updates.';

INSERT INTO app_fom.comment_scope_code(code, description, create_user) VALUES
('CUT_BLOCK', 'Cut Block', CURRENT_USER),
('ROAD_SECTION', 'Road Section', CURRENT_USER),
('OVERALL', 'Overall FOM', CURRENT_USER);


/* ------- ddl script for app_fom.response_code ---------*/  
drop table if exists app_fom.response_code ;  
create table if not exists app_fom.response_code  
( 
code varchar not null primary key  ,
description varchar not null ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  

); 

comment on table  app_fom.response_code is 'Categories to classify the forest client''s response to each public comment.';

comment on column app_fom.response_code.code is 'Code value ';
comment on column app_fom.response_code.description is 'Code description ';

comment on column app_fom.response_code.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.response_code.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.response_code.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.response_code.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.response_code.revision_count is 'Standard column for optimistic locking on updates.';

INSERT INTO app_fom.response_code(code, description, create_user) VALUES
('IRRELEVANT', 'Irrelevant', CURRENT_USER),
('CONSIDERED', 'Considered', CURRENT_USER),
('ADDRESSED', 'Addressed', CURRENT_USER);


/* ------- ddl script for app_fom.workflow_state_code ---------*/  
drop table if exists app_fom.workflow_state_code ;  
create table if not exists app_fom.workflow_state_code  
( 
code varchar not null primary key  ,
description varchar not null ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  

); 

comment on table  app_fom.workflow_state_code is 'Defines the steps in the business process / workflow that a FOM project goes through. If a project is withdrawn prior to finalization it is physically deleted (this is not a workflow state). After 3 years after opening for comments, the FOM project expires and can be archived.';

comment on column app_fom.workflow_state_code.code is 'Code value ';
comment on column app_fom.workflow_state_code.description is 'Code description ';

comment on column app_fom.workflow_state_code.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.workflow_state_code.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.workflow_state_code.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.workflow_state_code.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.workflow_state_code.revision_count is 'Standard column for optimistic locking on updates.';

INSERT INTO app_fom.workflow_state_code(code, description, create_user) VALUES
('INITIAL', 'Initial', CURRENT_USER), 
('PUBLISHED', 'Published', CURRENT_USER), 
('COMMENT_OPEN', 'Commenting Open', CURRENT_USER),
('COMMENT_CLOSED', 'Commenting Closed', CURRENT_USER),
('FINALIZED', 'Finalized', CURRENT_USER),
('EXPIRED', 'Expired', CURRENT_USER);


/* ------- ddl script for app_fom.submission_type_code ---------*/  
drop table if exists app_fom.submission_type_code ;  
create table if not exists app_fom.submission_type_code  
( 
code varchar not null primary key  ,
description varchar not null ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  

); 

comment on table  app_fom.submission_type_code is 'Defines the type of submission - proposed (initial) or final.';

comment on column app_fom.submission_type_code.code is 'Code value ';
comment on column app_fom.submission_type_code.description is 'Code description ';

comment on column app_fom.submission_type_code.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.submission_type_code.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.submission_type_code.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.submission_type_code.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.submission_type_code.revision_count is 'Standard column for optimistic locking on updates.';

INSERT INTO app_fom.submission_type_code(code, description, create_user) VALUES 
('PROPOSED', 'Proposed', CURRENT_USER),
('FINAL', 'Final', CURRENT_USER);


/* ------- ddl script for app_fom.attachment_type_code ---------*/  
drop table if exists app_fom.attachment_type_code ;  
create table if not exists app_fom.attachment_type_code  
( 
code varchar not null primary key  ,
description varchar not null ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  
); 

comment on table  app_fom.attachment_type_code is 'Defines what an attachment relates to - a stakeholder interaction or a public notice.';

comment on column app_fom.attachment_type_code.code is 'Code value ';
comment on column app_fom.attachment_type_code.description is 'Code description ';

comment on column app_fom.attachment_type_code.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.attachment_type_code.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.attachment_type_code.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.attachment_type_code.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.attachment_type_code.revision_count is 'Standard column for optimistic locking on updates.';

INSERT INTO app_fom.attachment_type_code(code, description, create_user) VALUES 
('INTERACTION', 'Interaction', CURRENT_USER),
('PUBLIC_NOTICE', 'Public Notice', CURRENT_USER),
('SUPPORTING_DOC', 'Supporting Document', CURRENT_USER);


-- EXTERNAL SYSTEM DATA TABLES


/* ------- ddl script for app_fom.forest_client ---------*/  
drop table if exists app_fom.forest_client ; 
create table if not exists app_fom.forest_client
(  
forest_client_number varchar not null primary key ,  
name varchar not null , 

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  

); 

comment on table  app_fom.forest_client is 'FOM local copy of the list of forest clients from an external system (Source: External App called Client, table FOREST_CLIENT)';

comment on column app_fom.forest_client.forest_client_number is 'Primary key. Corresponds to CLIENT_NUMBER in source system. ';
comment on column app_fom.forest_client.name is 'Corresponds to column CLIENT_NAME in source system. ';

comment on column app_fom.forest_client.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.forest_client.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.forest_client.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.forest_client.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.forest_client.revision_count is 'Standard column for optimistic locking on updates.';


/* ------- ddl script for app_fom.district ---------*/  
drop table if exists app_fom.district ; 
create table if not exists app_fom.district 
(  
district_id integer not null primary key ,  
name varchar not null , 
email varchar not null ,

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  

); 

comment on table  app_fom.district is 'FOM local copy of the list of districts from an external system (Oracle database DB, Schema THE, Table ORG_UNIT).';

comment on column app_fom.district.district_id is 'Primary key. Corresponds to ORG_UNIT_NO in source system. ';
comment on column app_fom.district.name is 'Corresponds to column ORG_UNIT_NAME in source system. ';
comment on column app_fom.district.name is 'Email address for the district. ';

comment on column app_fom.district.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.district.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.district.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.district.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.district.revision_count is 'Standard column for optimistic locking on updates.';


/* ------- ddl script for app_fom.forest_client_user ---------*/  
/* Currently do not need this table.
drop table if exists app_fom.forest_client_user ; 
create table if not exists app_fom.forest_client_user 
(  
forest_client_user_id serial not null primary key ,  
forest_client_number varchar not null references forest_client (forest_client_number) , 
keycloak_id varchar not null unique ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar 
);  

comment on table  app_fom.forest_client_user is 'Mapping between BCeID (forest client user id) and forest client. Used for authorization to determine which FOMs a user is allowed to edit. This is a local copy of data from an external system (Source: WebADE database).';

comment on column app_fom.forest_client_user.forest_client_user_id is 'Primary key ';
comment on column app_fom.forest_client_user.forest_client_number is 'Foreign key to forest client ';
comment on column app_fom.forest_client_user.keycloak_id is 'Keycloak user id. Will correspond to BCeID for forest client users. ';

comment on column app_fom.forest_client_user.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.forest_client_user.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.forest_client_user.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.forest_client_user.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.forest_client_user.revision_count is 'Standard column for optimistic locking on updates.';
*/


-- MAIN TABLES

/* ------- ddl script for app_fom.project ---------*/  
drop table if exists app_fom.project ; 
create table if not exists app_fom.project 
(  
project_id serial not null primary key ,  
name varchar ,  
description varchar ,  
fsp_id integer not null ,  
district_id integer  references app_fom.district(district_id) ,  
forest_client_number varchar not null references app_fom.forest_client(forest_client_number) ,
workflow_state_code  varchar not null references app_fom.workflow_state_code(code) ,
commenting_open_date date ,  
commenting_closed_date date , 
geometry_latlong GEOMETRY(POINT, 4326) ,

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar 

); 
alter sequence app_fom.project_project_id_seq restart with 1000;

create index on app_fom.project (fsp_id);
create index on app_fom.project (district_id);
create index on app_fom.project (workflow_state_code);
create index on app_fom.project (commenting_open_date);

comment on table  app_fom.project is 'Root entity for the FOM application by a Forest Client. Contains the proposed FOM submission, the public comments and responses, the stakeholder interactions and attachments, and the final FOM submission. Design note: The business is not interested in what the Forest Client does prior to finalization other than capturing the proposed and final spatial submissions, so any updates to attributes in a proposed project will overwrite existing values.';

comment on column app_fom.project.project_id is 'Primary Key. Will be exposed to users for reference. ';
comment on column app_fom.project.name is 'Name of the project. Should be unique within the same FSP. ';
comment on column app_fom.project.description is 'Longer description of the project. ';
comment on column app_fom.project.fsp_id is 'Each FOM project applies to one forest stewardship plan. ';
comment on column app_fom.project.district_id is 'Each FOM project applies to just one district (even if a FSP spans multiple districts). ';
comment on column app_fom.project.forest_client_number is 'Each project is owned by a particular Forest Client. Only users of that Forest Client can modify the project. ';
comment on column app_fom.project.workflow_state_code is 'Tracks which step in the business process the project is in.  ';
comment on column app_fom.project.commenting_open_date is 'Date when this project is available for public comment. ';
comment on column app_fom.project.commenting_closed_date is 'Date when this project is no longer available for public comment. ';
comment on column app_fom.project.geometry_latlong is ' Central point geographically for the FOM project in EPSG 4326 CRS. Used as a performance optimization for plotting the FOM on the overview map. Calculated value based on the cut blocks and road sections making up the submissions. ';

comment on column app_fom.project.revision_count is 'Standard column for optimistic locking on updates.';
comment on column app_fom.project.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.project.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.project.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.project.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';


/* ------- ddl script for app_fom.submission ---------*/  
drop table if exists app_fom.submission ; 
create table if not exists app_fom.submission 
(  
submission_id serial not null primary key ,  
project_id integer not null references app_fom.project (project_id) , 
submission_type_code varchar not null references app_fom.submission_type_code(code) , 

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  
);  
alter sequence app_fom.submission_submission_id_seq restart with 1000;

create index on app_fom.submission (project_id);

comment on table  app_fom.submission is 'For each FOM project the proposed submission submitted for commenting and the finalized submission (updated in response) are tracked as separate submission. Each submission consists of one or more geometries (shapes) that defines the area where logging of trees and related forestry activities is planned. A shape can be for a cut block, road section, or wildlife tree retention area (WTRA) within a cutblock.';

comment on column app_fom.submission.submission_id is ' Primary key ';
comment on column app_fom.submission.project_id is ' Parent project. ';
comment on column app_fom.submission.submission_type_code is ' Specifies whether this is the initial or final submission. ';

comment on column app_fom.submission.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.submission.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.submission.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.submission.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.submission.revision_count is 'Standard column for optimistic locking on updates.';


/* ------- ddl script for app_fom.cut_block ---------*/  
drop table if exists app_fom.cut_block ; 
create table if not exists app_fom.cut_block 
( 
cut_block_id serial not null primary key ,  
submission_id integer not null references app_fom.submission (submission_id) , 
geometry GEOMETRY(POLYGON, 3005) not null  ,  
planned_development_date date not null  ,  
name varchar ,
planned_area_ha real , 

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar 
); 
alter sequence app_fom.cut_block_cut_block_id_seq restart with 1000;

create index on app_fom.cut_block (submission_id);

comment on table  app_fom.cut_block is 'An area in which trees will be cut down.';

comment on column app_fom.cut_block.cut_block_id is 'Primary key ';
comment on column app_fom.cut_block.submission_Id is 'Parent submission. ';
comment on column app_fom.cut_block.geometry is 'The spatial area ';
comment on column app_fom.cut_block.planned_development_date is 'Date when activity is planned to start. ';
comment on column app_fom.cut_block.name is 'Business name for the spatial object. ';
comment on column app_fom.cut_block.planned_area_ha is 'Area of the cutbock in which trees will be removed. Units of Hectares. ';

comment on column app_fom.cut_block.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.cut_block.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.cut_block.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.cut_block.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.cut_block.revision_count is 'Standard column for optimistic locking on updates.';


/* ------- ddl script for app_fom.retention_area ---------*/  
drop table if exists app_fom.retention_area ; 
create table if not exists app_fom.retention_area 
( 
retention_area_id serial not null primary key ,  
submission_id integer not null references app_fom.submission (submission_id) , 
geometry GEOMETRY(POLYGON, 3005) not null  ,  
planned_area_ha real , 

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar 
);  
alter sequence app_fom.retention_area_retention_area_id_seq restart with 1000;

create index on app_fom.retention_area (submission_id);

comment on table  app_fom.retention_area is 'A Wildlife Tree Retention Area (WTRA). Each WTRA is a subset (inner polyon) of an associated cut block specifying where trees/wildlife will be retained (not cut down). There is no business need to have a relationship between a WTRA and its corresponding cut block.';

comment on column app_fom.retention_area.retention_area_id is 'Primary key ';
comment on column app_fom.retention_area.submission_id is 'Parent submission. ';
comment on column app_fom.retention_area.geometry is 'The spatial area. ';
comment on column app_fom.retention_area.planned_area_ha is 'Submitted area. Units of Hectares. ';

comment on column app_fom.retention_area.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.retention_area.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.retention_area.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.retention_area.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.retention_area.revision_count is 'Standard column for optimistic locking on updates.';


/* ------- ddl script for app_fom.road_section ---------*/  
drop table if exists app_fom.road_section ; 
create table if not exists app_fom.road_section 
(  
road_section_id serial not null primary key ,  
submission_id integer not null references app_fom.submission (submission_id) , 
geometry GEOMETRY(LINESTRING, 3005) not null , 
planned_development_date date not null  ,  
name varchar,
planned_length_km real , 

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar 

); 
alter sequence app_fom.road_section_road_section_id_seq restart with 1000;

create index on app_fom.road_section (submission_id);

comment on table  app_fom.road_section is 'A section of road that will be created.';

comment on column app_fom.road_section.road_section_id is 'Primary key ';
comment on column app_fom.road_section.submission_id is 'Parent submission ';
comment on column app_fom.road_section.geometry is 'The spatial line of the road section. Expected to be an open, simple line. ';
comment on column app_fom.road_section.planned_development_date is 'Date when activity is planned to start. ';
comment on column app_fom.road_section.name is 'Business name for the spatial object. ';
comment on column app_fom.road_section.planned_length_km is 'Length of the road section. Units of Kilometers. ';

comment on column app_fom.road_section.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.road_section.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.road_section.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.road_section.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.road_section.revision_count is 'Standard column for optimistic locking on updates.';


/* ------- ddl script for app_fom.attachment ---------*/  
drop table if exists app_fom.attachment ; 
create table if not exists app_fom.attachment 
( 
attachment_id serial not null primary key ,  
project_id integer not null references app_fom.project(project_id) ,  
attachment_type_code varchar not null references app_fom.attachment_type_code(code),  
file_name varchar not null  ,  
file_contents bytea not null  , 

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  
); 
alter sequence app_fom.attachment_attachment_id_seq restart with 1000;

create index on app_fom.attachment (project_id);

comment on table  app_fom.attachment is 'A document or other type of file that provides evidence of a stakeholder interaction or posting of a public notice.';

comment on column app_fom.attachment.attachment_id is 'Primary key ';
comment on column app_fom.attachment.project_id is 'Parent project ';
comment on column app_fom.attachment.attachment_type_code is 'Specifies whether this attachment is for an interaction or for a public notice. ';
comment on column app_fom.attachment.file_name is 'Name of the file. ';
comment on column app_fom.attachment.file_contents is 'Binary contents of the file. In PostgresSQL hex format ';

comment on column app_fom.attachment.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.attachment.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.attachment.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.attachment.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.attachment.revision_count is 'Standard column for optimistic locking on updates.';


/* ------- ddl script for app_fom.public_comment ---------*/  
drop table if exists app_fom.public_comment ; 
create table if not exists app_fom.public_comment 
(  
public_comment_id serial not null primary key ,  
project_id integer not null references app_fom.project(project_id) ,  
comment_scope_code varchar not null references app_fom.comment_scope_code(code) ,
scope_road_section_id integer references app_fom.road_section(road_section_id) ,
scope_cut_block_id integer references app_fom.cut_block(cut_block_id) ,
feedback varchar not null  ,  
name bytea ,  
location bytea ,  
email bytea ,  
phone_number bytea ,  
response_code varchar references app_fom.response_code(code),  
response_details varchar ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  
);  
alter sequence app_fom.public_comment_public_comment_id_seq restart with 1000;

create index on app_fom.public_comment (project_id);

comment on table  app_fom.public_comment is 'A comment made by a member of the public regarding a proposed FOM project.';

comment on column app_fom.public_comment.public_comment_id is 'Primary key ';
comment on column app_fom.public_comment.project_id is 'Parent project ';
comment on column app_fom.public_comment.comment_scope_code is 'The scope that the comment applies to - either the entire submission or a specific block or section. ';
comment on column app_fom.public_comment.scope_road_section_id is 'The road section that this comment applies to. ';
comment on column app_fom.public_comment.scope_cut_block_id is 'The cut block that this comment applies to. ';
comment on column app_fom.public_comment.feedback is 'The comment text provided by a citizen. ';
comment on column app_fom.public_comment.name is 'The name of the citizen. ';
comment on column app_fom.public_comment.location is 'The location of the citizen.  ';
comment on column app_fom.public_comment.email is 'The email address of the citizen. ';
comment on column app_fom.public_comment.phone_number is 'The phone number of the citizen. ';
comment on column app_fom.public_comment.response_code is 'The classification of the response to the comment by the forest client. ';
comment on column app_fom.public_comment.response_details is 'A description of how the comment is addressed supplied by the forest client. ';

comment on column app_fom.public_comment.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.public_comment.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.public_comment.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.public_comment.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.public_comment.revision_count is 'Standard column for optimistic locking on updates.';  


/* ------- ddl script for app_fom.interaction ---------*/  
drop table if exists app_fom.interaction ; 
create table if not exists app_fom.interaction 
( 
interaction_id serial not null primary key ,  
project_id integer not null references app_fom.project(project_id) ,  
attachment_id integer references app_fom.attachment(attachment_id) ,  
stakeholder varchar not null  ,  
communication_date date not null  ,  
communication_details varchar not null ,  

revision_count integer not null default 1 ,
create_timestamp timestamptz not null default now() ,  
create_user varchar not null ,  
update_timestamp timestamptz ,  
update_user varchar  
); 
alter sequence app_fom.interaction_interaction_id_seq restart with 1000;

create index on app_fom.interaction (project_id);

comment on table  app_fom.interaction is 'A record of interaction between a stakeholder (e.g. citizen, special interest group) and the forest client regarding a proposed FOM project.';

comment on column app_fom.interaction.interaction_id is 'Primary key ';
comment on column app_fom.interaction.project_id is 'Parent project ';
comment on column app_fom.interaction.attachment_id is 'Attachment providing evidence of the interaction ';
comment on column app_fom.interaction.stakeholder is 'Description of the stakeholder ';
comment on column app_fom.interaction.communication_date is 'Date on which communication took place. ';
comment on column app_fom.interaction.communication_details is 'Details regarding the communication that occurred. ';

comment on column app_fom.interaction.create_timestamp is 'Time of creation of the record.';
comment on column app_fom.interaction.create_user is 'The user id who created the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.interaction.update_timestamp is 'Time of most recent update to the record.';
comment on column app_fom.interaction.update_user is 'The user id who last updated the record. For citizens creating comments, a common hardcoded user id will be used.';
comment on column app_fom.interaction.revision_count is 'Standard column for optimistic locking on updates.';

/* ------- ddl script for app_fom.spatial_feature ---------*/  
/* This converts geometries to lat/long for consumption by leaflet and BCGW. */
drop view if exists app_fom.spatial_feature;
create view app_fom.spatial_feature as 
  select o.cut_block_id as feature_id, 'cut_block' as feature_type,
  p.project_id, p.forest_client_number, p.workflow_state_code,
  s.submission_type_code,  
  o.create_timestamp,
  o.name, ST_AsGeoJson(ST_Transform(o.geometry, 4326)) as geojson, o.planned_development_date, o.planned_area_ha, 0.0 as planned_length_km
  from app_fom.cut_block o
  inner join app_fom.submission s on o.submission_id = s.submission_id
  inner join app_fom.project p on s.project_id = p.project_id
union       
  select o.retention_area_id as feature_id, 'retention_area' as feature_type,
  p.project_id, p.forest_client_number, p.workflow_state_code,
  s.submission_type_code,  
  o.create_timestamp,
  null as name, ST_AsGeoJson(ST_Transform(o.geometry, 4326)) as geojson, null as planned_development_date, o.planned_area_ha, 0.0 as planned_length_km
  from app_fom.retention_area o
  inner join app_fom.submission s on o.submission_id = s.submission_id
  inner join app_fom.project p on s.project_id = p.project_id
union
  select o.road_section_id as feature_id, 'road_section' as feature_type,
  p.project_id, p.forest_client_number, p.workflow_state_code,
  s.submission_type_code,  
  o.create_timestamp,
  o.name, ST_AsGeoJson(ST_Transform(o.geometry, 4326)) as geojson, o.planned_development_date, null as planned_area_ha, o.planned_length_km
  from app_fom.road_section o
  inner join app_fom.submission s on o.submission_id = s.submission_id
  inner join app_fom.project p on s.project_id = p.project_id
;

comment on view app_fom.spatial_feature is 'Denormalized table of spatial features (shapes) of FOM projects converting geometry columns to geojson with lat/long.';

        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
        -- Drop views
        drop view if exists app_fom.spatial_feature;

        -- Drop all tables with foreign keys in dependency order (children first, then parents, then external tables, then code tables) to allow this script to be rerunnable for testing.
        drop table if exists app_fom.interaction;
        drop table if exists app_fom.attachment;
        drop table if exists app_fom.cut_block;
        drop table if exists app_fom.retention_area;
        drop table if exists app_fom.road_section;
        drop table if exists app_fom.public_comment;
        drop table if exists app_fom.submission;
        drop table if exists app_fom.project;

        -- External tables
        drop table if exists app_fom.district;
        drop table if exists app_fom.forest_client;
        drop table if exists app_fom.forest_client_user;

        -- Code Tables
        drop table if exists app_fom.attachment_type_code;                
        drop table if exists app_fom.response_code;
        drop table if exists app_fom.submission_type_code;
        drop table if exists app_fom.workflow_state_code;
        drop table if exists app_fom.comment_scope_code;
        `);
  }
};
