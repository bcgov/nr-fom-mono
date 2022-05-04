import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class FeatureSelectService {

  private _featureSelected = new BehaviorSubject(null);
  $currentSelected = this._featureSelected.asObservable();

  
  constructor () { 
    // Deliberately empty 
  }

  changeSelectedFeature(featureIndex: string) {
    this._featureSelected.next(featureIndex);
  }

}
