# ChromaQuest - Conversión a APK

## 📱 Cómo convertir ChromaQuest a una aplicación Android APK

### Opción 1: Progressive Web App (PWA) - RECOMENDADA

#### Ventajas:
- ✅ No requiere tienda de aplicaciones
- ✅ Se puede instalar directamente
- ✅ Actualizaciones automáticas
- ✅ Funciona sin conexión
- ✅ Compatible con Android 7.0+

#### Pasos para convertir a PWA:

1. **Agregar el archivo `manifest.json`:**
```json
{
  "name": "ChromaQuest: El Mundo sin Color",
  "short_name": "ChromaQuest",
  "description": "Juego educativo para niños de 10-14 años sobre colores y creatividad",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#667eea",
  "background_color": "#764ba2",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Agregar el Service Worker (`sw.js`):**
```javascript
const CACHE_NAME = 'chromaquest-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

3. **Modificar el `index.html` para incluir:**
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#667eea">
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
</script>
```

### Opción 2: WebView Wrapper (Cordova/Capacitor)

#### Usando Apache Cordova:

1. **Instalar Cordova:**
```bash
npm install -g cordova
```

2. **Crear proyecto:**
```bash
cordova create chromaquest-app com.tuempresa.chromaquest ChromaQuest
cd chromaquest-app
```

3. **Agregar plataforma Android:**
```bash
cordova platform add android
```

4. **Copiar archivos del juego:**
- Copiar `index.html` → `www/index.html`
- Copiar `game.js` → `www/game.js`
- Crear iconos en `www/`

5. **Configurar `config.xml`:**
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.tuempresa.chromaquest" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>ChromaQuest</name>
    <description>El Mundo sin Color</description>
    <author email="contacto@tuempresa.com" href="https://tuempresa.com">Tu Empresa</author>
    <content src="index.html" />
    <access origin="*" />
    <preference name="orientation" value="portrait" />
    <preference name="Fullscreen" value="true" />
    <preference name="target-device" value="universal" />
    <preference name="webviewbounce" value="false" />
</widget>
```

6. **Construir APK:**
```bash
cordova build android --release
```

#### Usando Capacitor (Ionic):

1. **Instalar Capacitor:**
```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. **Inicializar Capacitor:**
```bash
npx cap init chromaquest com.tuempresa.chromaquest --web-dir=www
```

3. **Agregar Android:**
```bash
npx cap add android
```

4. **Copiar archivos a `www/`**

5. **Sincronizar y construir:**
```bash
npx cap sync android
npx cap open android
```

### Opción 3: Herramientas Online

#### PWABuilder:
1. Visitar [pwabuilder.com](https://www.pwabuilder.com)
2. Ingresar la URL del juego
3. Descargar el paquete Android
4. Seguir las instrucciones de instalación

#### Bubblewrap:
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://tusitio.com/manifest.json
bubblewrap build
```

## 📋 Requisitos para Google Play Store

### Archivos necesarios:
1. **APK firmado** (ver instrucciones abajo)
2. **Archivo AAB** (Android App Bundle)
3. **Icono 512x512 PNG**
4. **Capturas de pantalla** (mínimo 5)
5. **Descripción del juego**

### Firmar el APK:

1. **Generar keystore:**
```bash
keytool -genkey -v -keystore chromaquest.keystore -alias chromaquest -keyalg RSA -keysize 2048 -validity 10000
```

2. **Firmar APK:**
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore chromaquest.keystore app-release-unsigned.apk chromaquest
```

3. **Optimizar APK:**
```bash
zipalign -v 4 app-release-unsigned.apk ChromaQuest.apk
```

## 🎨 Recursos gráficos necesarios

### Iconos:
- **512x512 px** - Icono principal para Google Play
- **192x192 px** - Icono para PWA
- **144x144 px** - Icono para notificaciones

### Capturas de pantalla:
- Mínimo 5 capturas
- Resolución: 1080x1920 o 720x1280
- Formato: PNG o JPEG
- Sin bordes ni marcos de dispositivo

## 🔧 Personalización del juego

### Colores y temas:
- Modificar las variables CSS en `index.html`
- Cambiar gradientes de fondo
- Ajustar paleta de colores

### Sonidos:
- Reemplazar los sonidos sintéticos con archivos de audio reales
- Agregar música de fondo
- Implementar controles de volumen

### Niveles adicionales:
- Agregar nuevos mecanismos de juego en `game.js`
- Crear más patrones de colores
- Implementar sistema de guardado en la nube

## 📱 Optimización para móviles

### Performance:
- Minificar archivos JavaScript y CSS
- Optimizar imágenes
- Implementar lazy loading
- Usar WebP para imágenes

### UX móvil:
- Botones táctiles grandes (mínimo 44px)
- Feedback táctil inmediato
- Soporte para gestos
- Orientación vertical obligatoria

### Accesibilidad:
- Textos grandes y legibles
- Alto contraste
- Soporte para lectores de pantalla
- Modo daltónico

## 🚀 Distribución

### Google Play Store:
1. Crear cuenta de desarrollador ($25 USD)
2. Subir APK/AAB firmado
3. Completar información de la aplicación
4. Configurar precio (gratuito)
5. Publicar

### Otros canales:
- Amazon Appstore
- Samsung Galaxy Store
- Distribución directa (APK)

## 📝 Notas legales

### Política de privacidad:
El juego no recopila datos personales, pero se recomienda incluir una política de privacidad básica.

### Términos de uso:
Especificar que es un juego educativo gratuito sin compras integradas.

### Licencias:
- Verificar licencias de fuentes y recursos
- Incluir atribuciones si es necesario

## 🔍 Solución de problemas

### Problemas comunes:
1. **APK no instala**: Verificar firma y permisos
2. **Juego no carga**: Comprobar rutas de archivos
3. **Sonidos no funcionan**: Verificar Web Audio API
4. **Performance baja**: Optimizar gráficos y animaciones

### Soporte técnico:
- Probar en múltiples dispositivos
- Usar Android Studio para debugging
- Monitorear logs de errores

## 📊 Métricas y análisis

### Implementar analytics:
```javascript
// Ejemplo con Google Analytics
gtag('event', 'level_complete', {
  'level': nivel_actual,
  'score': puntuacion
});
```

### Métricas importantes:
- Tiempo de juego promedio
- Niveles completados
- Tasa de retención
- Errores y crashes

---

**¡ChromaQuest está listo para convertirse en una aplicación Android completa!** 🎨✨