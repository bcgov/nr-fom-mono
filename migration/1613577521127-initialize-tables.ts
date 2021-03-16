import {MigrationInterface, QueryRunner, TableForeignKey} from 'typeorm';

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
        await createAttachmentTypeCodeTable(queryRunner);
        await createResponseCodeTable(queryRunner);
        await createSubmissionTypeCodeTable(queryRunner);
        await createWorkflowStateCodeTable(queryRunner);
        // Create core tables
        await createAttachmentTable(queryRunner);
        await createCutBlockTable(queryRunner);
        await createInteractionTable(queryRunner);
        await createProjectTable(queryRunner);
        await createPublicCommentTable(queryRunner);
        await createRetentionAreaTable(queryRunner);
        await createRoadSectionTable(queryRunner);
        await createSubmissionTable(queryRunner);

        // Create foreign keys
        const foreignKeys = {
            'attachment': [
                {
                    columnNames: ['project_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'project',
                    // onDelete: 'CASCADE'
                },
                {
                    columnNames: ['attachment_type_code'],
                    referencedColumnNames: ['code'],
                    referencedTableName: 'attachment_type_code',
                    // onDelete: 'CASCADE'
                }
            ],
            'cut_block': [
                {
                    columnNames: ['submission_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'submission',
                    // onDelete: 'CASCADE'
                }
            ],
            'interaction': [
                {
                    columnNames: ['project_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'project',
                    // onDelete: 'CASCADE'
                },
                {
                    columnNames: ['attachment_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'attachment',
                    // onDelete: 'CASCADE'
                }
            ],
            'project': [
                /* {
                    columnNames: ['fsp_id'],
                    referencedColumnNames: ['fsp_id'],
                    referencedTableName: 'fsp',
                    // onDelete: 'CASCADE'
                }, */
                /* {
                    columnNames: ['district_id'],
                    referencedColumnNames: ['district_id'],
                    referencedTableName: 'district',
                    // onDelete: 'CASCADE'
                }, */
                /* {
                    columnNames: ['forest_client_id'],
                    referencedColumnNames: ['forest_client_id'],
                    referencedTableName: 'forest_client',
                    // onDelete: 'CASCADE'
                }, */
                {
                    columnNames: ['workflow_state_code'],
                    referencedColumnNames: ['code'],
                    referencedTableName: 'workflow_state_code',
                    // onDelete: 'CASCADE'
                }
            ],
            'public_comment': [
                {
                    columnNames: ['project_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'project',
                    // onDelete: 'CASCADE'
                }
            ],
            'retention_area': [
                {
                    columnNames: ['submission_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'submission',
                    // onDelete: 'CASCADE'
                }
            ],
            'road_section': [
                {
                    columnNames: ['submission_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'submission',
                    // onDelete: 'CASCADE'
                }
            ],
            'submission': [
                {
                    columnNames: ['project_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'project',
                    // onDelete: 'CASCADE'
                },
                {
                    columnNames: ['submission_type_code'],
                    referencedColumnNames: ['code'],
                    referencedTableName: 'submission_type_code',
                    // onDelete: 'CASCADE'
                }
            ]
        }

        Object.keys(foreignKeys).map(async (tableName) => {
            const columns = foreignKeys[tableName];
            console.log(`generating foreign keys for table: ${tableName}`);
            columns.map(async (col) => {
                const name = `fk_${tableName}_${col.columnNames.join('_')}`;
                /* const foreignKey = new TableForeignKey({
                    columnNames: col.columnNames,
                    referencedColumnNames: col.referencedColumnNames,
                    referencedTableName: col.referencedTableName,
                    // onDelete: col.onDelete
                    name: name
                }); */
                console.log(`key ${name} for table: ${tableName}`);

                let fkQuery = `ALTER TABLE ${tableName} ADD CONSTRAINT ${name}`;
                fkQuery += ` FOREIGN KEY (${col.columnNames})`;
                fkQuery += ` REFERENCES ${col.referencedTableName}(${col.referencedColumnNames.join(', ')})`;
                console.log(fkQuery);

                // const result = await queryRunner.createForeignKey(tableName, foreignKey);
                await queryRunner.query(fkQuery);
            });
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop code tables
        dropAttachmentTypeCodeTable(queryRunner);
        dropResponseCodeTable(queryRunner);
        dropSubmissionTypeCodeTable(queryRunner);
        dropWorkflowStateCodeTable(queryRunner);
        // Drop core tables
        dropAttachmentTable(queryRunner);
        dropCutBlockTable(queryRunner);
        dropInteractionTable(queryRunner);
        dropProjectTable(queryRunner);
        dropPublicCommentTable(queryRunner);
        dropRetentionAreaTable(queryRunner);
        dropRoadSectionTable(queryRunner);
        dropSubmissionTable(queryRunner);
    }
}
