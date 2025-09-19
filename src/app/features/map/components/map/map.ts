import { Component, input } from '@angular/core';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';

import { StyleSpecification } from 'maplibre-gl';

@Component({
  selector: 'app-map',
  imports: [MapComponent],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map {
  public zoom = input<[number]>([12]);
  public center = input<[number, number]>([-70.6483, -33.4569]);

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
}
