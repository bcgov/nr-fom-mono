import { MAX_FILEUPLOAD_SIZE } from '@admin-core/utils/constants/constantUtils';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AttachmentResponse, AttachmentService, InteractionResponse } from '@api-client';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { ConfigService } from '@utility/services/config.service';
import { InteractionDetailForm } from './interaction-detail.form';

import { UploadBoxComponent } from '@admin-core/components/file-upload-box/file-upload-box.component';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    standalone: true,
    imports: [
        NgIf, 
        FormsModule, 
        ReactiveFormsModule, 
        NgClass, 
        BsDatepickerModule, 
        DatePipe, 
        UploadBoxComponent
    ],
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

  interactionFormGroup: UntypedFormGroup;
  
  files: any[] = []; // Array type, but only 1 attachment for Interaction.
  maxFileSize: number = MAX_FILEUPLOAD_SIZE.DOCUMENT;
  fileContent: any;
  /*
  * Note: Stakeholder Engagement needs to allow 'application/vnd.ms-outlook' but the library 'ngx-dropzone' is having
  * problem parsing it to the '(MIME) type'. It always returns '' empty string for type internally, resulting invalid type
  * check with error message.
  * To fix this, we allow all extension type at frontend as ['*'] for uploading, and let backend logic to validate the allowed 
  * file type extension.
  */
  supportingFileTypes: string[] = ['*'];
  attachment: AttachmentResponse;
  communicationDetailsLimit: number = 4000;

  constructor(
    private formBuilder: RxFormBuilder,
    private configSvc: ConfigService,
    private attachmentSvc: AttachmentService
  ) { }

  ngOnInit(): void {
    // Blank method is intentional
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
  }
  
  addNewFile(newFiles: any[]) {
    this.files = newFiles;
    if (!this.files || this.files.length == 0) {
      this.interactionFormGroup.get('filename').setValue(null);
    }
    else {
      this.interactionFormGroup.get('filename').setValue(newFiles[0].name);
    }
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


