import { AttachmentTypeEnum } from "@admin-core/models/attachmentTypeEnum";
import {Injectable} from "@angular/core";
import {
  AttachmentService,
  AttachmentResponse,
  WorkflowStateEnum,
} from '@api-client';
import {ConfigService} from "@utility/services/config.service";
import { saveAs } from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class AttachmentResolverSvc {

  constructor(
    public attachmentService: AttachmentService,
    private configSvc: ConfigService

  ) {  }

  public async getAttachments(projectId: number): Promise<AttachmentResponse[]> {
      return this.attachmentService.attachmentControllerFind(projectId).toPromise()
  }

  public async attachmentControllerRemove(attachmentId: number): Promise<any> {
    return this.attachmentService.attachmentControllerRemove(attachmentId).toPromise();
  }

  public async getFileContents(fileId: number, filename: string): Promise<void> {
    this.attachmentService.attachmentControllerGetFileContents(fileId)
        .subscribe((res) => {
            console.log("res: ", res)
            const data: Blob = new Blob([res], {
                type: res.type
              });
              saveAs(data, filename);
        });
  }

  getAttachmentUrl(id: number): string {
    return this.configSvc.getAttachmentUrl(id);
  }

  /**
   * For public notice: only allow deleting when state = Initial.
   * For supporting document: allow deleting when state = Initial, Commenting Open, Commenting Closed.
   */
  public isDeleteAttachmentAllowed(attachmentTypeCode: string, workFlowStateCode: string) {
      return workFlowStateCode === WorkflowStateEnum.Initial ||
            ((workFlowStateCode === WorkflowStateEnum.CommentOpen || workFlowStateCode === WorkflowStateEnum.CommentClosed) && 
            attachmentTypeCode === AttachmentTypeEnum.SUPPORTING_DOC)
  }

}
