## angular-maplibre

### ■ Requisitos de entorno

- Node.js >= 18.x
- Angular CLI >= 17.x (`npm install -g @angular/cli`)

### ■ Instalación, compilación y ejecución

1. Instalar dependencias:
	```sh
	npm install
	```
2. Levantar el proyecto en modo desarrollo:
	```sh
	npm start
	```
3. Compilar para producción:
	```sh
	npm run build
	```
4. Ejecutar tests:
	```sh
	npm test
	```

### ■ Decisiones de arquitectura y trade-offs

- **Angular Standalone Components**: Se utiliza Angular 20+ con componentes standalone para mayor modularidad y menor boilerplate.
- **MapLibre GL**: Se integra `@maplibre/ngx-maplibre-gl` para el renderizado de mapas interactivos, permitiendo independencia de proveedores propietarios.
- **Gestión de POIs**: El estado de los POIs se gestiona con un servicio singleton (`PoiStoreService`) usando `BehaviorSubject` para reactividad y persistencia local (localStorage).
- **Validación de GeoJSON**: Se implementa validación estricta de los datos importados/exportados para asegurar integridad y feedback al usuario.
- **SCSS**: Se usa SCSS para estilos, facilitando la personalización y mantenimiento visual.

**Trade-offs:**
- No se utiliza un state manager global (NgRx, Akita) para mantener la simplicidad, dado el alcance del proyecto.
- La persistencia es solo local (no hay backend), lo que limita la colaboración multiusuario.

### ■ Limitaciones conocidas y posibles mejoras

- **Limitaciones:**
  - Solo soporta puntos (Point) en GeoJSON, no líneas ni polígonos.
  - La persistencia es local, se pierde al limpiar el almacenamiento del navegador.

- **Posibles mejoras:**
  - Añadir soporte para otros tipos de geometría (LineString, Polygon).
  - Integrar autenticación y backend para persistencia real y multiusuario.
  - Añadir tests E2E.
  - Mejorar la UI/UX y accesibilidad.
