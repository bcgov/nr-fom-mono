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
    "crs": { "type": "name", "properties": { "name": "EPSG:3005" } },
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [ [ 
            [1474614.5923999995, 555392.24159999937],
            [1474537.8630999997, 555275.82469999976],
            [1474588.1340999994, 555146.17860000022],
            [1474723.0717999991, 555080.0326000005],
            [1474818.3220000006, 555138.24110000022],
            [1474902.9889000002, 555220.26209999993],
            [1474818.3220000006, 555334.03309999965],
            [1474701.9050999992, 555437.22079999931],
            [1474614.5923999995, 555392.24159999937]
          ] ]
        },
        "properties": {
          "DEV_DATE": "2022-03-30",
          "NAME": "Nature's valley"
        }
      },
      { 
        "type": "Feature", 
        "geometry": { 
          "type": "Polygon", 
          "coordinates": [ [ 
            [1474614.5923999995, 555392.24159999937],
            [1474537.8630999997, 555275.82469999976],
            [1474588.1340999994, 555146.17860000022],
            [1474723.0717999991, 555080.0326000005],
            [1474818.3220000006, 555138.24110000022],
            [1474902.9889000002, 555220.26209999993],
            [1474818.3220000006, 555334.03309999965],
            [1474701.9050999992, 555437.22079999931],
            [1474614.5923999995, 555392.24159999937]
          ] ] 
        }, 
        "properties": {
          "DEV_DATE": "2022-03-31"
        } 
      }
    ]
  }
  `;

  readonly wtraJSONpretty: string = `
  {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "EPSG:3005" } },
    "features": [
      { 
        "type": "Feature", 
        "geometry": { 
          "type": "Polygon", 
          "coordinates": [ [
            [1474782.182, 555366.06629999913],
            [1474701.9050999992, 555437.22079999931],
            [1474651.1418999992, 555411.07010000013],
            [1474667.5091999993, 555386.94989999942],
            [1474760.1136000007, 555331.38729999959],
            [1474782.182, 555366.06629999913]
          ] ]
        }, 
        "properties": {
        }
      }
    ]
  }
  `;

  readonly roadJSONpretty: string = `
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              -126.786352462,
              53.365359508
            ],
            [
              -126.786519787,
              53.374321183
            ],
            [
              -126.775181383,
              53.372154906
            ]
          ]
        },
        "properties": {
          "DEV_DATE": "2022-03-30"
        }
      }
    ]
  }`;

}
