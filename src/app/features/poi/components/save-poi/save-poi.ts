import { Component, inject } from '@angular/core';
import { PoiStoreService } from '../../services/poi-store-service';

@Component({
  selector: 'app-save-poi',
  imports: [],
  templateUrl: './save-poi.html',
  styleUrl: './save-poi.scss',
})
export class SavePoi {
  private readonly _poiStore = inject(PoiStoreService);

  save() {
    this._poiStore.saveToLocal();
    alert('✅ POIs guardados correctamente');
  }
}
