import { Component } from '@angular/core';

@Component({
  selector: 'app-submission-format-overview',
  templateUrl: './submission-format-overview.component.html',
  styleUrls: ['./submission-format-overview.component.scss']
})
export class SubmissionFormatOverviewComponent {

  readonly cutblokJSONpretty: string = `{
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
}
