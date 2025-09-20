import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, input, OnInit, viewChild } from '@angular/core';
import { MapComponent, GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import maplibregl, { StyleSpecification } from 'maplibre-gl';
import { FeatureCollection, Point } from 'geojson';

import { APP_CONSTANTS } from '../../../../shared/constants/constants';
import { ImportPoi } from '../../../poi/components/import-poi/import-poi';
import { PoiStoreService } from '../../../poi/services/poi-store-service';
import { ResetPoi } from '../../../poi/components/reset-poi/reset-poi';

@Component({
  selector: 'app-map',
  imports: [MapComponent, GeoJSONSourceComponent, LayerComponent, ImportPoi, AsyncPipe, ResetPoi],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements OnInit, AfterViewInit {
  public zoom = input<[number]>([APP_CONSTANTS.MAP.INITIAL_ZOOM]);
  public center = input<[number, number]>(APP_CONSTANTS.MAP.INITIAL_CENTER);

  public mapComponent = viewChild.required(MapComponent);

  private readonly _poiStore = inject(PoiStoreService);
  public readonly pois$ = this._poiStore.getFeatureCollection$();

  public readonly style: StyleSpecification = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm',
      },
    ],
  };

  ngOnInit(): void {
    this._poiStore.restoreFromLocal();
  }

  ngAfterViewInit(): void {
    this.pois$.subscribe((fc) => {
      if (fc.features.length > 0 && this.mapComponent()) {
        this.fitToFeatures(fc);
      }
    });
  }

  private fitToFeatures(fc: FeatureCollection<Point>) {
    const coords = fc.features.map((f) => f.geometry.coordinates as [number, number]);
    if (coords.length === 0) return;

    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds(coords[0], coords[0])
    );

    const map = this.mapComponent().mapInstance;

    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
      essential: true,
    });
  }
}
