import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ProjectResponse, ProjectService, SpatialFeaturePublicResponse, SpatialFeatureService} from '@api-client';
import { ConstantUtils } from '../../core/utils/constants/constantUtils';
@Injectable()
export class ApplicationDetailResolver implements Resolve<ProjectResponse> {
  constructor(private projectService: ProjectService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ProjectResponse> {
    const projectId = parseInt(route.paramMap.get(ConstantUtils.PROJECT_ID_PARAM_KEY));

    if (isNaN(projectId)) {
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