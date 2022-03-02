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

  // Internally maintain overlay layers.
  // Some component needs this initially.
  private _overlayLayers = [];
  
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
      // maintain internal overlay state.
      if (data.overlay.action == OverlayAction.Add) {
        this._overlayLayers.push(data.overlay.layerName);
      }
      else {
        this._overlayLayers = this._overlayLayers.filter(e => e !== data.overlay.layerName);
      }
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

  applyCurrentMapLayers(map: L.Map, componentMapLayers: MapLayers) {
    // For base layer
    if (this.getCurrentChangeState().baseLayer) {
      const currentActiveBaseLayer = componentMapLayers.getActiveBaseLayer();
      const newBaseLayer = componentMapLayers.getBaseLayerByName(this.getCurrentChangeState().baseLayer);
      map.removeLayer(currentActiveBaseLayer);
      map.addLayer(newBaseLayer);
    }

    // For overlay layers
    const overlayLayersNames = componentMapLayers.getAllOverlayLayersNames();
    overlayLayersNames.forEach(ln => {
      const overlay = componentMapLayers.getOverlayByName(ln);
      if (this._overlayLayers.includes(ln)) {
        map.addLayer(overlay);
      }
      else {
        map.removeLayer(overlay);
      }
    });
  }
}

export const OverlayAction = {
  Add: 'ADD',
  Remove: 'REMOVE'
}