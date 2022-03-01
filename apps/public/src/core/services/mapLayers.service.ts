import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapLayersService {

  private _mapLayersChange = new BehaviorSubject(null);
  $mapLayersChange = this._mapLayersChange.asObservable();
  
  constructor () { 
    // Deliberately empty 
  }

  notifyLayersChange(data) {
    this._mapLayersChange.next(data);
  }
}