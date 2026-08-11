# El Duende y la Niña — Catálogo de venta

Sitio estático simple para vender tu colección de juegos de mesa.

## 1. Configurar tu número de WhatsApp

Abrí `script.js` y en la primera línea reemplazá:

```js
const WHATSAPP_NUMBER = "50600000000";
```

por tu número real, con código de país y sin espacios ni `+`. Ejemplo para Costa Rica:

```js
const WHATSAPP_NUMBER = "50688888888";
```

## Pendiente de completar (importado de BGG)

Ya cargué los 36 juegos marcados como "for trade" en tu colección de BGG. A cada uno le falta:

- **`precio`**: está en `null`. Completalo con el número en colones (ej. `15000`).
- **`estado`**: está vacío (`""`). Poné `"nuevo"` o `"usado"` según corresponda — mientras esté vacío, la tarjeta no muestra la etiqueta pero funciona igual.
- **`foto`**: apunta a `placeholder.svg`. Reemplazalo por una foto real tuya (ver sección 3).
- **`descripcion`**: vacía, podés agregar una frase corta si querés.

El sitio ya soporta que estos campos estén vacíos sin romperse (muestra "Precio a consultar" y esconde la etiqueta de estado), así que podés publicarlo ya y completarlo de a poco.

## 2. Agregar tus juegos

Abrí `games.json` y agregá un bloque por juego (podés copiar y pegar uno existente y editarlo):

```json
{
  "nombre": "Nombre del juego",
  "precio": 10000,
  "estado": "usado",
  "descripcion": "Una frase corta sobre el juego.",
  "jugadores": "2-4",
  "edad": "8+",
  "foto": "nombre-del-juego.jpg"
}
```

`estado` solo puede ser `"nuevo"` o `"usado"`.

## 3. Agregar fotos

Poné las fotos de tus juegos dentro de la raíz del repo (junto a index.html) y referenciá el nombre del archivo en el campo `"foto"` de cada juego en `games.json`. Mientras no tengas foto, dejá `"placeholder.svg"`.

## 4. Publicar con GitHub Pages

1. Subí todos estos archivos a tu repo `duende-y-la-nina` (raíz del repo, no en una subcarpeta).
2. En GitHub, andá a **Settings → Pages**.
3. En "Source" elegí la rama `main` y carpeta `/ (root)`.
4. Guardá. En unos minutos tu sitio va a estar en:
   `https://godinex.github.io/el-duende-y-la-nina/`

Cada vez que edites `games.json` o subas fotos nuevas y hagas push, el sitio se actualiza solo.
