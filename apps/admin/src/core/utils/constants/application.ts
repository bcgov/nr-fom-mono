import {ICodeGroup, ICodeSet} from './interfaces';

/**
 * Application Status codes.
 *
 * Note: the code only exists in ACRFD, while the mapped codes are the actual Tantalis status codes and should be used
 *       when making calls to the Tantalis API.
 *
 *
 * @export
 * @class StatusCodes
 * @implements {ICodeSet}
 */
export class StatusCodes implements ICodeSet {
  public static readonly ABANDONED: ICodeGroup = {
    code: 'ABANDONED',
    param: 'AB',
    text: {long: 'Abandoned', short: 'Abandoned'},
    mappedCodes: [
      'ABANDONED', // may not be an actual status
      'CANCELLED',
      'OFFER NOT ACCEPTED',
      'OFFER RESCINDED',
      'RETURNED',
      'REVERTED',
      'SOLD',
      'SUSPENDED',
      'WITHDRAWN'
    ]
  };

  public static readonly APPLICATION_UNDER_REVIEW: ICodeGroup = {
    code: 'APPLICATION UNDER REVIEW',
    param: 'AUR',
    text: {long: 'Finalized', short: 'Under Review'},
    mappedCodes: ['ACCEPTED', 'ALLOWED', 'PENDING', 'RECEIVED']
  };

  public static readonly APPLICATION_REVIEW_COMPLETE: ICodeGroup = {
    code: 'APPLICATION REVIEW COMPLETE',
    param: 'ARC',
    text: {long: 'Application Review Complete - Decision Pending', short: 'Decision Pending'},
    mappedCodes: ['OFFER ACCEPTED', 'OFFERED']
  };

  public static readonly DECISION_APPROVED: ICodeGroup = {
    code: 'DECISION APPROVED',
    param: 'DA',
    text: {long: 'Decision: Approved - Tenure Issued', short: 'Approved'},
    mappedCodes: ['ACTIVE', 'COMPLETED', 'DISPOSITION IN GOOD STANDING', 'EXPIRED', 'HISTORIC']
  };

  public static readonly DECISION_NOT_APPROVED: ICodeGroup = {
    code: 'DECISION NOT APPROVED',
    param: 'DNA',
    text: {long: 'Initial', short: 'Initial'},
    mappedCodes: ['DISALLOWED']
  };

  public static readonly UNKNOWN: ICodeGroup = {
    code: 'UNKNOWN',
    param: 'UN',
    text: {long: 'Unknown Status', short: 'Unknown'},
    mappedCodes: ['NOT USED', 'PRE-TANTALIS']
  };

  /**
   * @inheritdoc
   * @memberof StatusCodes
   */
  public getCodeGroups = () => [
    StatusCodes.ABANDONED,
    StatusCodes.APPLICATION_UNDER_REVIEW,
    StatusCodes.APPLICATION_REVIEW_COMPLETE,
    StatusCodes.DECISION_APPROVED,
    StatusCodes.DECISION_NOT_APPROVED,
    StatusCodes.UNKNOWN
  ];
}

/**
 * Application Reason codes.
 *
 * Note:
 *  - the code is the actual Tantalis reason code.
 *  - the reason code indicates additional information about the status code.
 *  - the reason codes don't have unique text, instead they use the same text as their Status
 *    counterpart: (Decision_Approved and Decision_Not_Approved).
 *
 * @export
 * @class ReasonCodes
 * @implements {ICodeSet}
 */
export class ReasonCodes implements ICodeSet {
  public static readonly AMENDMENT_APPROVED: ICodeGroup = {
    code: 'AMENDMENT APPROVED - APPLICATION',
    param: 'AA',
    text: {long: 'Decision: Approved - Tenure Issued', short: 'Approved'},
    mappedCodes: []
  };

  public static readonly AMENDMENT_NOT_APPROVED: ICodeGroup = {
    code: 'AMENDMENT NOT APPROVED - APPLICATION',
    param: 'ANA',
    text: {long: 'Decision: Not Approved', short: 'Not Approved'},
    mappedCodes: []
  };

  /**
   * @inheritdoc
   * @memberof ReasonCodes
   */
  public getCodeGroups = () => [ReasonCodes.AMENDMENT_APPROVED, ReasonCodes.AMENDMENT_NOT_APPROVED];
}

/**
 * Application Region codes.
 *
 * Note: the code is the actual Tantalis businessUnit code.
 *
 * @export
 * @class RegionCodes
 * @implements {ICodeSet}
 */
