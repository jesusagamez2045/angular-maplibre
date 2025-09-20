import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { APP_CONSTANTS } from '../../../shared/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class PoiStoreService {
  private _features$ = new BehaviorSubject<FeatureCollection<Point>>({
    type: 'FeatureCollection',
    features: [],
  });

  public getFeatureCollection$(): Observable<FeatureCollection<Point, GeoJsonProperties>> {
    return this._features$.asObservable();
  }

  public setFeatures(fc: FeatureCollection<Point>): void {
    this._features$.next(fc);
    localStorage.setItem(APP_CONSTANTS.STORAGE.POI_EDITOR_STATE, JSON.stringify(fc));
  }

  public restoreFromLocal(): void {
    const saved = localStorage.getItem(APP_CONSTANTS.STORAGE.POI_EDITOR_STATE);
    if (saved) {
      try {
        const parsed: FeatureCollection<Point, GeoJsonProperties> = JSON.parse(saved);
        this._features$.next(parsed);
      } catch (e) {
        this.clear();
        console.warn('Invalid localStorage data, ignoring', e);
      }
    }
  }

  public clear(): void {
    localStorage.removeItem(APP_CONSTANTS.STORAGE.POI_EDITOR_STATE);
    this._features$.next({ type: 'FeatureCollection', features: [] });
  }
}
