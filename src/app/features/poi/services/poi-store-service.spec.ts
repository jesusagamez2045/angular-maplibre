import { TestBed } from '@angular/core/testing';
import { PoiStoreService } from './poi-store-service';
import { PoiInput } from '../models/poi-input.model';
import { FeatureCollection, Point } from 'geojson';
import { APP_CONSTANTS } from '../../../shared/constants/constants';
import { PoiFeature } from '../models/poi-feature.model';

describe('PoiStoreService', () => {
  let service: PoiStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoiStoreService);
    localStorage.clear();
  });

  it('should start with an empty FeatureCollection', (done) => {
    service.getFeatureCollection$().subscribe((fc) => {
      expect(fc.features.length).toBe(0);
      done();
    });
  });

  it('should add a POI', () => {
    const poi: PoiInput = {
      name: 'Test POI',
      category: 'Demo',
      coordinates: [-70.6483, -33.4569],
    };

    service.addPoi(poi);
    const features = service.getCurrentFeatures().features as PoiFeature[];

    expect(features.length).toBe(1);
    expect(features[0].properties?.name).toBe('Test POI');
    expect(features[0].properties?.category).toBe('Demo');
    expect((features[0].properties as any).id).toBeTruthy();
  });

  it('should update a POI', () => {
    const poi: PoiInput = {
      name: 'Original',
      category: 'Demo',
      coordinates: [-70, -33],
    };

    service.addPoi(poi);
    const id = (service.getCurrentFeatures().features[0].properties as any).id;

    service.updatePoi(id, {
      name: 'Updated',
      category: 'Changed',
      coordinates: [-71, -34],
    });

    const updated = service.getCurrentFeatures().features[0] as PoiFeature;
    expect(updated.properties?.name).toBe('Updated');
    expect(updated.properties?.category).toBe('Changed');
    expect(updated.geometry.coordinates).toEqual([-71, -34]);
  });

  it('should remove a POI by id', () => {
    const poi: PoiInput = {
      name: 'To Delete',
      category: 'Test',
      coordinates: [-70, -33],
    };

    service.addPoi(poi);
    const id = (service.getCurrentFeatures().features[0].properties as any).id;

    service.removePoiById(id);

    expect(service.getCurrentFeatures().features.length).toBe(0);
  });

  it('should save and restore from localStorage', () => {
    const poi: PoiInput = {
      name: 'Persisted POI',
      category: 'Storage',
      coordinates: [-70, -33],
    };

    service.addPoi(poi);
    service.saveToLocal();

    service.restoreFromLocal();
    const restored = service.getCurrentFeatures().features[0] as PoiFeature;

    expect(restored.properties?.name).toBe('Persisted POI');
    expect(restored.properties?.category).toBe('Storage');
  });

  it('should clear all features and localStorage', () => {
    service.addPoi({
      name: 'To Clear',
      category: 'Demo',
      coordinates: [-70, -33],
    });
    service.saveToLocal();

    service.clear();

    const fc = service.getCurrentFeatures();
    expect(fc.features.length).toBe(0);
    expect(localStorage.getItem(APP_CONSTANTS.STORAGE.POI_EDITOR_STATE)).toBeNull();
  });
});
