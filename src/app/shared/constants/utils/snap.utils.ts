import { APP_CONSTANTS } from '../constants';

export function snapToGrid(
  [lon, lat]: [number, number],
  step = APP_CONSTANTS.MAP.SNAP_STEP
): [number, number] {
  const snappedLon = Math.round(lon / step) * step;
  const snappedLat = Math.round(lat / step) * step;
  return [snappedLon, snappedLat];
}
