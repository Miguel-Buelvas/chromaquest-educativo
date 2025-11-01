# 🎨 ChromaQuest: El Mundo sin Color

Un juego educativo y divertido para niños de 10 a 14 años que combina entretenimiento y aprendizaje sobre colores, creatividad y resolución de problemas.

## 🎯 Características

### 🎮 Mecánicas de Juego
- **10 niveles únicos** con diferentes desafíos
- **Secuencias de colores** - Juego de memoria visual
- **Mezcla de colores** - Aprendizaje de teoría del color
- **Laberintos** - Resolución de problemas espaciales
- **Puzzles de formas** - Coordinación ojo-mano
- **Juego de ritmo** - Coordinación y timing

### 🎨 Diseño Visual
- **Interfaz elegante** con diseño flat y animaciones suaves
- **Colores vibrantes** pero no saturados
- **Tipografía legible** (Nunito/Poppins)
- **Feedback visual** inmediato y gratificante
- **Diseño responsive** para tablets y móviles

### 🔊 Audio
- **Efectos de sonido** generados dinámicamente
- **Feedback auditivo** para acciones del jugador
- **Voz en off opcional** en español
- **Controles de volumen** independientes

### ♿ Accesibilidad
- **Modo daltónico** con símbolos adicionales
- **Textos grandes** y legibles
- **Interfaz intuitiva** sin texto complejo
- **Sin micropagos** ni publicidad intrusiva
- **Sin conexión a internet** requerida

## 🚀 Cómo Jugar

### Objetivo
Ayuda a Lúa a restaurar los colores del mundo mágico que fueron robados por el Rey Gris. Cada nivel que completes devolverá un color al mundo.

### Controles
- **Tocar**: Seleccionar colores y opciones
- **Arrastrar**: Mezclar colores en el nivel 2
- **Mantener**: Interacciones especiales
- **Flechas**: Navegar por el laberinto (nivel 3)

### Niveles

| Nivel | Nombre | Mecánica | Color Restaurado |
|-------|--------|----------|------------------|
| 1 | El Bosque Gris | Secuencia de colores | Verde |
| 2 | El Lago Oscuro | Mezcla de colores | Azul |
| 3 | El Desierto Sin Sol | Laberinto | Rojo |
| 4 | La Montaña de Sombras | Puzzle de formas | Naranja |
| 5 | El Valle del Ritmo | Minijuego musical | Morado |
| 6 | El Cielo Sin Arcoíris | Combinación de colores | Amarillo |
| 7 | El Castillo de Cristal | Memoria visual | Rosa |
| 8 | El Templo del Tiempo | Puzzles con tiempo | Turquesa |
| 9 | El Laberinto de Espejos | Reflejos y color | Blanco |
| 10 | El Trono del Rey Gris | Boss final | Arcoíris |

## 🛠️ Tecnología

### Stack Tecnológico
- **HTML5** - Estructura y semántica
- **CSS3** - Estilos y animaciones
- **JavaScript ES6+** - Lógica del juego
- **Web Audio API** - Sistema de sonido
- **Canvas API** - Gráficos y efectos
- **LocalStorage** - Guardado de progreso
- **Web Speech API** - Voz en off

### Librerías Utilizadas
- **Anime.js** - Animaciones suaves
- **Typed.js** - Efectos de escritura
- **Splitting.js** - Animaciones de texto

### Características Técnicas
- **Responsive Design** - Adaptable a cualquier pantalla
- **Touch Optimized** - Optimizado para dispositivos táctiles
- **Progressive Enhancement** - Funciona sin JavaScript avanzado
- **Offline Capable** - Puede funcionar sin conexión
- **Performance Optimized** - 60 FPS constantes

## 📱 Instalación

### Como PWA (Progressive Web App)
1. Abrir el juego en un navegador compatible
2. Hacer clic en "Instalar" cuando aparezca el prompt
3. El juego se instalará como una aplicación nativa

### Como APK Android
Ver el archivo [`CONVERSION_APK.md`](CONVERSION_APK.md) para instrucciones detalladas.

### Desde código fuente
1. Clonar o descargar los archivos
2. Abrir `index.html` en un navegador web
3. ¡Listo para jugar!

## 🎯 Requisitos del Sistema

