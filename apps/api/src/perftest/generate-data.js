
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

*/
function generateDeletes() {
    console.log(`
DELETE FROM app_fom.project where project_id >= 1000;
    `);
}

function generateProjectInserts(index, isCommentingOpen, point) {
    const id = 1000+index;
    const cutblockId=id+index*4;
    const x = point.x;
    const y = point.y;
    const state = isCommentingOpen ? 'COMMENT_OPEN' : 'COMMENT_CLOSED';

    console.log(`
INSERT INTO app_fom.project(
project_id, name, description, fsp_id, district_id, forest_client_number, workflow_state_code,
commenting_open_date, commenting_closed_date, create_user ) VALUES
(${id}, 'Fake name ${id}', 'Description ${id}, location ${x}, ${y}. ', 11, null, 1201, '${state}', '2020-01-01', '2021-01-31', 'testdata');
INSERT INTO app_fom.submission(submission_id, project_id, submission_type_code, create_user) values
(${id}, ${id}, 'PROPOSED', 'testdata');
INSERT INTO app_fom.cut_block (cut_block_id, submission_id, name, planned_development_date, geometry, create_user) VALUES
(${cutblockId}, ${id}, 'my cut block 1', '2022-04-01', ST_GeomFromText('POLYGON((${x+500} ${y}, ${x+500+500} ${y}, ${x+500+500} ${y+500}, ${x+500} ${y+500}, ${x+500} ${y}))', 3005), 'testdata')
,(${cutblockId+1}, ${id}, 'my cut block 2', '2022-04-01', ST_GeomFromText('POLYGON((${x} ${y+500}, ${x+500} ${y+500}, ${x+500} ${y+500+500}, ${x} ${y+500+500}, ${x} ${y+500}))', 3005), 'testdata')
,(${cutblockId+2}, ${id}, 'my cut block 3', '2022-04-01', ST_GeomFromText('POLYGON((${x-500} ${y}, ${x+500-500} ${y}, ${x+500-500} ${y+500}, ${x-500} ${y+500}, ${x-500} ${y}))', 3005), 'testdata')
,(${cutblockId+3}, ${id}, 'my cut block 4', '2022-04-01', ST_GeomFromText('POLYGON((${x} ${y-500}, ${x+500} ${y-500}, ${x+500} ${y+500-500}, ${x} ${y+500-500}, ${x} ${y-500}))', 3005), 'testdata')
;
INSERT INTO app_fom.road_section(road_section_id, submission_id, name, planned_development_date, geometry, create_user) VALUES 
(${id}, ${id}, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(${x} ${y}, ${x} ${y+1000}, ${x+750} ${y+750})', 3005), 'testdata');
INSERT INTO app_fom.retention_area(retention_area_id, submission_id, geometry, create_user) VALUES 
(${id}, ${id}, ST_GeomFromText('POLYGON((${x-250} ${y-250}, ${x+250} ${y-250}, ${x+250} ${y+250}, ${x-250} ${y+250}, ${x-250} ${y-250}))', 3005), 'testdata');
    `);
}

function generateAllProjectInserts() {
    // Generation range for locations:    
    const topLeft = {x: 503476, y:1670000 };
    const topRight = {x: 1125486, y:1670000 };
    const botLeft = { x: 1007859, y:459000 };

    const numYears = 3;
    const numProjects = 1000 * numYears;

    const projectsPerRow = Math.sqrt(numProjects);
    const numRows = (numProjects / projectsPerRow);

    const xDelta = (topRight.x - topLeft.x)/Math.sqrt(numProjects);
    const yDelta = (botLeft.y - topLeft.y)/Math.sqrt(numProjects);
    const startXDelta = (botLeft.x - topLeft.x)/Math.sqrt(numProjects);
    
    let projectIndex = 1;
    for (let col = 0; col < projectsPerRow; col++) {
        for (let row = 0; row < numRows; row++) {
            const x = topLeft.x + (row*startXDelta) + xDelta * col + (Math.random()*2-1)*xDelta;            
            const y = topLeft.y + yDelta * row + (Math.random()*2-1)*yDelta;
            const commentingOpen = (projectIndex % (12*numYears) == 0);
            generateProjectInserts(projectIndex, commentingOpen, { x: x, y: y})
            projectIndex++;
        }
    }
}

function generateSequenceUpdates() {
    console.log(`
alter sequence app_fom.project_project_id_seq restart with 100000;
alter sequence app_fom.submission_submission_id_seq restart with 100000;
alter sequence app_fom.cut_block_cut_block_id_seq restart with 100000;
alter sequence app_fom.retention_area_retention_area_id_seq restart with 100000;
alter sequence app_fom.road_section_road_section_id_seq restart with 100000;
        `);
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
generateSequenceUpdates();
generateGeoSpatialUpdates();
