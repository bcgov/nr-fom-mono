import {MigrationInterface, QueryRunner} from 'typeorm';

// Code tables
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

// Core tables
import {
    createTable as createAttachmentTable,
    dropTable as dropAttachmentTable
} from './1613577521127-initialize-tables/attachment.table';
import {
    createTable as createCutBlockTable,
    dropTable as dropCutBlockTable
} from './1613577521127-initialize-tables/cut-block.table';
import {
    createTable as createInteractionTable,
    dropTable as dropInteractionTable
} from './1613577521127-initialize-tables/interaction.table';
import {
    createTable as createProjectTable,
    dropTable as dropProjectTable
} from './1613577521127-initialize-tables/project.table';
import {
    createTable as createPublicCommentTable,
    dropTable as dropPublicCommentTable
} from './1613577521127-initialize-tables/public-comment.table';
import {
    createTable as createRetentionAreaTable,
    dropTable as dropRetentionAreaTable
} from './1613577521127-initialize-tables/retention-area.table';
import {
    createTable as createRoadSectionTable,
    dropTable as dropRoadSectionTable
} from './1613577521127-initialize-tables/road-section.table';
import {
    createTable as createSubmissionTable,
    dropTable as dropSubmissionTable
} from './1613577521127-initialize-tables/submission.table';

export class initializeTables1613577521127 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create code tables first
        createAttachmentTypeCodeTable(queryRunner);
        createResponseCodeTable(queryRunner);
        createSubmissionTypeCodeTable(queryRunner);
        createWorkflowStateCodeTable(queryRunner);
        // Create core tables
        createAttachmentTable(queryRunner);
        createCutBlockTable(queryRunner);
        createInteractionTable(queryRunner);
        createProjectTable(queryRunner);
        createPublicCommentTable(queryRunner);
        createRetentionAreaTable(queryRunner);
        createRoadSectionTable(queryRunner);
        // createSubmissionTable(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop code tables
        dropAttachmentTypeCodeTable(queryRunner);
        dropResponseCodeTable(queryRunner);
        dropSubmissionTypeCodeTable(queryRunner);
        dropWorkflowStateCodeTable(queryRunner);
        // Drop core tables
        dropAttachmentTable(queryRunner);
        // dropCutBlockTable(queryRunner);
        dropInteractionTable(queryRunner);
        dropProjectTable(queryRunner);
        dropPublicCommentTable(queryRunner);
        // dropRetentionAreaTable(queryRunner);
        // dropRoadSectionTable(queryRunner);
        // dropSubmissionTable(queryRunner);
    }
}
