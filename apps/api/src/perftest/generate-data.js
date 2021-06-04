
/*
Design: This creates SQL statements (inserts, updates, etc) to run against the database. This script is designed to generate ~3 years of FOM data, 
focused on FOM projects (to test display in Public component) and FOM spatial features (to test export to BCGW). 
3 years is the duration after which FOM projects expire, and thus no longer show up on the public site and in BCGW.

Record Counts:
# FOMs / year = 1000
# Cutblocks / year = 4200
# Road sections / year = 2000
# Retention areas / year = 1000

Generate 1 FOM with 4 cut blocks, 2 roads, and 1 road section. 
Each FOM will have a location (x,y) that all the shapes will be based off.

        -- app_fom.project 
        INSERT INTO app_fom.project(
            project_id, name, description, fsp_id, district_id, forest_client_number, workflow_state_code,
            commenting_open_date, commenting_closed_date, create_user ) VALUES
        (1, 'Fake name 1', 'Initial no submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, null, 1011, 'INITIAL', null, null, 'testdata')
        , (2, 'Fake name 2 a bit longer', 'Initial with submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 43, 1012, 'INITIAL', '2021-03-03', null, 'testdata')
        , (3, 'Fake name 3 with lots of comments', 'Commenting open with submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 43, 1012, 'COMMENT_OPEN', '2021-04-01', '2022-04-01', 'testdata')
        , (4, 'Fake name 4 with lots of attachments & name 50 chars', 'Commenting closed with only proposed submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 56, 1016, 'COMMENT_CLOSED', '2021-02-01', '2021-03-01', 'testdata')
        , (5, 'Fake name 5', 'Commenting closed with proposed + final submissions project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 56, 1016, 'COMMENT_CLOSED', '2021-03-01', '2021-03-31', 'testdata')
        , (6, 'Fake name 6', 'Finalized project with identical proposed/final shapes. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 46, 1021, 'FINALIZED', '2021-01-01', '2021-01-31', 'testdata')
        , (7, 'Fake name 7', 'Published project with proposed submission. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 46, 1021, 'PUBLISHED', '2022-04-01', '2022-05-01', 'testdata')
        , (8, 'Fake name 8', 'Expired project with proposed+final submissions. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 18, 1026, 'EXPIRED', '2019-12-01', '2019-12-31', 'testdata')
        ;
        
        -- app_fom.submission
        INSERT INTO app_fom.submission(submission_id, project_id, submission_type_code, create_user) values
        (20, 2, 'PROPOSED', 'testdata')
        , (30, 3, 'PROPOSED', 'testdata')
        , (40, 4, 'PROPOSED', 'testdata')
        , (50, 5, 'PROPOSED', 'testdata')
        , (51, 5, 'FINAL', 'testdata')
        , (60, 6, 'PROPOSED', 'testdata')
        , (61, 6, 'FINAL', 'testdata')
        , (70, 7, 'FINAL', 'testdata')
        , (80, 8, 'PROPOSED', 'testdata')
        , (81, 8, 'FINAL', 'testdata')
        ;
       
        -- app_fom.cut_block
		INSERT INTO app_fom.cut_block (cut_block_id, submission_id, name, planned_development_date, geometry, create_user) VALUES
		(200, 20, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1474614 555392, 1474818 555392, 1474818 555080, 1474614 555080, 1474614 555392))', 3005), 'testdata')
		, (300, 30, 'my cut block with comments', '2022-04-01', ST_GeomFromText('POLYGON((1474614 555392, 1474818 555392, 1474818 555080, 1474614 555080, 1474614 555392))', 3005), 'testdata')
		, (400, 40, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1474714 555492, 1474918 555492, 1474918 555180, 1474714 555280, 1474714 555492))', 3005), 'testdata')
		, (500, 50, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1454714 555492, 1454918 555492, 1454918 555180, 1454714 555280, 1454714 555492))', 3005), 'testdata')
		, (510, 51, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1454814 555392, 1455018 555392, 1455018 555080, 1454814 555180, 1454814 555392))', 3005), 'testdata')
		, (600, 60, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1090000 850000, 1100000 860000, 1110000 850000, 1110000 840000, 1090000 840000, 1090000 850000))', 3005), 'testdata')
		, (610, 61, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1090000 850000, 1100000 860000, 1110000 850000, 1110000 840000, 1090000 840000, 1090000 850000))', 3005), 'testdata')
		, (700, 70, null, '2023-04-01', ST_GeomFromText('POLYGON((1300000 750000, 1310000 760000, 1320000 750000, 1320000 740000, 1300000 740000, 1300000 750000))', 3005), 'testdata')
		, (800, 80, null, '2023-04-01', ST_GeomFromText('POLYGON((1300000 750000, 1310000 760000, 1320000 750000, 1320000 740000, 1300000 740000, 1300000 750000))', 3005), 'testdata')
		, (810, 81, null, '2023-04-01', ST_GeomFromText('POLYGON((1300000 750000, 1310000 760000, 1320000 750000, 1320000 740000, 1300000 740000, 1300000 750000))', 3005), 'testdata')
		;

		-- app_fom.road_section
		INSERT INTO app_fom.road_section(road_section_id, submission_id, name, planned_development_date, geometry, create_user) VALUES 
		(200, 20, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(1473871.1 555638.3, 1474543.9 555285.1, 1474940.2 555143.5)', 3005), 'testdata')		
		, (300, 30, 'my road with comments', '2021-04-23', ST_GeomFromText('LINESTRING(1473871.1 555638.3, 1474543.9 555285.1, 1474940.2 555143.5)', 3005), 'testdata')		
		, (600, 60, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(1090000 850000, 1085000 855000, 1080000 845000)', 3005), 'testdata')		
		, (610, 61, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(1090000 850000, 1085000 855000, 1080000 845000)', 3005), 'testdata')		
		;

        -- app_fom.retention_area
		INSERT INTO app_fom.retention_area(retention_area_id, submission_id, geometry, create_user) VALUES 
		(300, 30, ST_GeomFromText('POLYGON((1474750 555200, 1474950 555200, 1474950 555080, 1474750 555080, 1474750 555200))', 3005), 'testdata')
		, (600, 60, ST_GeomFromText('POLYGON((1095000 853000, 1100000 857000, 1105000 853000, 1100000 846000, 1095000 853000))', 3005), 'testdata')
		, (610, 61, ST_GeomFromText('POLYGON((1095000 853000, 1100000 857000, 1105000 853000, 1100000 846000, 1095000 853000))', 3005), 'testdata')
		;


*/
function generateProjectInserts(index, point) {
    id = 1000+index;
    x = point.x;
    y = point.y;
    console.log(`
INSERT INTO app_fom.project(
project_id, name, description, fsp_id, district_id, forest_client_number, workflow_state_code,
commenting_open_date, commenting_closed_date, create_user ) VALUES
(${id}, 'Fake name ${id}', 'Description ${id}, location ${x}, ${y}. ', 11, null, 1201, 'COMMENT_CLOSED', '2020-01-01', '2021-01-31', 'testdata');
INSERT INTO app_fom.submission(submission_id, project_id, submission_type_code, create_user) values
(${id}, ${id}, 'PROPOSED', 'testdata');
INSERT INTO app_fom.cut_block (cut_block_id, submission_id, name, planned_development_date, geometry, create_user) VALUES
(${id*4}, ${id}, 'my cut block 1', '2022-04-01', ST_GeomFromText('POLYGON((${x} ${y}, ${x+500} ${y}, ${x+500} ${y+500}, ${x} ${y+500}, ${x} ${y}))', 3005), 'testdata')
,(${id*4+1}, ${id}, 'my cut block 2', '2022-04-01', ST_GeomFromText('POLYGON((${x} ${y}, ${x+500} ${y}, ${x+500} ${y+500}, ${x} ${y+500}, ${x} ${y}))', 3005), 'testdata')
,(${id*4+2}, ${id}, 'my cut block 3', '2022-04-01', ST_GeomFromText('POLYGON((${x} ${y}, ${x+500} ${y}, ${x+500} ${y+500}, ${x} ${y+500}, ${x} ${y}))', 3005), 'testdata')
,(${id*4+3}, ${id}, 'my cut block 4', '2022-04-01', ST_GeomFromText('POLYGON((${x} ${y}, ${x+500} ${y}, ${x+500} ${y+500}, ${x} ${y+500}, ${x} ${y}))', 3005), 'testdata')
;
INSERT INTO app_fom.road_section(road_section_id, submission_id, name, planned_development_date, geometry, create_user) VALUES 
(${id}, ${id}, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(${x} ${y}, ${x} ${y+1000}, ${x+750} ${y+750})', 3005), 'testdata');
INSERT INTO app_fom.retention_area(retention_area_id, submission_id, geometry, create_user) VALUES 
(${id}, ${id}, ST_GeomFromText('POLYGON((${x-250} ${y-250}, ${x+250} ${y-250}, ${x+250} ${y+250}, ${x-250} ${y+250}, ${x-250} ${y-250}))', 3005), 'testdata');

    `);
}

