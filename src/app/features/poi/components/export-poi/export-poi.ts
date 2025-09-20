import { Component, inject } from '@angular/core';
import { PoiStoreService } from '../../services/poi-store-service';

@Component({
  selector: 'app-export-poi',
  imports: [],
  templateUrl: './export-poi.html',
  styleUrl: './export-poi.scss',
})
export class ExportPoi {
  private readonly _poiStore = inject(PoiStoreService);

  public export(): void {
    const data = this._poiStore.getCurrentFeatures();

    if (!data || !data.features || data.features.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pois.geojson';
    a.click();
    URL.revokeObjectURL(url);

    alert('Archivo exportado');
  }
}
