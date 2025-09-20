import { Injectable } from '@angular/core';

import { Feature, FeatureCollection, Point } from 'geojson';
import { GeojsonValidationReport } from '../models/geojson-validation-report';

@Injectable({
  providedIn: 'root',
})
export class GeojsonService {
  public validateFeature(feature: any, report?: GeojsonValidationReport): Feature<Point> | null {
    if (feature?.type !== 'Feature' || feature?.geometry?.type !== 'Point') {
      report && (report.errors.invalidGeometry += 1);
      return null;
    }

    const coords = feature.geometry.coordinates;
    if (!Array.isArray(coords)) {
      report && (report.errors.invalidCoordinates += 1);
      return null;
    }

    const [lon, lat] = coords;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      report && (report.errors.invalidCoordinates += 1);
      return null;
    }

    if (!feature.properties) {
      report && (report.errors.missingName += 1);
      report && (report.errors.missingCategory += 1);
      return null;
    }

    if (typeof feature.properties.name !== 'string') {
      report && (report.errors.missingName += 1);
      return null;
    }

    if (typeof feature.properties.category !== 'string') {
      report && (report.errors.missingCategory += 1);
      return null;
    }

    return feature as Feature<Point>;
  }

  public validateFeatureCollection(data: any): {
    valid: FeatureCollection<Point>;
    invalid: any[];
    report: GeojsonValidationReport;
  } {
    const valid: Feature<Point>[] = [];
    const invalid: any[] = [];

    const report: GeojsonValidationReport = {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: {
        missingName: 0,
        missingCategory: 0,
        invalidCoordinates: 0,
        invalidGeometry: 0,
      },
    };

    if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
      return { valid: { type: 'FeatureCollection', features: [] }, invalid: [], report };
    }

    for (const f of data.features) {
      report.total++;
      const result = this.validateFeature(f, report);
      if (result) {
        valid.push(result);
        report.valid++;
      } else {
        invalid.push(f);
        report.invalid++;
      }
    }

    return {
      valid: { type: 'FeatureCollection', features: valid },
      invalid,
      report,
    };
  }
}