export class RegionCodes implements ICodeSet {
  public static readonly CARIBOO: ICodeGroup = {
    code: 'CA - LAND MGMNT - CARIBOO FIELD OFFICE',
    param: 'CA',
    text: {long: 'Chilliwack', short: 'Chilliwack'},
    mappedCodes: []
  };

  public static readonly KOOTENAY: ICodeGroup = {
    code: 'KO - LAND MGMNT - KOOTENAY FIELD OFFICE',
    param: 'KO',
    text: {long: 'Prince George', short: 'Prince George'},
    mappedCodes: []
  };

  public static readonly LOWER_MAINLAND: ICodeGroup = {
    code: 'LM - LAND MGMNT - LOWER MAINLAND SERVICE REGION',
    param: 'LM',
    text: {long: 'Kitimat-Stikine', short: 'Kitimat-Stikine'},
    mappedCodes: []
  };

  public static readonly OMENICA: ICodeGroup = {
    code: 'OM - LAND MGMNT - NORTHERN SERVICE REGION',
    param: 'OM',
    text: {long: 'Salmon Arm', short: 'Salmon Arm'},
    mappedCodes: []
  };

  public static readonly PEACE: ICodeGroup = {
    code: 'PE - LAND MGMNT - PEACE FIELD OFFICE',
    param: 'PE',
    text: {long: 'Peace, Ft. St. John', short: 'Peace, Ft. St. John'},
    mappedCodes: []
  };

  public static readonly SKEENA: ICodeGroup = {
    code: 'SK - LAND MGMNT - SKEENA FIELD OFFICE',
    param: 'SK',
    text: {long: 'Skeena, Smithers', short: 'Skeena, Smithers'},
    mappedCodes: []
  };

  public static readonly SOUTHERN_INTERIOR: ICodeGroup = {
    code: 'SI - LAND MGMNT - SOUTHERN SERVICE REGION',
    param: 'SI',
    text: {long: 'Thompson Okanagan, Kamloops', short: 'Thompson Okanagan, Kamloops'},
    mappedCodes: []
  };

  public static readonly VANCOUVER_ISLAND: ICodeGroup = {
    code: 'VI - LAND MGMNT - VANCOUVER ISLAND SERVICE REGION',
    param: 'VI',
    text: {long: 'West Coast, Nanaimo', short: 'West Coast, Nanaimo'},
    mappedCodes: []
  };

  /**
   * @inheritdoc
   * @memberof RegionCodes
   */
  public getCodeGroups = () => [
    RegionCodes.CARIBOO,
    RegionCodes.KOOTENAY,
    RegionCodes.LOWER_MAINLAND,
    RegionCodes.OMENICA,
    RegionCodes.PEACE,
    RegionCodes.SKEENA,
    RegionCodes.SOUTHERN_INTERIOR,
    RegionCodes.VANCOUVER_ISLAND
  ];
}


/**
 * Application Land Use Type codes.
 *
 * Note: these codes are currently not used in ACRFD.
 *
 * @export
 * @class LandUseTypeCodes
 * @implements {ICodeSet}
 */
export class LandUseTypeCodes implements ICodeSet {
  public static readonly 'CERTIFICATE OF PURCHASE': ICodeGroup = {
    code: 'CERTIFICATE OF PURCHASE',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['DIRECT SALE', 'FROM LEASE-PURCHASE OPTION', 'PRE-TANTALIS CERTIFICATE OF PURCHASE', 'TEMPORARY CODE']
  };

  public static readonly 'CROWN GRANT': ICodeGroup = {
    code: 'CROWN GRANT',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: [
      'DIRECT SALE',
      'FREE CROWN GRANT',
      'FROM LEASE-PURCHASE OPTION',
      'HISTORIC',
      'HISTORIC CROWN GRANT',
      'LAND EXCHANGE',
      'PRE-EMPTION',
      'PRE-TANTALIS CROWN GRANT',
      'TEMPORARY CODE'
    ]
  };

  public static readonly 'DEVELOPMENT AGREEMENT': ICodeGroup = {
    code: 'DEVELOPMENT AGREEMENT',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['ALPINE SKI DEVELOPMENT', 'PRE-TANTALIS DEVELOPMENTAL AGREEMENT']
  };

  public static readonly 'DOMINION PATENTS': ICodeGroup = {
    code: 'DOMINION PATENTS',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['PRE-TANTALIS DOMINION PATENTS']
  };

