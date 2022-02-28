import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {CommentScopeCode, PublicCommentAdminResponse, ResponseCode} from '@api-client';
import { StateService } from '@admin-core/services/state.service';
import * as _ from 'lodash';
import {CommentDetailForm} from './comment-detail.form';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss'],
  exportAs: 'commentForm'
})
export class CommentDetailComponent {
  commentScopeCodes: _.Dictionary<CommentScopeCode>;
  commentFormGroup: FormGroup;
  comment: PublicCommentAdminResponse;
  responseDetailsLimit: number = 4000;

  @Input() responseCodes: ResponseCode[];
  @Input() canReplyComment: boolean;

  @Input() set selectedComment(comment: PublicCommentAdminResponse) {
    this.comment = comment;
    const commentFormGroup = new CommentDetailForm(comment)
    this.commentFormGroup = this.formBuilder.formGroup(commentFormGroup);
    if (!this.canReplyComment) {
      this.commentFormGroup.disable();
    }
  }

  constructor(private formBuilder: RxFormBuilder, private stateSvc: StateService) {
    this.commentScopeCodes = _.keyBy(this.stateSvc.getCodeTable('commentScopeCode'), 'code');
  }
}
