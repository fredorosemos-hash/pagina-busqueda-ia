# 🚨 Dashboard Fiscalía General de la Nación Seccional Medellín

## 🎯 Descripción del Proyecto

Sistema de análisis inteligente de datos criminales para la Fiscalía General de la Nación Seccional Medellín. Dashboard web con diseño cyberpunk que utiliza inteligencia artificial para procesar, analizar y generar informes automáticos de datos criminológicos.

## ✨ Características Principales

- 🎨 **Diseño Cyberpunk**: Interfaz futurista con colores neón y efectos visuales
- 🤖 **Análisis con IA**: Procesamiento inteligente de datos criminales
- 📊 **Visualización Avanzada**: Gráficos interactivos con Chart.js
- 📄 **Generación de Informes**: Exportación automática a formato Word
- 🔄 **Carga de CSV**: Procesamiento de archivos CSV con Papa Parse
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Visualización**: Chart.js
- **Procesamiento CSV**: Papa Parse
- **Generación de Documentos**: docx.js, FileSaver.js
- **Diseño**: CSS Grid, Flexbox, Animaciones CSS
- **Tipografías**: Orbitron, Rajdhani (Google Fonts)
- **Iconos**: Font Awesome 6

## 📂 Estructura del Proyecto

```
dashboard-fiscalia/
├── index.html              # Dashboard principal completo
├── index2.html             # Versión simplificada funcional
├── styles.css              # Estilos cyberpunk principales
├── script.js               # Lógica principal de la aplicación
├── word-export.js          # Módulo de exportación a Word
├── datos_ejemplo.csv       # Datos de prueba del sistema
├── .gitignore             # Archivos excluidos de Git
└── README.md              # Documentación del proyecto
```

## 🚀 Instalación y Uso

### Método 1: Sin Servidor (Recomendado)
1. Abre `index2.html` directamente en tu navegador
2. Haz clic en "🧪 CARGAR DATOS DE PRUEBA" para datos de ejemplo
3. O selecciona tu propio archivo CSV
4. Haz clic en "🚀 PROCESAR DATOS CON IA"

### Método 2: Con Servidor Local
```bash
# Navegar al directorio
cd dashboard-fiscalia

# Iniciar servidor Python
python -m http.server 8080

# Abrir en navegador
http://localhost:8080
```

## 📊 Funcionalidades del Dashboard

### 1. Carga de Datos
- ✅ Selección manual de archivos CSV
- ✅ Datos de prueba embebidos
- ✅ Validación automática de formato
- ✅ Feedback visual en tiempo real

### 2. Análisis de IA
- 📈 Estadísticas automáticas
- 🎯 Identificación de patrones
- 🏙️ Análisis por ciudades
- 📅 Tendencias temporales
- 🚨 Clasificación de delitos

### 3. Visualización
- 📊 Gráfico de barras por ciudad
- 📈 Tendencia temporal
- 🍕 Distribución de tipos de delito
- 📅 Análisis mensual

### 4. Generación de Informes
- 📄 Exportación a formato Word
- 📋 Tablas de datos estructuradas
- 🎨 Formato institucional
- 💾 Descarga automática

## 🎨 Características de Diseño

- **Colores Neón**: Cian (#00ffff), Verde (#00ff41), Rosa (#ff0080)
- **Tipografías**: Orbitron (títulos), Rajdhani (contenido)
- **Efectos**: Sombras neón, animaciones suaves, efectos de escritura
- **Layout**: CSS Grid responsivo, tarjetas con backdrop-filter

## 📋 Formato de Datos CSV

El sistema espera archivos CSV con la siguiente estructura:
```csv
delito,ciudad,fecha,cantidad,departamento
Hurto a personas,Medellín,2024-01-15,25,Antioquia
Homicidio,Bello,2024-01-15,3,Antioquia
```

### Columnas Requeridas:
- `delito`: Tipo de delito
- `ciudad`: Ciudad donde ocurrió
- `fecha`: Fecha del registro (YYYY-MM-DD)
- `cantidad`: Número de casos
- `departamento`: Departamento (opcional)

## 🔧 Configuración de Desarrollo

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge)
- Python 3.x (para servidor local opcional)
- Conexión a internet (para CDNs)

### Variables CSS Principales
```css
--neon-cyan: #00ffff
--neon-green: #00ff41
--neon-pink: #ff0080
--bg-primary: #0a0a0f
--font-primary: 'Orbitron', monospace
```

## 🐛 Solución de Problemas

### ❓ El CSV no se carga
- Verifica que el archivo tenga extensión `.csv`
- Usa el botón de "Datos de Prueba" primero
- Revisa la consola del navegador (F12)

### ❓ Los gráficos no aparecen
- Verifica conexión a internet (Chart.js CDN)
- Comprueba que haya datos cargados
- Revisa errores en la consola

### ❓ La exportación no funciona
- Verifica que docx.js esté cargado
- Comprueba que haya datos procesados
- Prueba en un navegador diferente

## 📱 Soporte de Navegadores

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📄 Licencia

Este proyecto está desarrollado para uso exclusivo de la Fiscalía General de la Nación Seccional Medellín.

## 🤝 Contribuciones

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📞 Contacto

Desarrollado para la Fiscalía General de la Nación Seccional Medellín
Sistema de Análisis Inteligente de Datos Criminales

---
**⚡ Dashboard Fiscalía - Análisis Inteligente de Datos Criminales ⚡**