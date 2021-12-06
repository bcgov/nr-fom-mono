import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCommentingClosedDateChangeRequest } from '@api-client';

@Component({
  templateUrl: './enddate-change-modal.component.html',
  styleUrls: ['./enddate-change-modal.component.scss']
})
export class EnddateChangeModalComponent implements OnInit {

  public updating = false;
  // gets default values assigned when modal compoent was called outside.
  public changeRequest = {} as ProjectCommentingClosedDateChangeRequest;
  public projectId: number;
  public updatedCommentingClosedDate: string;

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.updatedCommentingClosedDate = this.changeRequest.commentingClosedDate;
  }

  public dismiss(reason: string) {
    this.activeModal.dismiss(reason);
  }

}
