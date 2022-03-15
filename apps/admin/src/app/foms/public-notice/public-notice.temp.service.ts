import { Injectable } from "@angular/core";

// TODO: This is temporary service. Remove this later when backend is ready.
@Injectable({
  providedIn: 'root'
})
export class PublicNoticeService {

  private mockData = {
      id: 135,
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      sameAsReviewInd: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
      commentingOpen: 'January 1, 2022',
      fomHolder: 'Lumber Co. Ltd.',
      projectId: 100007,
      fomSummary: 'Sunny Ridge Logging',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    };

  getMockData(projectId: number) {
    if (projectId) {
      this.mockData.projectId = projectId;
    }
    return this.mockData;
  }

  setMockData(newData: any) {
    this.mockData = newData;
  }
}
