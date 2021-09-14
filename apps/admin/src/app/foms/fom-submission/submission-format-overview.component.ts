import { Component } from '@angular/core';

@Component({
  selector: 'app-submission-format-overview',
  templateUrl: './submission-format-overview.component.html',
  styleUrls: ['./submission-format-overview.component.scss']
})
export class SubmissionFormatOverviewComponent {

  readonly cutblokJSONpretty: string = `
  {
    "type": "FeatureCollection",
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:3005"
      }
    },
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                1474614.5923999995,
                555392.2415999994
              ],
              [
                1474537.8630999997,
                555275.8246999998
              ],
              [
                1474588.1340999994,
                555146.1786000002
              ],
              [
                1474723.071799999,
                555080.0326000005
              ],
              [
                1474818.3220000006,
                555138.2411000002
              ],
              [
                1474902.9889000002,
                555220.2620999999
              ],
              [
                1474818.3220000006,
                555334.0330999997
              ],
              [
                1474701.9050999992,
                555437.2207999993
              ],
              [
                1474614.5923999995,
                555392.2415999994
              ]
            ]
          ]
        },
        "properties": {
          "DEVELOPMENT_DATE": "2022-03-30",
          "NAME": "Nature's valley"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                1474614.5923999995,
                555392.2415999994
              ],
              [
                1474537.8630999997,
                555275.8246999998
              ],
              [
                1474588.1340999994,
                555146.1786000002
              ],
              [
                1474723.071799999,
                555080.0326000005
              ],
              [
                1474818.3220000006,
                555138.2411000002
              ],
              [
                1474902.9889000002,
                555220.2620999999
              ],
              [
                1474818.3220000006,
                555334.0330999997
              ],
              [
                1474701.9050999992,
                555437.2207999993
              ],
              [
                1474614.5923999995,
                555392.2415999994
              ]
            ]
          ]
        },
        "properties": {
          "DEVELOPMENT_DATE": "2022-03-31"
        }
      }
    ]
  }`;

  readonly wtraJSONpretty: string = `
  {
    "type": "FeatureCollection",
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:3005"
      }
    },
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                1474782.182,
                555366.0662999991
              ],
              [
                1474701.9050999992,
                555437.2207999993
              ],
              [
                1474651.1418999992,
                555411.0701000001
              ],
              [
                1474667.5091999993,
                555386.9498999994
              ],
              [
                1474760.1136000007,
                555331.3872999996
              ],
              [
                1474782.182,
                555366.0662999991
              ]
            ]
          ]
        },
        "properties": {}
      }
    ]
  }`;

  readonly roadJSONpretty: string = `
  {
    "type": "FeatureCollection",
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:3005"
      }
    },
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              1473871.1118,
              555638.3046000004
            ],
            [
              1474085.4246999994,
              555524.5335000008
            ],
            [
              1474315.6127000004,
              555445.1583999991
            ],
            [
              1474426.7379,
              555341.9706999995
            ],
            [
              1474543.9969999995,
              555285.1313000005
            ],
            [
              1474648.9882999994,
              555283.7621999998
            ],
            [
              1474775.9886000007,
              555259.9496999998
            ],
            [
              1474940.0306000002,
              555143.5328000002
            ]
          ]
        },
        "properties": {
          "DEVELOPMENT_DATE": "2022-03-30"
        }
      }
    ]
  }`;

}
