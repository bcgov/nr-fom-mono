import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapLayersService {

  // Value passing:
  // - For baseLayer change: {baseLayer: string}
  // - For overlay change: {overlay: {action: 'ADD'|'REMOVE', layerName: string}}
  private _mapLayersChange = new BehaviorSubject(null);
  $mapLayersChange = this._mapLayersChange.asObservable();
  
  constructor () { 
    // Deliberately empty 
  }

  notifyLayersChange(data) {
    this._mapLayersChange.next(data);
  }
}

export const OverlayAction = {
  Add: 'ADD',
  Remove: 'REMOVE'
}