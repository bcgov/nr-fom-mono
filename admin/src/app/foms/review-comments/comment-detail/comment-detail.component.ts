import { StateService } from '@admin-core/services/state.service';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentScopeCode, PublicCommentAdminResponse, ResponseCode } from '@api-client';
import { IFormGroup, RxFormBuilder } from '@rxweb/reactive-form-validators';
import * as _ from 'lodash';
import { CommentDetailForm } from './comment-detail.form';

import { NewlinesPipe } from '@admin-core/pipes/newlines.pipe';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
    standalone: true,
    imports: [
        NgIf, 
        FormsModule, 
        ReactiveFormsModule, 
        NgFor, 
        DatePipe, 
        NewlinesPipe
    ],
    selector: 'app-comment-detail',
    templateUrl: './comment-detail.component.html',
    styleUrls: ['./comment-detail.component.scss'],
    exportAs: 'commentForm'
})
export class CommentDetailComponent {
  commentScopeCodes: _.Dictionary<CommentScopeCode>;
  commentFormGroup: IFormGroup<CommentDetailForm>;
  comment: PublicCommentAdminResponse;
  responseDetailsLimit: number = 4000;

  @Input() responseCodes: ResponseCode[];
  @Input() canReplyComment: boolean;

  @Input() set selectedComment(comment: PublicCommentAdminResponse) {
    this.comment = comment;
    const commentFormGroup = new CommentDetailForm(comment)
    this.commentFormGroup = this.formBuilder.formGroup(commentFormGroup) as IFormGroup<CommentDetailForm>;
    if (!this.canReplyComment) {
      this.commentFormGroup.disable();
    }
  }

  constructor(private formBuilder: RxFormBuilder, private stateSvc: StateService) {
    this.commentScopeCodes = _.keyBy(this.stateSvc.getCodeTable('commentScopeCode'), 'code');
  }
}
