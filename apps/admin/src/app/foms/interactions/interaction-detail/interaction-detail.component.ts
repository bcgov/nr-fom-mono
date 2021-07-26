import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { AttachmentResponse, AttachmentService, InteractionResponse } from '@api-client';
import { ConfigService } from '@utility/services/config.service';
import { InteractionDetailForm } from './interaction-detail.form';

@Component({
  selector: 'app-interaction-detail',
  templateUrl: './interaction-detail.component.html',
  styleUrls: ['./interaction-detail.component.scss'],
  exportAs: 'interactionForm'
})
export class InteractionDetailComponent implements OnInit {

  today = new Date();
  maxDate = this.today;
  interaction: InteractionResponse;
  @Input()
  editMode: boolean;
  interactionFormGroup: FormGroup;
  files: any[] = []; // Array type, but only 1 attachment for Interaction.
  fileContent: any;
  supportingFileTypes: string[] =
    ['application/pdf', 'image/jpg', 'image/jpeg', 'text/csv', 'image/png', 'text/plain',
     'application/rtf', 'image/tiff', 'application/msword',
     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
     'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  attachment: AttachmentResponse;

  constructor(
    private formBuilder: RxFormBuilder,
    private configSvc: ConfigService,
    private attachmentSvc: AttachmentService
  ) { }

  ngOnInit(): void {
  }

  @Input() set selectedInteraction(interaction: InteractionResponse) {
    this.interaction = interaction;
    const interactionForm = new InteractionDetailForm(interaction)
    this.interactionFormGroup = this.formBuilder.formGroup(interactionForm);
    if (!this.editMode) {
      this.interactionFormGroup.disable();
    }
    
    this.interaction.attachmentId? this.retrieveAttachment(this.interaction.attachmentId)
                                 : this.attachment = null;
  };
  
  addNewFile(newFiles: any[]) {
    this.files = newFiles;
    this.interactionFormGroup.get('filename').setValue(newFiles[0].name);
  }

  getFileContent(fileContent: any) {
    this.fileContent = fileContent;
    // Convert to proper Blob type for adding attachment to FormData.
    const fileContentAsBlob = new Blob([this.fileContent], {type: this.files[0].type});
    this.interactionFormGroup.get('fileContent').setValue(fileContentAsBlob);
  }

  private async retrieveAttachment(attachmentId: number) {
    this.attachment = await this.attachmentSvc
                      .attachmentControllerFindOne(attachmentId).toPromise();
  }

  getAttachmentUrl(id: number): string {
    return this.configSvc.getAttachmentUrl(id);
  }

  isValid(controlName: string): boolean {
    return this.interactionFormGroup.controls[controlName]?.errors == null;
  }

}


