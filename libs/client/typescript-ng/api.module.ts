import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AttachmentService } from './api/attachment.service';
import { AttachmentTypeCodeService } from './api/attachmentTypeCode.service';
import { AttachmentsService } from './api/attachments.service';
import { CommentScopeCodeService } from './api/commentScopeCode.service';
import { CutBlockService } from './api/cutBlock.service';
import { CutBlocksService } from './api/cutBlocks.service';
import { DefaultService } from './api/default.service';
import { DistrictService } from './api/district.service';
import { ForestClientService } from './api/forestClient.service';
import { ForestStewardshipPlanService } from './api/forestStewardshipPlan.service';
import { ForestStewardshipPlansService } from './api/forestStewardshipPlans.service';
import { FspDistrictXrefService } from './api/fspDistrictXref.service';
import { FspDistrictXrefsService } from './api/fspDistrictXrefs.service';
import { InteractionService } from './api/interaction.service';
import { InteractionsService } from './api/interactions.service';
import { ProjectService } from './api/project.service';
import { ProjectsService } from './api/projects.service';
import { PublicCommentService } from './api/publicComment.service';
import { PublicCommentsService } from './api/publicComments.service';
import { ResponseCodeService } from './api/responseCode.service';
import { RetentionAreaService } from './api/retentionArea.service';
import { RetentionAreasService } from './api/retentionAreas.service';
import { RoadSectionService } from './api/roadSection.service';
import { RoadSectionsService } from './api/roadSections.service';
import { SubmissionService } from './api/submission.service';
import { SubmissionTypeCodeService } from './api/submissionTypeCode.service';
import { SubmissionsService } from './api/submissions.service';
import { UserService } from './api/user.service';
import { WorkflowStateCodeService } from './api/workflowStateCode.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
