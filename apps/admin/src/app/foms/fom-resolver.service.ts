import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
// import * as _ from 'lodash';
// import * as moment from 'moment';
// import { ApplicationService } from 'core/services/application.service';
// import { Application } from 'core/models/application';
// import { Project } from 'core/models/project';
// import { StatusCodes } from 'app/utils/constants/application';
// import { ConstantUtils, CodeType } from 'app/utils/constants/constantUtils';
import {ProjectResponse, ProjectService, SpatialFeaturePublicResponse, SpatialFeatureService} from '@api-client';
import { ConstantUtils } from '../../core/utils/constants/constantUtils';
@Injectable()
export class ApplicationDetailResolver implements Resolve<ProjectResponse> {
  constructor(private projectService: ProjectService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ProjectResponse> {
    const projectId = parseInt(route.paramMap.get(ConstantUtils.PROJECT_ID_PARAM_KEY));

    if (isNaN(projectId)) {
      // create new application
      /* const application = new Application({
        type: route.queryParamMap.get('type'),
        subtype: route.queryParamMap.get('subtype'),
        status: route.queryParamMap.get('status'),
        reason: route.queryParamMap.get('reason'),
        tenureStage: route.queryParamMap.get('tenureStage'),
        location: route.queryParamMap.get('location'),
        businessUnit: route.queryParamMap.get('businessUnit'),
        cl_file: +route.queryParamMap.get('cl_file'), // NB: unary operator
        tantalisID: +route.queryParamMap.get('tantalisID'), // NB: unary operator
        legalDescription: route.queryParamMap.get('legalDescription'),
        client: route.queryParamMap.get('client'),
        statusHistoryEffectiveDate: route.queryParamMap.get('statusHistoryEffectiveDate')
      });

      // 7-digit CL File number for display
      if (application.cl_file) {
        application.meta.clFile = application.cl_file.toString().padStart(7, '0');
        // TODO
        console.log('app resolver: ' + application.cl_file.toString() );
      }

      // derive unique applicants
      if (application.client) {
        const clients = application.client.split(', ');
        application.meta.applicants = _.uniq(clients).join(', ');
      }

      // derive retire date
      if (
        application.statusHistoryEffectiveDate &&
        [
          StatusCodes.DECISION_APPROVED.code,
          StatusCodes.DECISION_NOT_APPROVED.code,
          StatusCodes.ABANDONED.code
        ].includes(ConstantUtils.getCode(CodeType.STATUS, application.status))
      ) {
        application.meta.retireDate = moment(application.statusHistoryEffectiveDate)
          .endOf('day')
          .add(6, 'months')
          .toDate();
        // set flag if retire date is in the past
        application.meta.isRetired = moment(application.meta.retireDate).isBefore();
      }

      return of(project); */
      return this.projectService.projectControllerFindOne(projectId)
    } else {
      // view/edit existing application
      return this.projectService.projectControllerFindOne(projectId);
    }
  }
}

@Injectable()
export class ProjectSpatialDetailResolver implements Resolve<Array<SpatialFeaturePublicResponse>> {
  constructor(private spatialFeatureService: SpatialFeatureService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Array<SpatialFeaturePublicResponse>> {
    const projectId = parseInt(route.paramMap.get(ConstantUtils.PROJECT_ID_PARAM_KEY));
    return this.spatialFeatureService.spatialFeatureControllerGetForProject(projectId);
  }
}