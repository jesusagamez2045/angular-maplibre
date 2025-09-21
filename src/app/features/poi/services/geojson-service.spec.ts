import { TestBed } from '@angular/core/testing';
import { GeojsonService } from './geojson-service';
import { FeatureCollection, Point } from 'geojson';

describe('GeojsonService', () => {
  let service: GeojsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeojsonService);
  });

  it('should validate a correct feature', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-70, -33] },
      properties: { name: 'Test', category: 'Demo' },
    };

    const result = service.validateFeature(feature);
    expect(result).toBeTruthy();
  });

  it('should fail if geometry type is not Point', () => {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-70, -33],
          [-71, -34],
        ],
      },
      properties: { name: 'Test', category: 'Demo' },
    };

    const report = {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: { missingName: 0, missingCategory: 0, invalidCoordinates: 0, invalidGeometry: 0 },
    };
    const result = service.validateFeature(feature, report);
    expect(result).toBeNull();
    expect(report.errors.invalidGeometry).toBe(1);
  });

  it('should fail if coordinates are invalid', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [200, 95] },
      properties: { name: 'Test', category: 'Demo' },
    };

    const report = {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: { missingName: 0, missingCategory: 0, invalidCoordinates: 0, invalidGeometry: 0 },
    };
    const result = service.validateFeature(feature, report);
    expect(result).toBeNull();
    expect(report.errors.invalidCoordinates).toBe(1);
  });

  it('should fail if name is missing', () => {
    const feature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-70, -33] },
      properties: { category: 'Demo' },
    };

    const report = {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: { missingName: 0, missingCategory: 0, invalidCoordinates: 0, invalidGeometry: 0 },
    };
    const result = service.validateFeature(feature, report);
    expect(result).toBeNull();
    expect(report.errors.missingName).toBe(1);
  });

  it('should validate a FeatureCollection and generate a report', () => {
    const fc: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-70, -33] },
          properties: { name: 'Valid', category: 'Demo' },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [200, 95] },
          properties: { name: 'Bad', category: 'Demo' },
        },
      ],
    };

    const { valid, invalid, report } = service.validateFeatureCollection(fc);

    expect(valid.features.length).toBe(1);
    expect(invalid.length).toBe(1);
    expect(report.total).toBe(2);
    expect(report.valid).toBe(1);
    expect(report.invalid).toBe(1);
    expect(report.errors.invalidCoordinates).toBe(1);
  });
});
