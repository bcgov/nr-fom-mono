const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class updateDistricts1651596845339 {

    async up(queryRunner) {
        console.log('Starting update of district emails');

        await queryRunner.query(`
        UPDATE app_fom.district set email = 'FTA.DCKDSQ', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 15;
        UPDATE app_fom.district set email = 'Forests.PrinceGeorgeDistrictOffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 18;
        UPDATE app_fom.district set email = 'DTR.Tenures', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 21;
        UPDATE app_fom.district set email = 'FTA.DCKDSQ', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 23;
        UPDATE app_fom.district set email = 'FTA.DSC', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 27;
        UPDATE app_fom.district set email = 'dsn.submissions', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 30;
        UPDATE app_fom.district set email = 'DCM.Tenures', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 32;
        UPDATE app_fom.district set email = 'Forests.MackenzieDistrictOffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 38;
        UPDATE app_fom.district set email = 'FTA.DCR', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 43;
        UPDATE app_fom.district set email = 'Forests.FortNelsonDistrictOffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 46;
        UPDATE app_fom.district set email = 'FrontCounterHaidaGwaii', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 48;
        UPDATE app_fom.district set email = 'Forests.QuesnelDistrictOffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 50;
        UPDATE app_fom.district set email = 'FLNR.100MileHouseDistrict', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 56;
        UPDATE app_fom.district set email = 'FTA.DSI', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1619;
        UPDATE app_fom.district set email = 'Forests.NadinaDistrictOffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1823;
        UPDATE app_fom.district set email = 'Forests.SkeenaStikineDistrictOffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1824;
        UPDATE app_fom.district set email = 'PeaceDistrict.Tenures', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1825;
        UPDATE app_fom.district set email = 'DCC.Tenures', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1826;
        UPDATE app_fom.district set email = 'Forests.CascadesDistrictOffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1828;
        UPDATE app_fom.district set email = 'DOS.CPRP', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1829;
        UPDATE app_fom.district set email = 'FORESTS.rockymountaindistrictoffice', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1831;
        UPDATE app_fom.district set email = 'FTA.DIC', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1832;
        UPDATE app_fom.district set email = 'Resources.Nelson', update_timestamp = now(), update_user = 'migration', revision_count = revision_count+1 where district_id = 1902;

        `);
    }

    async down(queryRunner) {
        // No reversion of this change - email addresses will remain changed, no adverse impact.
    }
}
        