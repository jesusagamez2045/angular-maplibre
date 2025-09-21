import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  MapComponent,
  GeoJSONSourceComponent,
  LayerComponent,
  EventData,
} from '@maplibre/ngx-maplibre-gl';
import maplibregl, { MapMouseEvent, StyleSpecification } from 'maplibre-gl';
import { FeatureCollection, Point } from 'geojson';

import { APP_CONSTANTS } from '../../../../shared/constants/constants';
import { ImportPoi } from '../../../poi/components/import-poi/import-poi';
import { PoiStoreService } from '../../../poi/services/poi-store-service';
import { ResetPoi } from '../../../poi/components/reset-poi/reset-poi';
import { SavePoi } from '../../../poi/components/save-poi/save-poi';
import { Subscription } from 'rxjs';
import { ExportPoi } from '../../../poi/components/export-poi/export-poi';
import { PoiDialog } from '../../../poi/components/poi-dialog/poi-dialog';
import { PoiInput } from '../../../poi/models/poi-input.model';

@Component({
  selector: 'app-map',
  imports: [
    MapComponent,
    GeoJSONSourceComponent,
    LayerComponent,
    ImportPoi,
    AsyncPipe,
    ResetPoi,
    SavePoi,
    ExportPoi,
    PoiDialog,
  ],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements OnInit, AfterViewInit, OnDestroy {
  public zoom = input<[number]>([APP_CONSTANTS.MAP.INITIAL_ZOOM]);
  public center = input<[number, number]>(APP_CONSTANTS.MAP.INITIAL_CENTER);

  public mapComponent = viewChild.required(MapComponent);

  private readonly _poiStore = inject(PoiStoreService);
  private _poiSub: Subscription | null = null;
  public readonly pois$ = this._poiStore.getFeatureCollection$();

  public showDialog = signal(false);
  public dialogLat = signal(0);
  public dialogLng = signal(0);
  public editingPoiId = signal<string | null>(null);
  public editingPoi = signal<PoiInput | null>(null);

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
    this._poiSub = this.pois$.subscribe((fc) => {
      if (fc.features.length > 0 && this.mapComponent()) {
        this.fitToFeatures(fc);
      }
    });
  }

  ngOnDestroy(): void {
    this._poiSub?.unsubscribe();
  }

  public onMapClick(event: MapMouseEvent & EventData) {
    const [lon, lat] = event.lngLat.toArray();

    this.dialogLat.set(lat);
    this.dialogLng.set(lon);
    this.showDialog.set(true);
  }

  public addPoi(poi: PoiInput): void {
    if (this.editingPoiId() && this.editingPoiId()) {
      this._poiStore.updatePoi(this.editingPoiId()!, poi);
      this.onCloseDialog();

      alert(`Se ha editado el POI "${poi.name}"`);
      return;
    }

    this._poiStore.addPoi(poi);
    this.onCloseDialog();

    alert(
      `Se ha añadido el POI "${poi.name}" en [${poi.coordinates[1].toFixed(
        4
      )}, ${poi.coordinates[0].toFixed(4)}]`
    );
  }

  public deletePoi(): void {
    if (!this.editingPoiId() || !this.editingPoi()) return;

    this._poiStore.removePoiById(this.editingPoiId()!);
    alert(`Se ha eliminado el POI "${this.editingPoi()!.name}"`);
    this.onCloseDialog();
  }

  public onCloseDialog(): void {
    this.showDialog.set(false);
    this.dialogLat.set(0);
    this.dialogLng.set(0);
    this.editingPoiId.set(null);
    this.editingPoi.set(null);
  }

  public onPoiClick(event: any): void {
    if (!event.features || event.features.length === 0) return;

    const feature = event.features[0];
    const coordinates = feature.geometry.coordinates;
    const properties = feature.properties;

    this.editingPoiId.set(feature.properties.id);
    this.dialogLat.set(coordinates[1]);
    this.dialogLng.set(coordinates[0]);

    this.editingPoi.set({
      name: properties.name,
      category: properties.category,
      coordinates: coordinates,
    });

    this.showDialog.set(true);
  }

  private fitToFeatures(fc: FeatureCollection<Point>) {
    if (!this.mapComponent() || !this.mapComponent().mapInstance) return;

    const coords = fc.features.map((f) => f.geometry.coordinates as [number, number]);
    if (coords.length === 0) return;

    const map = this.mapComponent().mapInstance;

    if (coords.length === 1) {
      map.flyTo({ center: coords[0], zoom: 14, essential: true });
      return;
    }

    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds(coords[0], coords[0])
    );

    map.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
      essential: true,
    });
  }
}
