import { Component, inject } from '@angular/core';
import { PoiStoreService } from '../../services/poi-store-service';

@Component({
  selector: 'app-reset-poi',
  imports: [],
  templateUrl: './reset-poi.html',
  styleUrl: './reset-poi.scss',
})
export class ResetPoi {
  private readonly _poiStore = inject(PoiStoreService);

  public reset(): void {
    if (confirm('¿Seguro que quieres borrar todos los POIs?')) {
      this._poiStore.clear();
    }
  }
}
