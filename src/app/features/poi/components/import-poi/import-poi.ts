import { Component, inject } from '@angular/core';
import { GeojsonService } from '../../services/geojson-service';
import { PoiStoreService } from '../../services/poi-store-service';

@Component({
  selector: 'app-import-poi',
  imports: [],
  templateUrl: './import-poi.html',
  styleUrl: './import-poi.scss',
})
export class ImportPoi {
  private readonly _geoJsonService = inject(GeojsonService);
  private readonly _poiStore = inject(PoiStoreService);

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        const { valid, invalid } = this._geoJsonService.validateFeatureCollection(data);
        this._poiStore.setFeatures(valid);
        alert(`Importados: ${valid.features.length}, descartados: ${invalid.length}`);
      } catch {
        alert('Archivo inválido');
      }
    };

    reader.readAsText(file);
  }
}
