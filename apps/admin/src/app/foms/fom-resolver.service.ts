import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ProjectMetricsResponse, ProjectResponse, ProjectService, SpatialFeaturePublicResponse, SpatialFeatureService} from '@api-client';
import { ConstantUtils } from '../../core/utils/constants/constantUtils';
@Injectable()
export class ProjectDetailResolver implements Resolve<ProjectResponse> {
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
export class ProjectMetricsDetailResolver implements Resolve<ProjectMetricsResponse> {
  constructor(private projectService: ProjectService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ProjectMetricsResponse> {
    const projectId = parseInt(route.paramMap.get(ConstantUtils.PROJECT_ID_PARAM_KEY));
    return this.projectService.projectControllerFindProjectMetrics(projectId);
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