function generateAllProjectInserts() {
    // Generation range:    
    // top left lat/long 59.1, -133.8       553,476;1,593,074
    // top right: 59.3, -123.8              1,125,486;1,592,654
    // bottom left: 50.0, -123.1            1,207,859;558,042
    // bottom right: 50.3, -116.2           1,695,770;635,396
    numProjects = 1000;

    /*
    minX1 = 553476;
    minY1 = 1593074;

    minX2 = 1207859;
    minY2 = 
    */


    startX = 553476;
    startY = 1593074

    generateProjectInserts(1, { x: startX, y: startY})

}

function generateGeoSpatialUpdates() {
    console.log(`
-- Update geometric-derived fields to simulate what the application would do
update app_fom.cut_block set planned_area_ha = ST_AREA(geometry)/10000 where submission_id >= 1000;
update app_fom.retention_area set planned_area_ha = ST_AREA(geometry)/10000 where submission_id >= 1000;
update app_fom.road_section set planned_length_km  = ST_Length(geometry)/1000 where submission_id >= 1000;

with project_geometries as (
    select s.project_id, cb.geometry from app_fom.cut_block cb join app_fom.submission s on cb.submission_id = s.submission_id 
    union 
    select s.project_id, rs.geometry from app_fom.road_section rs join app_fom.submission s on rs.submission_id = s.submission_id 
    union 
    select s.project_id, ra.geometry from app_fom.retention_area ra join app_fom.submission s on ra.submission_id = s.submission_id
)
update app_fom.project p set 
    geometry_latlong = (select ST_Transform(ST_centroid(ST_COLLECT(g.geometry)),4326) from project_geometries g where g.project_id = p.project_id),
    update_timestamp = now(),
    update_user = 'testdata',
    revision_count = (select revision_count+1 from app_fom.project p2 where p.project_id = p2.project_id )
where project_id >= 1000
;
    `);
}

generateDeletes();
generateAllProjectInserts();
generateGeoSpatialUpdates();
