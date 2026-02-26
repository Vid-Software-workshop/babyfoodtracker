# Baby Food Tracker

Aplicación en Next.js para llevar control de alimentos probados por un bebé.

## Funciones MVP

- Lista de alimentos inicial por categorías:
  - Frutas
  - Verduras
  - Proteína
  - Cereales
- Marcar alimento como probado
- Guardar fecha y nota por alimento
- Ver progreso general y por categoría
- Persistencia local con `localStorage` (sin backend)

## Requisitos

- Node.js 20+
- npm 10+

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrir: http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Notas

- Los datos se guardan en el navegador (`localStorage`), por lo que no se comparten entre dispositivos.
- Se puede ampliar fácilmente el catálogo de alimentos en `app/page.tsx`.