### Navegadores Compatibles
- **Chrome** 60+
- **Firefox** 55+
- **Safari** 11+
- **Edge** 79+

### Dispositivos
- **Android** 7.0+
- **iOS** 11+
- **Tablets** y **smartphones**
- **Desktop** (para desarrollo)

### Requisitos Técnicos
- **JavaScript habilitado**
- **LocalStorage** disponible
- **Touch events** (para móviles)
- **Web Audio API** (para sonido)

## 🎮 Personalización

### Colores y Temas
Los colores pueden ser personalizados modificando las variables CSS en el archivo `index.html`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ff6b6b;
  --text-color: #ffffff;
}
```

### Sonidos
Los sonidos pueden ser reemplazados modificando el método `playSound()` en `game.js` para usar archivos de audio reales.

### Niveles Adicionales
Nuevos niveles pueden ser agregados extendiendo el array `levels` y creando las funciones correspondientes.

## 🔧 Desarrollo

### Estructura de Archivos
```
chromaquest/
├── index.html          # Archivo principal HTML
├── game.js             # Lógica del juego
├── manifest.json       # Para PWA (opcional)
├── sw.js              # Service Worker (opcional)
├── CONVERSION_APK.md   # Guía de conversión a APK
└── README.md          # Este archivo
```

### Scripts de Desarrollo
```bash
# Servir localmente
python -m http.server 8000
# o
npx serve .

# Construir para producción
# (minificar archivos, optimizar imágenes, etc.)
```

### Debugging
- Usar las herramientas de desarrollo del navegador
- Verificar la consola para errores
- Probar en múltiples dispositivos
- Monitorear el rendimiento

## 🎨 Recursos

### Iconos y Gráficos
El juego usa emojis y CSS para crear gráficos vectoriales escalables. Para una experiencia más personalizada, se pueden reemplazar con:
- Iconos SVG personalizados
- Spritesheets para animaciones
- Imágenes PNG/JPEG para fondos

### Fuentes
- **Nunito** - Para textos principales
- **Poppins** - Para botones y títulos
- Se pueden cambiar en el `<head>` del HTML

## 📊 Analytics

El juego incluye hooks para integrar sistemas de analytics:

```javascript
// Ejemplo con Google Analytics
gtag('event', 'level_complete', {
  'level': game.currentLevel,
  'score': game.score,
  'time_spent': tiempo_en_nivel
});
```

### Métricas Recomendadas
- Niveles completados
- Tiempo de juego promedio
- Colores desbloqueados
- Errores y fallos
- Retención de usuarios

## 🔒 Seguridad y Privacidad

### Política de Privacidad
El juego:
- ✅ **No recopila** datos personales
- ✅ **No usa** cookies de seguimiento
- ✅ **No requiere** registro
- ✅ **Funciona offline**
- ✅ **No tiene** anuncios

### Seguridad
- Validación de entrada de usuario
- Sin ejecución de código remoto
- Uso de HTTPS recomendado
- Sin dependencias externas vulnerables

## 🤝 Contribuir

### Cómo Contribuir
1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crear un Pull Request

### Áreas de Contribución
- Nuevos niveles y mecánicas
- Mejoras de accesibilidad
- Optimización de rendimiento
- Traducciones
- Tests y documentación

## 📄 Licencia

Este proyecto es de código abierto. Se permite:
- ✅ Uso educativo
- ✅ Modificación
- ✅ Distribución
- ✅ Uso comercial (con atribución)

## 🙏 Agradecimientos

- **Librerías open source** utilizadas
- **Comunidad de desarrollo web**
- **Educadores** que inspiran juegos educativos
- **Niños y niñas** que prueban y disfrutan

## 📞 Soporte

### Problemas Comunes
- **Juego no carga**: Verificar JavaScript habilitado
- **Sonidos no funcionan**: Verificar Web Audio API
- **Problemas de rendimiento**: Probar en navegador actualizado
- **Errores de touch**: Verificar eventos táctiles

### Contacto
Para soporte técnico o consultas sobre el juego:
- Crear un issue en el repositorio
- Documentar el problema detalladamente
- Incluir navegador y dispositivo usado

---

**¡Disfruta restaurando colores al mundo mágico de ChromaQuest!** 🌈✨

*"La creatividad es la inteligencia divirtiéndose"* - Albert Einstein