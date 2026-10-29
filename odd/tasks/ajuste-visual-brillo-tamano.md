# Ajuste visual — brillo, tamaño del libro y legibilidad

Estado: escrito (tsc OK; caras 0–4 re-exportadas); pendiente de validación visual del usuario · Pedido del usuario: "bajarle un poco al brillo (hace la letra difícil de leer)", "hacer el portafolio un poco más grande" y "la letra también más grande".

## Alcance autorizado
Constantes de luz/postproceso, poses de cámara y/o escala del libro, tamaños tipográficos de las caras 0–4 ya diseñadas, y re-export de esas caras. Sin zoom interactivo (se estructura aparte), sin caras nuevas (4B).

## Tareas
- [x] **T1 Brillo:** bajar `KEY_LIGHT.intensity` y `FILL`/bloom/exposición (punto de partida: −25 a −35 %) hasta que el papel blanco de las páginas no se queme y el texto tenga contraste claro. Revisar si los materiales de página reciben brillo especular o emisivo innecesario. Mantener el pool de luz y las esquinas oscuras del escritorio (aprobados por el usuario).
- [x] **T2 Tamaño:** acercar la cámara de las poses `closed` y `open` y/o escalar el libro para que el spread abierto ocupe ~85 % del ancho de la ventana en 16:9 sin tapar el overlay (logo y botón) ni cortar la cara inferior; el libro cerrado también algo más grande. Mantener los props visibles y cortados por el borde.
- [x] **T3 Tipografía:** en las caras 0–4, nada por debajo de 20 px en el espacio de la cara (1600×1100), cuerpo ≥ 26 px, metadatos ≥ 20 px; titulares gigantes se mantienen. Ajustar la maquetación para que nada se desborde ni se solape, re-exportar con `npm run pages:export` y revisar 1–2 imágenes.
- [x] **T4** Dejar en este archivo la escala tipográfica mínima final (será el estándar para las caras de la 4B) y las constantes tocadas.

## Criterios de aceptación (los revisa el usuario)
- El texto de las páginas se lee con comodidad; el papel ya no se ve quemado.
- El libro se ve claramente más grande sin perder el encuadre (props, overlay).
- Las caras 0–4 siguen sin solapes ni textos cortados.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales.

## Constantes de ajuste (antes → después)
| Dónde | Constante | Antes | Después | Por qué |
|---|---|---|---|---|
| `src/scene/Experience.tsx` | `KEY_LIGHT.intensity` | 240 | 170 (−29 %) | Papel blanco llegaba a ~2.3 en luz lineal (quemado) |
| `src/scene/Experience.tsx` | `POST.bloomThreshold` | 1.4 | 2.2 | Con 1.4 las páginas blancas disparaban el bloom y difuminaban el texto |
| `src/scene/Experience.tsx` | `POST.noiseOpacity` | 0.03 | 0.02 | El grano sobre texto pequeño resta legibilidad |
| `src/scene/Book.tsx` | `PAGE_TINT` (nuevo) | sin tinte | `#eaeaea` (~0.82 lineal) | Baja solo el brillo de las páginas sin oscurecer el escritorio |
| `src/scene/CameraRig.tsx` | `OPEN_FILL` (nuevo) | distancia fija (~0.73 del ancho en 16:9) | 0.84 | El spread abierto ocupa ~84 % del ancho; la distancia se calcula con el aspecto de la ventana (límites 2.3–4.6) |
| `src/scene/CameraRig.tsx` | `CLOSED_DISTANCE_FACTOR` (nuevo) | 1 | 0.9 | Libro cerrado / contraportada ~10 % más cerca |
Resultado estimado del papel en el centro de la luz: ~1.3 en luz lineal (antes ~2.3), por debajo del umbral del bloom.

## Escala tipográfica mínima (estándar para las caras de la 4B; espacio de cara 1600×1100)
- Cuerpo de texto: **≥ 26 px** (bio 28 px, descripciones 26 px).
- Metadatos, etiquetas, chips, cabeceras, folios: **≥ 20 px** (mono en mayúsculas con tracking ≤ 0.16em).
- Nada por debajo de 20 px. Titulares gigantes (130–210 px) sin cambios salvo ajustes para no solapar.
- Tras cualquier cambio de tamaño: re-exportar y abrir la imagen para comprobar solapes.
Cambios por cara: `parts.tsx` (cabecera 28/20, folio 20, etiquetas 20), Tapa (34/26), Índice (subtítulo 22, números 24/22), Bienvenida (mini-nav 20, botón 22), Acerca de mí (titular 210→180, bio 25→28, datos 30→32, chips 18→22, principios 40→32 sin desbordar), Experiencia (titular 150→130, años 21→24, título 34→36, institución 22→26, nota 21→26; columna académica 560→480).

## Gotchas
- El brillo percibido venía sobre todo del bloom (umbral 1.4 < brillo del papel), no solo de la intensidad de la luz: si se vuelve a subir la luz, subir también `bloomThreshold`.
- `OPEN_FILL` depende del aspecto de la ventana; en ventanas muy estrechas la cámara se aleja (máx. 4.6) y el libro se ve más pequeño.
- La textura sigue en 1600×1100; si al hacer zoom se ve borrosa, exportar a 2× (3200×2200) es el siguiente paso.
