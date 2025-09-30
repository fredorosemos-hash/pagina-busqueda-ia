# 🚀 Guía de Despliegue en Streamlit Cloud

## 📋 Pasos para Publicar en Streamlit.io

### 1. Verificar Repositorio GitHub ✅
- Tu repositorio ya está configurado en: https://github.com/fredorosemos-hash/pagina-busqueda-ia
- Los archivos necesarios ya están subidos

### 2. Acceder a Streamlit Cloud
1. Ve a [https://streamlit.io/cloud](https://streamlit.io/cloud)
2. Haz clic en "Sign up" o "Sign in"
3. Usa tu cuenta de GitHub para iniciar sesión

### 3. Conectar tu Repositorio
1. En Streamlit Cloud, haz clic en "New app"
2. Selecciona "From existing repo"
3. Autoriza el acceso a tu repositorio GitHub
4. Selecciona:
   - **Repository**: `fredorosemos-hash/pagina-busqueda-ia`
   - **Branch**: `main`
   - **Main file path**: `app.py`

### 4. Configurar Despliegue
- **App name**: Puedes usar `fiscalia-dashboard-ia` o el nombre que prefieras
- **URL**: Se generará automáticamente como `https://tu-app-name.streamlit.app`

### 5. Deploy
1. Haz clic en "Deploy!"
2. Streamlit Cloud instalará automáticamente las dependencias desde `requirements.txt`
3. El proceso puede tomar 2-5 minutos

## 📁 Archivos Configurados para Streamlit Cloud

✅ **requirements.txt** - Dependencias actualizadas:
```
streamlit==1.50.0
pandas==2.3.3
plotly==5.17.0
python-docx==0.8.11
openpyxl==3.1.2
numpy==2.3.3
```

✅ **.streamlit/config.toml** - Tema cyberpunk:
```toml
[theme]
base = "dark"
primaryColor = "#00ffff"
backgroundColor = "#0a0a0f"
secondaryBackgroundColor = "#1a1a2e"
textColor = "#ffffff"

[server]
headless = true
enableCORS = false
```

✅ **app.py** - Aplicación principal con:
- Análisis AI de 4 tipos especializados
- Interfaz cyberpunk mejorada
- Visualizaciones interactivas con Plotly
- Generación de informes Word de 40+ páginas

## 🎯 Características de la App Desplegada

### 🤖 Análisis AI Avanzado
- **Análisis Contextual**: Contexto socioeconómico y causas
- **Evaluación de Impacto**: Consecuencias en la comunidad
- **Escenarios Predictivos**: Proyecciones futuras
- **Recomendaciones Estratégicas**: Planes de acción

### 🎨 Interfaz Cyberpunk
- Tema oscuro con colores neón
- Métricas destacadas con efectos visuales
- Gráficos interactivos coordinados
- Diseño responsive optimizado

### 📊 Funcionalidades
- Carga de archivos CSV
- Procesamiento de datos en tiempo real
- Visualizaciones dinámicas
- Exportación de informes profesionales

## 🔗 Enlaces Importantes

- **Repositorio GitHub**: https://github.com/fredorosemos-hash/pagina-busqueda-ia
- **Streamlit Cloud**: https://streamlit.io/cloud
- **Documentación Streamlit**: https://docs.streamlit.io/

## 🚨 Solución de Problemas

### Error de Dependencias
Si hay errores de instalación:
1. Verifica que `requirements.txt` tenga las versiones correctas
2. Revisa los logs en Streamlit Cloud
3. Asegúrate de que no hay conflictos de versiones

### Error de Archivos
Si no encuentra archivos:
1. Confirma que `app.py` está en la raíz del repositorio
2. Verifica que los archivos CSV están incluidos
3. Revisa las rutas en el código

### Performance
- La app puede tardar unos segundos en cargar inicialmente
- El análisis AI puede tomar 10-30 segundos dependiendo del volumen de datos
- Las visualizaciones se optimizan automáticamente

## 📞 Soporte

Para problemas técnicos:
1. Revisa los logs en Streamlit Cloud
2. Consulta la documentación oficial
3. Verifica la configuración del repositorio

¡Tu dashboard está listo para ser publicado! 🎉