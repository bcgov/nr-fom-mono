import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCommentingClosedDateChangeRequest, ProjectService } from '@api-client';
import moment = require('moment');

declare var $: any;

@Component({
  templateUrl: './enddate-change-modal.component.html',
  styleUrls: ['./enddate-change-modal.component.scss'],
  encapsulation: ViewEncapsulation.None // Important to make bootstrap modal custom styling property 'windowClass' work.
})
export class EnddateChangeModalComponent implements OnInit {

  public updating = false;
  public changeRequest = {} as ProjectCommentingClosedDateChangeRequest; // Default values assigned when modal compoent was opened outside.
  public projectId: number;
  public currentCommentingClosedDate: string;
  public newCommentingClosedDate: Date;
  public minDate: Date;

  constructor(
    private activeModal: NgbActiveModal,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.minDate = moment().add(1, 'days').toDate(); // Earliest date allowed for change: tomorrow.
    this.newCommentingClosedDate = this.minDate;

    // making modal dragable. Ref: https://www.freakyjolly.com/angular-7-8-9-draggable-bootstrap-modals-in-2-steps-tutorial-by-example/
    $(document).ready(function () {
      let modalContent: any = $('.modal-content');
      modalContent.draggable({
        handle: '.modal-header',
        revert: true,
        revertDuration: 300
      });
    });

  }

  public changeEndDate() {
    this.updating = true;

    this.changeRequest.commentingClosedDate = moment(this.newCommentingClosedDate).format('YYYY-MM-DD');
    this.projectService.projectControllerCommentingClosedDateChange(this.projectId, this.changeRequest)
        .toPromise()
        .then(() => {
          this.updating = false;
          // Close and pass message {reason, projectUpdated}
          this.activeModal.close({reason: 'Commenting End Date updated successfully.', projectUpdated: true});
        })
        .catch((err) => {
          console.error(err)
          this.updating = false;
          this.dismiss('Commenting End Date updated failed.');
        });
  }

  public dismiss(reason: string) {
    this.activeModal.dismiss(reason);
  }

}
