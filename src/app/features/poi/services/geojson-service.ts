import { Injectable } from '@angular/core';

import { Feature, FeatureCollection, Point } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class GeojsonService {
  validateFeature(feature: any): Feature<Point> | null {
    if (
      feature?.type !== 'Feature' ||
      feature?.geometry?.type !== 'Point' ||
      !Array.isArray(feature.geometry.coordinates)
    )
      return null;

    const [lon, lat] = feature.geometry.coordinates;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return null;

    if (
      !feature.properties ||
      typeof feature.properties.name !== 'string' ||
      typeof feature.properties.category !== 'string'
    )
      return null;

    return feature as Feature<Point>;
  }

  validateFeatureCollection(data: any): {
    valid: FeatureCollection<Point>;
    invalid: any[];
  } {
    const valid: Feature<Point>[] = [];
    const invalid: any[] = [];

    if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
      return { valid: { type: 'FeatureCollection', features: [] }, invalid: [] };
    }

    for (const f of data.features) {
      const result = this.validateFeature(f);
      if (result) valid.push(result);
      else invalid.push(f);
    }

    return {
      valid: { type: 'FeatureCollection', features: valid },
      invalid,
    };
  }
}
