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

## 2. Agregar más juegos

Abrí `games.json` y agregá un bloque por juego (copiá y pegá uno existente y editalo):

```json
{
  "nombre": "Nombre del juego",
  "precio": 10000,
  "estado": "usado",
  "descripcion": "Una frase corta sobre el juego.",
  "jugadores": "2-4",
  "edad": "8+",
  "foto": "assets/games/nombre-del-juego.jpg"
}
```

`estado` solo puede ser `"nuevo"` o `"usado"`.

## 3. Cuando se vende un juego

Borrá su bloque completo de `games.json` y hacé push otra vez — el sitio se actualiza solo.

## 4. Agregar fotos

Poné las fotos dentro de `assets/games/` y referenciá el nombre del archivo en el campo `"foto"`. Mientras no tengas foto, usá `"assets/placeholder.svg"`.

## 5. Publicar con GitHub Pages

1. Subí todos estos archivos a tu repo `el-duende-y-la-nina` (raíz del repo, no en una subcarpeta).
2. En GitHub, andá a **Settings → Pages**.
3. En "Source" elegí la rama `main` y carpeta `/ (root)`.
4. Guardá. En unos minutos tu sitio va a estar en:
   `https://godinex.github.io/el-duende-y-la-nina/`

Cada vez que edites `games.json` o subas fotos nuevas y hagas push, el sitio se actualiza solo.
