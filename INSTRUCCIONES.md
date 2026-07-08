# Guía de Instalación y Replicación — Ayllu Ariri

¡Felicitaciones! Tienes en tus manos el código de **Ayllu Ariri — Guardián de la Comunidad**, desarrollado por los estudiantes de 4to de secundaria (Sección A) del colegio Rosaspata, Huancané, Puno.

Esta guía está diseñada especialmente para estudiantes, profesores y jurados que **no son programadores**, explicando paso a paso cómo abrir la aplicación, cómo cambiarla para otra escuela y cómo convertirla en una aplicación de celular instalable (APK).

---

## 1. Cómo abrir y probar la aplicación en tu computadora o celular

Puedes abrir la aplicación directamente en cualquier navegador web:

### En la Computadora:
1. Entra a la carpeta del proyecto.
2. Busca el archivo llamado `index.html`.
3. Haz doble clic en él. ¡Listo! Se abrirá en tu navegador (Chrome, Edge o Firefox).

### En el Celular (Para probar la cámara y GPS):
Para usar la cámara, el GPS nativo y la instalación PWA completa en el celular, la aplicación necesita estar subida a un servidor seguro (que use `https://`).
1. Puedes subir el proyecto gratis a plataformas como **GitHub Pages**, **Vercel** o **Netlify** arrastrando la carpeta.
2. Una vez subido, entra al enlace generado desde el navegador del celular.
3. Te aparecerá una opción automática de **"Instalar aplicación en la pantalla de inicio"** (o "Añadir a pantalla de inicio"). Al aceptarlo, se comportará como una app de celular normal y funcionará sin internet.

---

## 2. Cómo personalizar la aplicación para otra comunidad (Replicabilidad)

¡La aplicación es totalmente modular! Si otra escuela del distrito o provincia quiere usarla, no tiene que reprogramar nada. Solo debe cambiar los textos en un solo archivo:

1. Abre la carpeta del proyecto y busca el archivo **`config.js`**.
2. Haz clic derecho sobre él y selecciona **"Abrir con" -> "Bloc de notas"** (o cualquier editor como VS Code).
3. Modifica la información que desees:
   - **`community`**: Cambia "Rosaspata" por el nombre de tu pueblo o distrito.
   - **`school`**: Cambia "I.E. Rosaspata" por tu colegio.
   - **`map.center`**: Ingresa las coordenadas (Latitud y Longitud) de tu plaza principal para que el mapa se centre allí.
   - **`map.ecoPoints`**: Edita la lista de puntos de reciclaje que existen en tu zona.
   - **`glossary`**: Añade o modifica palabras en Aymara, Quechua o Castellano.
   - **`quizQuestions`**: Cambia las preguntas del cuestionario de evaluación.
4. Guarda el archivo (`Archivo -> Guardar`). ¡La aplicación se actualizará automáticamente con tu nueva información!

*Nota: También puedes probar cambios rápidos en vivo desde la pestaña **Nosotros** en el editor de configuración en pantalla.*

---

## 3. Cómo compilar y generar la aplicación instalable de Android (APK)

Para convertir esta aplicación web en un archivo `.apk` instalable en celulares Android, te sugerimos dos métodos muy sencillos:

### Método A: Usando PWABuilder (El más fácil, sin programar)
1. Sube tu aplicación web a internet (por ejemplo, a GitHub Pages o Netlify) y copia la dirección web (ej. `https://tuusuario.github.io/ayllu-ariri`).
2. Entra a la página web: [https://www.pwabuilder.com](https://www.pwabuilder.com).
3. Pega la dirección web de tu app en el cuadro central y presiona **"Start"**.
4. La página revisará que tu Service Worker y Manifest estén correctos (los que hemos programado cumplen al 100%).
5. Presiona el botón **"Build My App"** y selecciona **"Android"**.
6. Descarga el paquete generado. Adentro encontrarás un archivo con extensión `.apk` listo para enviar por WhatsApp e instalar en cualquier celular.

### Método B: Usando Capacitor (Para desarrolladores locales)
Si deseas integrarlo directamente usando código en tu computadora:
1. Abre una terminal de comandos en la carpeta de la app y escribe:
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli
   npx cap init "Ayllu Ariri" "com.aylluariri.app" --web-dir=.
   npm install @capacitor/android
   npx cap add android
   npx cap sync
   ```
2. Esto creará una carpeta llamada `android`. Abre esta carpeta usando el programa gratuito **Android Studio**.
3. En Android Studio, ve al menú superior: `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.
4. El programa compilará el código y te entregará el archivo `.apk` instalable.

---

## 4. Características de la aplicación incluidas en el código
- **Funcionamiento sin Conexión (Offline):** La app cachea todas las imágenes hiperrealistas, el mapa Leaflet y los textos. Si no hay internet, guarda los reportes de basura localmente y los sincroniza solos cuando recuperes la señal.
- **Accesibilidad con Voz:** Cuenta con lectura por voz de menús y chatbot, y micrófono para dictado de consultas de forma nativa.
- **Gamificación (Wiphalas Verdes):** Acumulación de medallas por reportar, jugar el clasificador de basura contra el reloj o completar el quiz sin fallar.
- **Exportación:** Exporta reportes a archivo de Excel/CSV compatible o descarga el PDF de métricas comunitarias.
