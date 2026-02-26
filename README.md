# Baby Food Tracker

Aplicación en Next.js para llevar control de alimentos probados por un bebé.

## Funciones

- **Catálogo completo de alimentos** organizado por categorías:
  - **Frutas**: Manzana, Plátano, Melón, Ciruela, Papaya, Sandía, Pera, Uva, Mango, Mamey, Zapote, Arándano, Granada, Durazno, Kiwi, Guayaba, Mandarina, Naranja, Toronja, Limón, Pitaya, Tejocote, Piña, Cereza, Fresas, Guanábana, Coco, Mora azul, Zarzamora, Frambuesa
  - **Verduras**: Zanahoria, Chayote, Coliflor, Calabacita, Brócoli, Papa, Acelga, Alfalfa, Alcachofa, Berenjena, Col/Repollo (morado), Espárrago, Espinaca, Jitomate/Tomate, Aguacate, Pepino, Champiñón, Jícama, Chícharo, Frijol, Garbanzo, Alubias, Lentejas, Ejotes, Coles de Bruselas, Puerro, Nopal, Taro, Lechuga, Apio, Pimiento/Morrón, Rábano, Cebolla, Ajo, Pimienta
  - **Proteína**: Res, Pollo, Pescado, Puerco, Huevo
  - **Cereales**: Avena, Arroz, Maíz, Trigo, Amaranto, Cebada, Quinoa, Ajonjolí, Chía

- **Filtros avanzados**:
  - Estado: Todos / Probados / Pendientes
  - Por categoría
  - Búsqueda por texto

- **Vista de calendario mensual**: Visualiza qué alimentos se probaron cada día
- **Notas** por cada alimento probado
- **Persistencia local** con `localStorage` (sin backend)

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
- Interfaz en español.
