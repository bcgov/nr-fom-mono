import {MigrationInterface, QueryRunner, Table} from 'typeorm';

import {
    createTable as createAttachmentTypeCodeTable,
    dropTable as dropAttachmentTypeCodeTable
} from './1613577521127-initialize-tables/attachment-type-code.table';
import {
    createTable as createResponseCodeTable,
    dropTable as dropResponseCodeTable
} from './1613577521127-initialize-tables/response-code.table';
import {
    createTable as createSubmissionTypeCodeTable,
    dropTable as dropSubmissionTypeCodeTable
} from './1613577521127-initialize-tables/submission-type-code.table';
import {
    createTable as createWorkflowStateCodeTable,
    dropTable as dropWorkflowStateCodeTable
} from './1613577521127-initialize-tables/workflow-state-code.table';

export class initializeTables1613577521127 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create code tables first
        createAttachmentTypeCodeTable(queryRunner);
        createResponseCodeTable(queryRunner);
        createSubmissionTypeCodeTable(queryRunner);
        createWorkflowStateCodeTable(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop code tables
        dropAttachmentTypeCodeTable(queryRunner);
        dropResponseCodeTable(queryRunner);
        dropSubmissionTypeCodeTable(queryRunner);
        dropWorkflowStateCodeTable(queryRunner);
    }
}
