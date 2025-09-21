import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { APP_CONSTANTS } from '../../../shared/constants/constants';
import { PoiInput } from '../models/poi-input.model';
import { PoiFeature } from '../models/poi-feature.model';

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
    const withIds: PoiFeature[] = fc.features.map((f) => ({
      ...f,
      properties: {
        ...(f.properties as any),
        id: (f.properties as any)?.id ?? crypto.randomUUID(),
        name: (f.properties as any)?.name || 'Unnamed',
        category: (f.properties as any)?.category || 'Uncategorized',
      },
    }));

    this._features$.next({
      type: 'FeatureCollection',
      features: withIds,
    });
  }

  public saveToLocal(): void {
    const fc = this._features$.getValue();
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

  public addPoi(poi: PoiInput): void {
    const newFeature: Feature<Point> = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: poi.coordinates },
      properties: { name: poi.name, category: poi.category },
    };

    const current = this.getCurrentFeatures();
    this.setFeatures({
      ...current,
      features: [...current.features, newFeature],
    });
  }

  public updatePoi(id: string, poi: PoiInput): void {
    const current = this.getCurrentFeatures();
    const updated = [...current.features];

    const index = updated.findIndex((f) => (f.properties as any)?.id === id);

    if (index === -1) {
      console.warn(`POI with id ${id} not found`);
      return;
    }

    updated[index] = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: poi.coordinates },
      properties: {
        ...(updated[index].properties as any),
        name: poi.name,
        category: poi.category,
        id,
      },
    };

    this.setFeatures({
      ...current,
      features: updated,
    });
  }

  public clear(): void {
    localStorage.removeItem(APP_CONSTANTS.STORAGE.POI_EDITOR_STATE);
    this._features$.next({ type: 'FeatureCollection', features: [] });
  }

  public getCurrentFeatures(): FeatureCollection<Point, GeoJsonProperties> {
    return this._features$.getValue();
  }
}
