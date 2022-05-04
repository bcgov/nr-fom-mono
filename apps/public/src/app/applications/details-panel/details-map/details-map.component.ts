import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SpatialFeaturePublicResponse, SubmissionTypeCodeEnum } from '@api-client';
import { FeatureSelectService } from '@public-core/services/featureSelect.service';
import { MapLayersService, OverlayAction } from '@public-core/services/mapLayers.service';
import { GeoJsonObject } from 'geojson';
import * as L from 'leaflet';
import "leaflet/dist/images/marker-icon-2x.png";
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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MapLayers } from '../../app-map/map-layers';

@Component({
  selector: 'app-details-map',
  templateUrl: './details-map.component.html',
  styleUrls: ['./details-map.component.scss']
})
export class DetailsMapComponent implements OnInit, OnChanges, OnDestroy {

  @Input() 
  projectSpatialDetail: SpatialFeaturePublicResponse[];

  public map: L.Map;
  public projectFeatures: L.FeatureGroup; // group of layers for the features of a FOM project.
  private lastLabelMarker: L.Marker; // global variable to keep track latest layer added (as labeling popup for onClick)
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private mapLayers: MapLayers = new MapLayers();

  // Key for the map is: (spatialDetail.featureId + '-' + spatialDetail.featureType.code) so it is unique.
  private indexedFeatureLayers = new Map();

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

  constructor(
    private elementRef: ElementRef,
    private mapLayersService: MapLayersService,
    private fss: FeatureSelectService
  ) { }

  ngOnInit(): void {
    this.subscribeToMapLayersChange();
    this.subscribeToFeatureSelectChange();
  }

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
    this.map = L.map('map', {
      layers: this.mapLayers.getAllLayers(),
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

    this.mapLayers.addLayerControl(this.map);
    this.map.on('baselayerchange', (e: L.LayersControlEvent) => {
      if (e.name != this.mapLayers.getActiveBaseLayerName()) {
        this.mapLayers.setActiveBaseLayerName(e.name);
        this.mapLayersService.notifyLayersChange({baseLayer: e.name});
      }
    });
    this.map.on('overlayadd', (e: L.LayersControlEvent) => {
      this.mapLayersService.notifyLayersChange({overlay: {action: OverlayAction.Add, layerName: e.name}});
    });
    this.map.on('overlayremove', (e: L.LayersControlEvent) => {
      this.mapLayersService.notifyLayersChange({overlay: {action: OverlayAction.Remove, layerName: e.name}});
    });

    // Initialize current app-map layers state (for the first time when this component map is shown)
    this.mapLayersService.applyCurrentMapLayers(this.map, this.mapLayers);
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

        this.indexedFeatureLayers.set((spatialDetail.featureId + '-' +spatialDetail.featureType.code), {
          layer: layer,
          detail: spatialDetail
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

    // Remove last label first, so it does not stay when next one is added.
    this.projectFeatures.removeLayer(this.lastLabelMarker);

    // Opacity 0 hides marker so just label is visible.
    this.lastLabelMarker = L.marker(args[1].latlng, { opacity: 0 }); 
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
  
  private updateOnLayersChange(): void {
    this.mapLayersService.mapLayersUpdate(this.map, this.mapLayers);
  }

  private subscribeToMapLayersChange(): void {
    this.mapLayersService.$mapLayersChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateOnLayersChange();
    });
  }

  private subscribeToFeatureSelectChange(): void {
    this.fss.$currentSelected
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(featureIndex => {
        const feature = this.indexedFeatureLayers.get(featureIndex);
        if (featureIndex && feature) {
          setTimeout(() => {
            const bound = feature.layer.getBounds()
            this.map.fitBounds(bound, { padding: [20, 20] });
          }, 700);
        }
      });
  }

  ngOnDestroy() {
    this.resetMap();
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
