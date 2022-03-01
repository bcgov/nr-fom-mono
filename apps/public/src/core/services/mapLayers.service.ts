import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MapLayers } from "../../app/applications/app-map/map-layers";

@Injectable({
  providedIn: 'root'
})
export class MapLayersService {

  // Value passing:
  // - For baseLayer change: {baseLayer: string}
  // - For overlay change: {overlay: {action: 'ADD'|'REMOVE', layerName: string}}
  private _mapLayersChange = new BehaviorSubject({baseLayer: null, overlay: null});
  $mapLayersChange = this._mapLayersChange.asObservable();
  
  constructor () { 
    // Deliberately empty 
  }

  getCurrentChangeState() {
    return this._mapLayersChange.value;
  }

  notifyLayersChange(data) {
    let layersChange = this._mapLayersChange.value;
    if (data.baseLayer) {
      layersChange['baseLayer'] = data.baseLayer;
    }
    if (data.overlay) {
      layersChange['overlay'] = data.overlay;
    }
    this._mapLayersChange.next(layersChange);
  }

  mapLayersUpdate(map: L.Map, componentMapLayers: MapLayers, data: any) {
    if (data.baseLayer) {
      const currentActiveBaseLayer = componentMapLayers.getActiveBaseLayer();
      const newBaseLayer = componentMapLayers.getBaseLayerByName(data.baseLayer);
      map.removeLayer(currentActiveBaseLayer);
      map.addLayer(newBaseLayer);
    }
    if (data.overlay) {
      const overlay = componentMapLayers.getOverlayByName(data.overlay.layerName);
      if (data.overlay.action == OverlayAction.Add) {
        map.addLayer(overlay);
      }
      else {
        map.removeLayer(overlay);
      }
    }
  }
}

export const OverlayAction = {
  Add: 'ADD',
  Remove: 'REMOVE'
}