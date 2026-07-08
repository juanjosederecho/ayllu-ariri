# Guardianes de la Comunidad — Ayllu Ariri

Aplicación Web Progresiva (PWA) responsiva e interactiva diseñada para promover el cuidado del medio ambiente en el distrito de Rosaspata, Huancané (Puno). Permite realizar reportes de residuos con foto y localización satelital (offline/online), chatear con el consejero ambiental Ariri en castellano y aymara, participar en Mink'as de limpieza comunitaria y jugar minijuegos de educación ambiental.

Creada por los estudiantes de 4to de secundaria (Sección A) de la I.E. Rosaspata para el Concurso de Crédito 2026.

## Enlace en vivo

La aplicación está publicada y se puede probar desde PC o celular en:

https://juanjosederecho.github.io/ayllu-ariri/

## Características principales

1. **Funcionamiento Offline:** Gracias al Service Worker y almacenamiento local (`localStorage`), la app cachea las imágenes, mapas Leaflet y guías. Los reportes realizados sin conexión se guardan y se envían automáticamente al recuperar la señal.
2. **Accesibilidad e Inclusión:** Lectura por voz de menús y respuestas del chatbot (Text-to-Speech), dictado de preguntas por voz (Speech-to-Text) y opción de texto ampliado.
3. **Mapa de Incidencias:** Utiliza la API de Leaflet para mostrar puntos de acumulación de basura, ecopuntos de reciclaje, mapas de calor y control de "Antes y Después" para reportes resueltos.
4. **Gamificación:** Gana medallas ("Wiphalas Verdes") por completar minijuegos, reportar incidencias y participar en Mink'as.
5. **Replicabilidad Modular:** Todos los datos específicos de la comunidad (títulos, mapa, glosario, ecopuntos) se cargan desde el archivo modular `config.js` para ser replicado fácilmente por otros colegios o distritos.

## Estructura del proyecto

- `index.html` - Interfaz principal responsiva adaptada a móviles (App Shell).
- `styles.css` - Estilos con tema andino, contrastes accesibles (WCAG AA) y animaciones optimizadas.
- `app.js` - Lógica de navegación, chatbot con reconocimiento de voz, persistencia local y sincronización offline, mapa Leaflet interactivo y juegos.
- `config.js` - Configuración modular de datos de la comunidad y glosario bilingüe.
- `sw.js` - Service Worker para almacenamiento en caché local del mapa y archivos.
- `manifest.webmanifest` - Manifiesto PWA para instalación como app de pantalla completa.
- `INSTRUCCIONES.md` - Guía simplificada para replicar y compilar a archivo APK para celulares Android.
- `assets/` - Logotipos, patrones de tejido y fotos hiperrealistas del paisaje de Rosaspata y Titicaca.

---
Asesor del proyecto: Profesor Juan José Derecho.
Año 2026.
