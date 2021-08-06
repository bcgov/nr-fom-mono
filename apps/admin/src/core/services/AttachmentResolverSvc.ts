import {Injectable} from "@angular/core";
import {
  AttachmentService,
  AttachmentResponse,
  WorkflowStateEnum,
} from '@api-client';
import {ConfigService} from "@utility/services/config.service";
import {AttachmentTypeEnum} from "../models/attachmentTypeEnum";

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

  getAttachmentUrl(id: number): string {
    return this.configSvc.getAttachmentUrl(id);
  }

  /*
* Only allows Supporting_Doc to be deleted in the defined states
*/
  public isDeleteAttachmentAllowed(workFlowStateCode: string, attachment: AttachmentResponse) {

    if(attachment.attachmentType.code === AttachmentTypeEnum.SUPPORTING_DOC){
      return workFlowStateCode === WorkflowStateEnum.Initial
        || workFlowStateCode === WorkflowStateEnum.CommentOpen
        || workFlowStateCode === WorkflowStateEnum.CommentClosed
    }
    return false;
  }


}
