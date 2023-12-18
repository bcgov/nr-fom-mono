import { ClientAppIntegrationResponse } from '@api-core/client-app-integration/client-app-integration.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { lastValueFrom, map, tap } from 'rxjs';

/**
 * Use this service to issue requests to the external "Forest Client API" using
 * NestJs HttpService (axios) module.
 * @see class ForestClientApiResponse
 */
@Injectable()
export class ClientAppIntegrationService {
    private readonly API_PREFIX = "/api/clients";
    private static readonly SORT_BY_CLIENT_NUMBER = "clientNumber";

    constructor(
        private readonly http: HttpService, 
        private readonly logger: PinoLogger
    ) {}

    /**
     * This method fetch data by page from external "Forest Client API": "/api/clients/finaAllNonIndividuals".
     * This is pagniated data return with configurable page size.
     * Example: https://nr-forest-client-api-test.api.gov.bc.ca/api/clients/findAllNonIndividuals?page=0&size=10&sortedColumnName=clientNumber
     * @param page is the page number, starting at 0.
     * @param pageSize is each page size (number of record rows).
     * @returns Promise<Array<ClientAppIntegrationResponse>>, empty when no data returns.
     */
    async fetchClientNonIndividuals(
        page: number, 
        pageSize: number, 
        sortedColumnName: string
    ): Promise<Array<ClientAppIntegrationResponse>> {
        const API_PATH = this.API_PREFIX + "/finaAllNonIndividuals";
        const params = {
            page,
            size: pageSize,
            sortedColumnName
        }
        this.logger.info(`Featching ${API_PATH} CLIENT data with params: ${params}`);

        return await lastValueFrom(
             this.http.get(API_PATH, {params})
            .pipe(
                map((res) => res.data),
                tap((clientData) => this.logger.info(`${clientData.length} CLIENT records returned.`)),
                map((clientData) => this.mapClientDetailsResData(clientData))
            )
        );
    }

    /**
     * Mapping api response data ("ClientDetails") to our know DTO:
     * ClientAppIntegrationResponse type.
     * @param data CLIENT response as an array;
     */
    private mapClientDetailsResData(data: Array<any>): Array<ClientAppIntegrationResponse> {
        const mapResult = data.map((resItem) => {
            const record = new ClientAppIntegrationResponse();
            record.forestClientNumber = resItem["clientNumber"];
            record.name = resItem["clientName"];
            record.clientStatusCode = resItem["clientStatusCode"];
            record.clientTypeCode = resItem["clientTypeCode"];
            return record
        });
        return mapResult;
    }
}
