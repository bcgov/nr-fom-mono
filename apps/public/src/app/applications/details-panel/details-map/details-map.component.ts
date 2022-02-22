import { Component, OnDestroy, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { GeoJsonObject } from 'geojson';
import { SpatialFeaturePublicResponse, SubmissionTypeCodeEnum } from '@api-client';
import { MapLayers } from '../../app-map/map-layers';
/*
  Leaflet has bug and would show these error on console: 
  http://localhost:4300/public/marker-icon-2x.png 404 (Not Found)
  http://localhost:4300/public/marker-shadow.png 404 (Not Found)

  Add these import(s) to fix them. 
  (ref: https://stackoverflow.com/questions/41144319/leaflet-marker-not-found-production-env: answered by user9547708)
  import "leaflet/dist/images/marker-shadow.png"; 
  import "leaflet/dist/images/marker-icon-2x.png";
*/
import "leaflet/dist/images/marker-shadow.png"; 
import "leaflet/dist/images/marker-icon-2x.png";

@Component({
  selector: 'app-details-map',
  templateUrl: './details-map.component.html',
  styleUrls: ['./details-map.component.scss']
})
export class DetailsMapComponent implements OnChanges, OnDestroy {

  @Input() 
  projectSpatialDetail: SpatialFeaturePublicResponse[];

  public map: L.Map;
  public projectFeatures: L.FeatureGroup; // group of layers for the features of a FOM project.
  private lastLabelMarker: L.Marker; // global variable to keep track latest layer added (as labeling popup for onClick)

  // custom reset view control
  public resetViewControl = L.Control.extend({
    options: {
      position: 'bottomright'
    },
    onAdd: () => {
      const element = L.DomUtil.create('button');

      element.title = 'Reset view';
      element.innerText = 'refresh'; // material icon name
      element.onclick = () => this.fitBounds();
      element.className = 'material-icons map-reset-control';

      // prevent underlying map actions for these events
      L.DomEvent.disableClickPropagation(element); // includes double-click
      L.DomEvent.disableScrollPropagation(element);

      return element;
    }
  });

  constructor(private elementRef: ElementRef) {}

  public ngOnChanges(changes: SimpleChanges) {
    // Note, when Angular first onChange is triggered, the value is undefined.
    if (changes.projectSpatialDetail.currentValue) {
      this.resetMap();
      this.createMap();
    }
  }

  public createMap() {
    this.createBasicMap();
    this.addScale();
    this.addZoomControl();
    this.addResetViewControl();
    this.addFeatures();
    this.fixMap();
  }

  public createBasicMap() {
    this.projectFeatures = L.featureGroup();

    const mapLayers = new MapLayers();    

    this.map = L.map('map', {
      layers: mapLayers.getAllLayers(),
      zoomControl: false, // will be added manually below
      attributionControl: true, 
      scrollWheelZoom: false, // not desired in thumbnail
      doubleClickZoom: false, // not desired in thumbnail
      zoomSnap: 0.1, // for greater granularity when fitting bounds
      zoomDelta: 1, 
      maxZoom: MapLayers.MAX_ZOOM_LEVEL,
      minZoom: 5, // Most of BC on screen
      maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)) // restrict view to "the world"
    });


    mapLayers.addLayerControl(this.map);
    this.map.on('baselayerchange', (e: L.LayersControlEvent) => {
      mapLayers.setActiveBaseLayerName(e.name);
    });

  }

  public addScale() {
    if (this.map) {
      L.control.scale({ position: 'topleft' }).addTo(this.map);
    }
  }

  public addZoomControl() {
    if (this.map) {
      L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    }
  }

  public addResetViewControl() {
    if (this.map) {
      this.map.addControl(new this.resetViewControl());
    }
  }

  public addFeatures() {
    var projectSpatialDetails = this.projectSpatialDetail;
    if (this.map) {
      projectSpatialDetails.forEach(spatialDetail => {
        const layer = L.geoJSON(<GeoJsonObject>spatialDetail['geometry']);
        layer.on('click', L.Util.bind(this.onSpatialFeatureClick, this, spatialDetail));
        this.projectFeatures.addLayer(layer);
        this.map.on('zoomend', () => {
          var style: L.PathOptions = {};
          style.weight = 5; 
          style.fillOpacity = 0.25;
          if (spatialDetail.submissionType.code == SubmissionTypeCodeEnum.Proposed) {
            style.dashArray = '10,10';
          }
          if (spatialDetail.featureType.code == 'road_section') {
            style.color = 'yellow';
            style.opacity = 1;
          }
          if (spatialDetail.featureType.code == 'retention_area') {
            style.color = '#00DD06'; // Needs to be contrast with fill color, otherwise dashed lines won't be seen.
            style.fillColor = '#7CFF87';
          }
          layer.setStyle(style);
        });
      });
      this.map.addLayer(this.projectFeatures);
    }
  }

  private onSpatialFeatureClick(...args: any[]) {
    const spatialDetail = args[0] as SpatialFeaturePublicResponse;

    let label = spatialDetail.featureType.description + " " + spatialDetail.featureId;
    if (spatialDetail.name) { 
      label += " " + spatialDetail.name;
    }
    let markerCoords = spatialDetail.centroid['coordinates'];
    if (spatialDetail.featureType.code == 'road_section') {
      // Use middle of road, so that the label is next to the road 
      // (because the centroid of a curving road can lie far away from the actual road segment)
      const middle = Math.round(spatialDetail.geometry['coordinates'].length / 2);
      markerCoords = spatialDetail.geometry['coordinates'][middle-1];
    }

    // Remove last label first, so it does not stay when next one is added.
    this.projectFeatures.removeLayer(this.lastLabelMarker);

    // Opacity 0 hides marker so just label is visible.
    this.lastLabelMarker = L.marker(L.latLng(markerCoords[1], markerCoords[0]), { opacity: 0 }); 
    // Offset in pixels necessary to align with actual center location (unsure why leaflet has it not aligned by default)
    // See https://gis.stackexchange.com/questions/394960/marker-position-in-leaflet/395270#395270
    this.lastLabelMarker.bindTooltip(label, { permanent: true , offset: [-15, 25]}); 
    this.projectFeatures.addLayer(this.lastLabelMarker);
  }

  // to avoid timing conflict with animations (resulting in small map tile at top left of page),
  // ensure map component is visible in the DOM then update it; otherwise wait a bit and try again
  // ref: https://github.com/Leaflet/Leaflet/issues/4835
  // ref: https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  private fixMap() {
    if (this.elementRef.nativeElement.offsetParent) {
      this.fitBounds();
    } else {
      setTimeout(this.fixMap.bind(this), 50);
    }
  }

  private fitBounds() {
    if (this.map) {
      const bounds = this.projectFeatures.getBounds();
      if (bounds && bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }

  public resetMap() {
    if (this.map) {
      this.map.remove();
    }

    if (this.projectFeatures) {
      this.projectFeatures.remove();
    }
  }

  ngOnDestroy() {
    this.resetMap();
  }
}
