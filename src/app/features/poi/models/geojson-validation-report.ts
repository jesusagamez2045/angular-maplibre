export interface GeojsonValidationReport {
  total: number;
  valid: number;
  invalid: number;
  errors: {
    missingName: number;
    missingCategory: number;
    invalidCoordinates: number;
    invalidGeometry: number;
  };
}
