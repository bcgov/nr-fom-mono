import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientAppIntegrationResponse } from '@src/core/client-app-integration/client-app-integration.dto';
import { AxiosResponse } from 'axios';
import { PinoLogger } from 'nestjs-pino';
import { of } from 'rxjs';
import { ClientAppIntegrationService } from './client-app-integration.service';

describe('ClientAppIntegrationService', () => {
  let service: ClientAppIntegrationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: provideDependencyMock()
    }).compile();

    service = module.get<ClientAppIntegrationService>(ClientAppIntegrationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchClientNonIndividuals', () => {
    const sampleParams = {"page": 1, "size": 1000, "sortedColumnName": "clientNumber"};
    beforeEach(async () => {
        jest.resetAllMocks();
    });

    it('Should call http service with mapped return.', async () => {
      const httpGetSpy = jest.spyOn(httpService, 'get');
      httpGetSpy.mockReturnValue(of<AxiosResponse>(sampleAxiosResponse));
      const expectMappedResult = sampleAxiosResponse.data.map((item: any)=> {
        const mapped = new ClientAppIntegrationResponse();
        mapped.id = item.clientNumber;
        mapped.name = item.clientName;
        mapped.clientStatusCode = item.clientStatusCode;
        mapped.clientTypeCode = item.clientTypeCode;
        return mapped;
      })
      const result = await service.fetchClientNonIndividuals(sampleParams.page, sampleParams.size, sampleParams.sortedColumnName);
      expect(httpGetSpy).toHaveBeenCalled();
      expect(httpGetSpy).toHaveBeenCalledWith(expect.stringContaining("/findAllNonIndividuals"), { params: sampleParams });
      expect(expectMappedResult).toMatchObject<ClientAppIntegrationResponse[]>(result);
    })

    it('Should return empty when CLIENT api returns empty data.', async () => {
        const httpGetSpy = jest.spyOn(httpService, 'get');
        httpGetSpy.mockReturnValue(of<AxiosResponse>(Object.assign({}, {...sampleAxiosResponse}, {data: []})))
        const result = await service.fetchClientNonIndividuals(sampleParams.page, sampleParams.size, sampleParams.sortedColumnName);
        expect(httpGetSpy).toHaveBeenCalled();
        expect([]).toMatchObject<ClientAppIntegrationResponse[]>(result);
    });

    it('Should return empty when CLIENT api returns undefined data.', async () => {
        const httpGetSpy = jest.spyOn(httpService, 'get');
        httpGetSpy.mockReturnValue(of<AxiosResponse>(Object.assign({}, {...sampleAxiosResponse}, {data: undefined})))
        const result = await service.fetchClientNonIndividuals(sampleParams.page, sampleParams.size, sampleParams.sortedColumnName);
        expect(httpGetSpy).toHaveBeenCalled();
        expect([]).toMatchObject<ClientAppIntegrationResponse[]>(result);
    });
  });

});

function provideDependencyMock(): Array<any> {
    const dependencyMock = [
      {
        provide: HttpService,
        useValue: {
          get: jest.fn()
        }
      },
      {
        provide: PinoLogger,
        useValue: {
          info: jest.fn((x) => x),
          setContext: jest.fn((x) => x),
        }
      },
      ClientAppIntegrationService
    ]
    return dependencyMock;
}

const sampleAxiosResponse: AxiosResponse = {
    data: [
        {
          clientNumber: '00000001',
          clientName: 'MANAGEMENT ABEYANCE',
          clientStatusCode: 'ACT',
          clientTypeCode: 'C'
        },
        {
          clientNumber: '00000002',
          clientName: 'PENDING S & R BILLING',
          clientStatusCode: 'DAC',
          clientTypeCode: 'G'
        }],
    status: 200,
    statusText: 'OK',
    config: {
        headers: undefined
    },
    headers: {},
};

