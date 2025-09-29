# 🚨 Dashboard Fiscalía Medellín - Streamlit App

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/fredorosemos-hash/dashboard-fiscalia-medellin/main/app.py)

## 🚀 Aplicación Web Desplegada

Esta es la versión web del Dashboard de la Fiscalía General de la Nación Seccional Medellín, desplegada en Streamlit Cloud.

## ✨ Características

- 🎨 **Diseño Cyberpunk**: Interfaz futurista con colores neón
- 🤖 **Análisis con IA**: Procesamiento inteligente de datos criminales
- 📊 **Visualizaciones Interactivas**: Gráficos dinámicos con Plotly
- 📄 **Generación de Informes**: Exportación automática a formato Word
- 🔄 **Carga de Datos**: Procesamiento de archivos CSV en tiempo real
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos

## 🛠️ Tecnologías

- **Streamlit**: Framework web para Python
- **Pandas**: Análisis y manipulación de datos
- **Plotly**: Visualizaciones interactivas
- **Python-docx**: Generación de documentos Word
- **CSS personalizado**: Estilos cyberpunk

## 🚀 Ejecutar Localmente

```bash
# Clonar repositorio
git clone https://github.com/fredorosemos-hash/dashboard-fiscalia-medellin.git
cd dashboard-fiscalia-medellin

# Crear entorno virtual
python -m venv fiscalia_env
fiscalia_env\Scripts\activate  # Windows
# source fiscalia_env/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar aplicación
streamlit run app.py
```

## 📊 Formato de Datos

La aplicación espera archivos CSV con estas columnas:

- `delito`: Tipo de delito
- `ciudad`: Ciudad donde ocurrió  
- `fecha`: Fecha del registro (YYYY-MM-DD)
- `cantidad`: Número de casos
- `departamento`: Departamento

## 🌐 Despliegue en Streamlit Cloud

La aplicación está configurada para desplegarse automáticamente en Streamlit Cloud cuando se hace push al repositorio de GitHub.

## 📱 Uso de la Aplicación

1. **Cargar Datos**: Usa datos de ejemplo o sube tu archivo CSV
2. **Análisis Automático**: La IA procesa los datos instantáneamente
3. **Visualización**: Explora gráficos interactivos
4. **Insights**: Revisa análisis y recomendaciones
5. **Informe**: Descarga reporte completo en Word

## 🔧 Configuración

El archivo `.streamlit/config.toml` contiene la configuración del tema cyberpunk y ajustes del servidor.

---

⚡ **Desarrollado para la Fiscalía General de la Nación Seccional Medellín** ⚡