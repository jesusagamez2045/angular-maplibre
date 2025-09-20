import { Feature, Point } from 'geojson';

export type PoiFeature = Feature<
  Point,
  {
    id: string;
    name: string;
    category: string;
  }
>;
