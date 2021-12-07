import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCommentingClosedDateChangeRequest, ProjectService } from '@api-client';
import moment = require('moment');
import { Router } from '@angular/router';

@Component({
  templateUrl: './enddate-change-modal.component.html',
  styleUrls: ['./enddate-change-modal.component.scss']
})
export class EnddateChangeModalComponent implements OnInit, AfterViewInit {

  public updating = false;
  // gets default values assigned when modal compoent was called outside.
  public changeRequest = {} as ProjectCommentingClosedDateChangeRequest;
  public projectId: number;
  public currentCommentingClosedDate: string;
  public newCommentingClosedDate: Date;
  public minDate: Date;

  @ViewChild("cancelBtn")
  cancelBtn: ElementRef;

  constructor(
    private router: Router,
    private activeModal: NgbActiveModal,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.minDate = moment().add(1, 'days').toDate(); // Earliest date allowed for change: tomorrow.
    this.newCommentingClosedDate = this.minDate;
  }

  ngAfterViewInit() {
    this.cancelBtn.nativeElement.focus();
  }

  public changeEndDate() {
    this.updating = true;

    this.changeRequest.commentingClosedDate = moment(this.newCommentingClosedDate).format('YYYY-MM-DD');
    this.projectService.projectControllerCommentingClosedDateChange(this.projectId, this.changeRequest)
        .toPromise()
        .then(() => {
          this.updating = false;
          this.router.navigate([`a/${this.projectId}`]);
          this.dismiss('Commenting End Date updated successfully.');
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
