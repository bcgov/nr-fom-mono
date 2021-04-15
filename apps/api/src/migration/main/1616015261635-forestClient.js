const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class forestClient1616015261635 {

    // TODO: Add the full list of forest clients...
    async up(queryRunner) {
        await queryRunner.query(`
        DELETE FROM app_fom.forest_client;

        INSERT INTO app_fom.forest_client(forest_client_number, name, create_user) VALUES 
        ('1011', 'AKIECA EXPLORERS LTD.', CURRENT_USER),
        ('1012', 'BELL LUMBER & POLE CANADA, ULC', CURRENT_USER),
        ('1016', 'ALBREDA RIVER POLE CO. LTD.', CURRENT_USER),
        ('1021', 'ROYAL PACIFIC TRANSPORT LTD.', CURRENT_USER),
        ('1026', 'ALLISON PASS SAWMILLS LTD.', CURRENT_USER),
        ('1027', 'ALLISON LOGGING CO. LTD.', CURRENT_USER),
        ('1035', 'CANADIAN OVERSEAS LOG & LUMBER LTD.', CURRENT_USER),
        ('177031', 'DIVINE LOGISTICS LTD.', CURRENT_USER),
        ('1056', 'APOLLO FOREST PRODUCTS LTD.', CURRENT_USER),
        ('1060', 'ARROW LAKES CEDAR POLE', CURRENT_USER),
        ('1062', 'FIRST TIER ENERGY LTD.', CURRENT_USER),
        ('1065', 'ATCO LUMBER LTD.', CURRENT_USER),
        ('1075', 'BRITISH COLUMBIA RAILWAY COMPANY', CURRENT_USER),
        ('1081', 'W.E.BAIKIE LOGGING LTD.', CURRENT_USER),
        ('1094', 'R. H. BARBOUR LOGGING CO. LTD.', CURRENT_USER),
        ('1169', 'BOSER CEDAR PRODUCTS LTD.', CURRENT_USER),
        ('1183', 'BOW RIVER RESOURCES LTD', CURRENT_USER),
        ('1201', 'BRANHAM SHAKE CO. LTD.', CURRENT_USER),
        ('1297', 'CARRIER LUMBER LTD.', CURRENT_USER),
        ('1310', 'CATTERMOLE TIMBER LTD.', CURRENT_USER),
        ('1311', 'CAWLEY SAWMILL LTD.', CURRENT_USER),
        ('1314', 'CEDAR RIVER TIMBER (1971) CO. LTD.', CURRENT_USER),
        ('1317', 'CEDEX TIMBER LTD.', CURRENT_USER),
        ('1333', 'CHEVRON CANADA RESOURCES LIMITED', CURRENT_USER),
        ('1338', 'CHILAKO SAWMILL LTD.', CURRENT_USER),
        ('1341', 'H.S. CHRISTENSEN LOGGING LTD.', CURRENT_USER),
        ('1379', 'COOKS CREEK SAWMILL LTD.', CURRENT_USER),
        ('1386', 'COSEKA RESOURCES LIMITED', CURRENT_USER),
        ('1418', 'CZAR RESOURCES LTD.', CURRENT_USER),
        ('1427', 'WINDCHIME DEVELOPMENTS INC', CURRENT_USER),
        ('1429', 'DARFIELD BUILDING PRODUCTS INC.', CURRENT_USER)
        ;
        `);
    }

    async down(queryRunner) {
    }

}