  public static readonly INCLUSION: ICodeGroup = {
    code: 'INCLUSION',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: [
      'ACCESS',
      'AGREEMENT',
      'INCLUSION',
      'LAND TITLE ACT ACCRETION',
      'LAND TITLE ACT BOUNDARY ADJUSTMENT',
      'PRE-TANTALIS INCLUSION'
    ]
  };

  public static readonly INVENTORY: ICodeGroup = {
    code: 'INVENTORY',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['BCAL INVENTORY']
  };

  public static readonly LEASE: ICodeGroup = {
    code: 'LEASE',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['HEAD LEASE', 'LEASE - PURCHASE OPTION', 'PRE-TANTALIS LEASE', 'STANDARD LEASE']
  };

  public static readonly LICENCE: ICodeGroup = {
    code: 'LICENCE',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['LICENCE OF OCCUPATION', 'PRE-TANTALIS LICENCE']
  };

  public static readonly 'OIC ECOLOGICAL RESERVE ACT': ICodeGroup = {
    code: 'OIC ECOLOGICAL RESERVE ACT',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['OIC ECOLOGICAL RESERVES', 'PRE-TANTALIS OIC ECO RESERVE']
  };

  public static readonly PERMIT: ICodeGroup = {
    code: 'PERMIT',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: [
      'INVESTIGATIVE PERMIT',
      'PRE-TANTALIS PERMIT',
      'ROADS & BRIDGES',
      'TEMPORARY CODE',
      'TEMPORARY PERMIT'
    ]
  };

  public static readonly 'PRE-TANTALIS': ICodeGroup = {
    code: 'PRE-TANTALIS',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['PRE-TANTALIS']
  };

  public static readonly 'PROVINCIAL PARK': ICodeGroup = {
    code: 'PROVINCIAL PARK',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['PARKS', 'PRE-TANTALIS PARKS', 'PRE-TANTALIS PARKS (00 ON TAS/CLR)']
  };

  public static readonly 'RESERVE/NOTATION': ICodeGroup = {
    code: 'RESERVE/NOTATION',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: [
      'DESIGNATED USE AREA',
      'MAP RESERVE',
      'NOTATION OF INTEREST',
      'OIC RESERVE',
      'PRE-TANTALIS RESERVE/NOTATION',
      'PROHIBITED USE AREA',
      'TEMPORARY CODE'
    ]
  };

  public static readonly 'REVENUE SHARING AGREEMENT': ICodeGroup = {
    code: 'REVENUE SHARING AGREEMENT',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['REVENUE SHARING AGREEMENT']
  };

  public static readonly 'RIGHT-OF-WAY': ICodeGroup = {
    code: 'RIGHT-OF-WAY',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: ['INTERIM LICENCE', 'STATUTORY RIGHT OF WAY OR EASEMENT', 'PRE-TANTALIS RIGHT-OF-WAY']
  };

  public static readonly 'TRANSFER OF ADMINISTRATION/CONTROL': ICodeGroup = {
    code: 'TRANSFER OF ADMINISTRATION/CONTROL',
    param: '',
    text: {long: '', short: ''},
    mappedCodes: [
      'FED TRANSFER OF ADMIN, CONTROL & BEN',
      'PRE-TANTALIS TRANSFER OF ADMIN/CONT',
      'PROVINCIAL TRANSFER OF ADMIN'
    ]
  };

  /**
   * @inheritdoc
   * @memberof LandUseTypeCodes
   */
  public getCodeGroups = () => [
    LandUseTypeCodes['CERTIFICATE OF PURCHASE'],
    LandUseTypeCodes['CROWN GRANT'],
    LandUseTypeCodes['DEVELOPMENT AGREEMENT'],
    LandUseTypeCodes['DOMINION PATENTS'],
    LandUseTypeCodes.INCLUSION,
    LandUseTypeCodes.INVENTORY,
    LandUseTypeCodes.LEASE,
    LandUseTypeCodes.LICENCE,
    LandUseTypeCodes['OIC ECOLOGICAL RESERVE ACT'],
    LandUseTypeCodes.PERMIT,
    LandUseTypeCodes['PRE-TANTALIS'],
    LandUseTypeCodes['PROVINCIAL PARK'],
    LandUseTypeCodes['RESERVE/NOTATION'],
    LandUseTypeCodes['REVENUE SHARING AGREEMENT'],
    LandUseTypeCodes['RIGHT-OF-WAY'],
    LandUseTypeCodes['TRANSFER OF ADMINISTRATION/CONTROL']
  ];
}
