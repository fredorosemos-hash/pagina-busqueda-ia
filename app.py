import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import io
from docx import Document
from docx.shared import Inches
import base64

# ===================================
# CONFIGURACIÓN DE LA PÁGINA
# ===================================
st.set_page_config(
    page_title="🚨 Dashboard Fiscalía Medellín",
    page_icon="🚨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ===================================
# CSS PERSONALIZADO - ESTILO CYBERPUNK
# ===================================
st.markdown("""
<style>
    /* Importar fuentes */
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
    
    /* Variables CSS */
    :root {
        --neon-cyan: #00ffff;
        --neon-green: #00ff41;
        --neon-pink: #ff0080;
        --neon-blue: #0080ff;
        --bg-primary: #0a0a0f;
        --bg-secondary: #1a1a2e;
        --text-primary: #ffffff;
    }
    
    /* Fondo principal */
    .stApp {
        background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
        color: var(--text-primary);
    }
    
    /* Títulos principales */
    .main-title {
        font-family: 'Orbitron', monospace;
        color: var(--neon-cyan);
        text-align: center;
        font-size: 2.5rem;
        font-weight: 900;
        text-shadow: 0 0 20px var(--neon-cyan);
        margin-bottom: 0.5rem;
    }
    
    .subtitle {
        font-family: 'Rajdhani', sans-serif;
        color: var(--neon-green);
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 2rem;
    }
    
    /* Métricas personalizadas */
    .metric-card {
        background: rgba(26, 26, 46, 0.8);
        border: 1px solid var(--neon-cyan);
        border-radius: 10px;
        padding: 1rem;
        margin: 0.5rem;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        backdrop-filter: blur(10px);
    }
    
    /* Sidebar personalizado */
    .css-1d391kg {
        background: rgba(26, 26, 46, 0.9);
        border-right: 2px solid var(--neon-cyan);
    }
    
    /* Botones */
    .stButton > button {
        background: linear-gradient(45deg, var(--neon-green), #00ff88);
        color: #000;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        font-family: 'Rajdhani', sans-serif;
        box-shadow: 0 4px 20px rgba(0, 255, 65, 0.3);
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 255, 65, 0.5);
    }
    
    /* Alertas y mensajes */
    .success-message {
        background: rgba(0, 255, 65, 0.1);
        border: 1px solid var(--neon-green);
        border-radius: 8px;
        padding: 1rem;
        color: var(--neon-green);
        margin: 1rem 0;
    }
    
    .error-message {
        background: rgba(255, 0, 128, 0.1);
        border: 1px solid var(--neon-pink);
        border-radius: 8px;
        padding: 1rem;
        color: var(--neon-pink);
        margin: 1rem 0;
    }
    
    /* Ocultar elementos de Streamlit */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display:none;}
</style>
""", unsafe_allow_html=True)

# ===================================
# FUNCIONES AUXILIARES
# ===================================

def load_sample_data():
    """Carga datos de ejemplo para demostración"""
    data = {
        'delito': ['Hurto a personas', 'Homicidio', 'Extorsión', 'Hurto a residencias', 'Lesiones personales',
                  'Hurto a personas', 'Homicidio', 'Extorsión', 'Hurto a residencias', 'Lesiones personales',
                  'Violencia intrafamiliar', 'Hurto a comercio', 'Hurto a personas', 'Homicidio', 'Extorsión',
                  'Hurto a residencias', 'Lesiones personales', 'Violencia intrafamiliar', 'Hurto a comercio', 'Estafa',
                  'Hurto a personas', 'Homicidio', 'Extorsión', 'Hurto a residencias', 'Lesiones personales',
                  'Violencia intrafamiliar', 'Hurto a comercio', 'Estafa', 'Narcotráfico', 'Hurto a vehículos'],
        'ciudad': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta',
                  'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta',
                  'Medellín', 'Bello', 'Medellín', 'Bello', 'Itagüí',
                  'Envigado', 'Sabaneta', 'Medellín', 'Bello', 'Medellín',
                  'Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta',
                  'Medellín', 'Bello', 'Medellín', 'Medellín', 'Bello'],
        'fecha': ['2024-01-15', '2024-01-15', '2024-01-15', '2024-01-15', '2024-01-15',
                 '2024-02-15', '2024-02-15', '2024-02-15', '2024-02-15', '2024-02-15',
                 '2024-02-15', '2024-02-15', '2024-03-15', '2024-03-15', '2024-03-15',
                 '2024-03-15', '2024-03-15', '2024-03-15', '2024-03-15', '2024-03-15',
                 '2024-04-15', '2024-04-15', '2024-04-15', '2024-04-15', '2024-04-15',
                 '2024-04-15', '2024-04-15', '2024-04-15', '2024-04-15', '2024-04-15'],
        'cantidad': [25, 3, 8, 12, 15, 28, 4, 12, 10, 18, 22, 9, 35, 2, 15, 14, 20, 25, 11, 18,
                    32, 5, 10, 16, 19, 28, 13, 21, 7, 6],
        'departamento': ['Antioquia'] * 30
    }
    return pd.DataFrame(data)

def analyze_data_with_ai(df):
    """Simula análisis con IA de los datos criminales"""
    if df.empty:
        return {}
    
    # Estadísticas básicas
    total_records = len(df)
    total_crimes = df['delito'].nunique()
    total_cities = df['ciudad'].nunique()
    total_cases = df['cantidad'].sum()
    
    # Análisis de patrones
    most_frequent_crime = df.groupby('delito')['cantidad'].sum().idxmax()
    most_affected_city = df.groupby('ciudad')['cantidad'].sum().idxmax()
    
    # Análisis temporal
    df['fecha'] = pd.to_datetime(df['fecha'])
    monthly_trend = df.groupby(df['fecha'].dt.to_period('M'))['cantidad'].sum()
    trend_direction = "creciente" if monthly_trend.iloc[-1] > monthly_trend.iloc[0] else "decreciente"
    
    # Insights avanzados
    crime_diversity = df.groupby('ciudad')['delito'].nunique()
    high_diversity_city = crime_diversity.idxmax()
    
    return {
        'total_records': total_records,
        'total_crimes': total_crimes,
        'total_cities': total_cities,
        'total_cases': total_cases,
        'most_frequent_crime': most_frequent_crime,
        'most_affected_city': most_affected_city,
        'trend_direction': trend_direction,
        'high_diversity_city': high_diversity_city,
        'monthly_trend': monthly_trend
    }

def create_visualizations(df):
    """Crea visualizaciones con Plotly"""
    if df.empty:
        return None, None, None, None
    
    # Gráfico 1: Delitos por Ciudad
    city_crimes = df.groupby('ciudad')['cantidad'].sum().reset_index()
    fig1 = px.bar(city_crimes, x='ciudad', y='cantidad', 
                  title='Delitos por Ciudad',
                  color='cantidad',
                  color_continuous_scale='Viridis')
    fig1.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#ffffff',
        title_font_color='#00ffff',
        title_x=0.5
    )
    
    # Gráfico 2: Tendencia Temporal
    df['fecha'] = pd.to_datetime(df['fecha'])
    temporal = df.groupby('fecha')['cantidad'].sum().reset_index()
    fig2 = px.line(temporal, x='fecha', y='cantidad',
                   title='Tendencia Temporal de Delitos',
                   markers=True)
    fig2.update_traces(line_color='#00ff41', marker_color='#00ff41')
    fig2.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#ffffff',
        title_font_color='#00ffff',
        title_x=0.5
    )
    
    # Gráfico 3: Tipos de Delitos
    crime_types = df.groupby('delito')['cantidad'].sum().reset_index()
    fig3 = px.pie(crime_types, values='cantidad', names='delito',
                  title='Distribución por Tipo de Delito')
    fig3.update_traces(textfont_color='#ffffff')
    fig3.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#ffffff',
        title_font_color='#00ffff',
        title_x=0.5
    )
    
    # Gráfico 4: Heatmap Mensual
    df['mes'] = df['fecha'].dt.month
    df['año'] = df['fecha'].dt.year
    heatmap_data = df.groupby(['año', 'mes'])['cantidad'].sum().unstack(fill_value=0)
    fig4 = px.imshow(heatmap_data, 
                     title='Mapa de Calor - Delitos por Mes',
                     color_continuous_scale='Viridis')
    fig4.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#ffffff',
        title_font_color='#00ffff',
        title_x=0.5
    )
    
    return fig1, fig2, fig3, fig4

def generate_word_report(df, analysis):
    """Genera reporte en formato Word"""
    doc = Document()
    
    # Título principal
    title = doc.add_heading('INFORME DE ANÁLISIS CRIMINAL', 0)
    title_format = title.runs[0]
    title_format.font.name = 'Arial'
    
    # Subtítulo
    subtitle = doc.add_heading('Fiscalía General de la Nación - Seccional Medellín', level=1)
    
    # Información general
    doc.add_paragraph(f"Fecha de generación: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    doc.add_paragraph(f"Total de registros analizados: {analysis.get('total_records', 0)}")
    
    # Estadísticas principales
    doc.add_heading('ESTADÍSTICAS PRINCIPALES', level=2)
    doc.add_paragraph(f"• Total de casos: {analysis.get('total_cases', 0)}")
    doc.add_paragraph(f"• Tipos de delitos: {analysis.get('total_crimes', 0)}")
    doc.add_paragraph(f"• Ciudades analizadas: {analysis.get('total_cities', 0)}")
    
    # Insights principales
    doc.add_heading('ANÁLISIS DE INTELIGENCIA ARTIFICIAL', level=2)
    doc.add_paragraph(f"• Delito más frecuente: {analysis.get('most_frequent_crime', 'N/A')}")
    doc.add_paragraph(f"• Ciudad más afectada: {analysis.get('most_affected_city', 'N/A')}")
    doc.add_paragraph(f"• Tendencia temporal: {analysis.get('trend_direction', 'N/A')}")
    
    # Guardar en memoria
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer

# ===================================
# INTERFAZ PRINCIPAL
# ===================================

def main():
    # Header principal
    st.markdown('<h1 class="main-title">🚨 DASHBOARD FISCALÍA GENERAL DE LA NACIÓN</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">SECCIONAL MEDELLÍN - ANÁLISIS INTELIGENTE DE DATOS CRIMINALES</p>', unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.markdown("## 🔧 PANEL DE CONTROL")
        
        # Opción de carga de datos
        data_option = st.radio(
            "Selecciona la fuente de datos:",
            ["📊 Datos de Ejemplo", "📁 Cargar Archivo CSV"]
        )
        
        # Inicializar datos
        df = pd.DataFrame()
        
        if data_option == "📊 Datos de Ejemplo":
            if st.button("🧪 CARGAR DATOS DE PRUEBA"):
                df = load_sample_data()
                st.success("✅ Datos de ejemplo cargados correctamente!")
                st.session_state['data'] = df
        
        elif data_option == "📁 Cargar Archivo CSV":
            uploaded_file = st.file_uploader(
                "Selecciona tu archivo CSV:",
                type=['csv'],
                help="El archivo debe contener columnas: delito, ciudad, fecha, cantidad, departamento"
            )
            
            if uploaded_file is not None:
                try:
                    df = pd.read_csv(uploaded_file)
                    st.success(f"✅ Archivo cargado: {uploaded_file.name}")
                    st.success(f"📊 {len(df)} registros encontrados")
                    st.session_state['data'] = df
                except Exception as e:
                    st.error(f"❌ Error al cargar archivo: {str(e)}")
    
    # Usar datos de la sesión si existen
    if 'data' in st.session_state:
        df = st.session_state['data']
    
    # Mostrar contenido principal
    if not df.empty:
        # Análisis con IA
        with st.spinner("🤖 Analizando datos con Inteligencia Artificial..."):
            analysis = analyze_data_with_ai(df)
        
        # Métricas principales
        st.markdown("## 📊 ESTADÍSTICAS PRINCIPALES")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                label="📋 Registros Totales",
                value=analysis.get('total_records', 0),
                delta=None
            )
        
        with col2:
            st.metric(
                label="🚨 Tipos de Delitos",
                value=analysis.get('total_crimes', 0),
                delta=None
            )
        
        with col3:
            st.metric(
                label="🏙️ Ciudades",
                value=analysis.get('total_cities', 0),
                delta=None
            )
        
        with col4:
            st.metric(
                label="📈 Total de Casos",
                value=analysis.get('total_cases', 0),
                delta=None
            )
        
        # Visualizaciones
        st.markdown("## 📈 VISUALIZACIÓN DE DATOS")
        
        fig1, fig2, fig3, fig4 = create_visualizations(df)
        
        col1, col2 = st.columns(2)
        with col1:
            st.plotly_chart(fig1, use_container_width=True)
            st.plotly_chart(fig3, use_container_width=True)
        
        with col2:
            st.plotly_chart(fig2, use_container_width=True)
            st.plotly_chart(fig4, use_container_width=True)
        
        # Insights de IA
        st.markdown("## 🤖 ANÁLISIS DE INTELIGENCIA ARTIFICIAL")
        
        insights_container = st.container()
        with insights_container:
            st.markdown(f"""
            <div class="success-message">
                <h3>🎯 INSIGHTS PRINCIPALES:</h3>
                <ul>
                    <li><strong>Delito más frecuente:</strong> {analysis.get('most_frequent_crime', 'N/A')}</li>
                    <li><strong>Ciudad más afectada:</strong> {analysis.get('most_affected_city', 'N/A')}</li>
                    <li><strong>Tendencia temporal:</strong> Patrón {analysis.get('trend_direction', 'N/A')}</li>
                    <li><strong>Ciudad con mayor diversidad criminal:</strong> {analysis.get('high_diversity_city', 'N/A')}</li>
                </ul>
                
                <h3>📋 RECOMENDACIONES:</h3>
                <ul>
                    <li>Reforzar seguridad en {analysis.get('most_affected_city', 'las principales ciudades')}</li>
                    <li>Implementar estrategias específicas para {analysis.get('most_frequent_crime', 'los delitos más comunes')}</li>
                    <li>Monitorear la tendencia {analysis.get('trend_direction', 'actual')} de los casos</li>
                </ul>
            </div>
            """, unsafe_allow_html=True)
        
        # Tabla de datos
        st.markdown("## 📋 TABLA DE DATOS")
        st.dataframe(df, use_container_width=True)
        
        # Generación de reporte
        st.markdown("## 📄 GENERACIÓN DE INFORME")
        
        if st.button("🚀 GENERAR INFORME COMPLETO"):
            with st.spinner("Generando informe en formato Word..."):
                report_buffer = generate_word_report(df, analysis)
                
                st.download_button(
                    label="📥 DESCARGAR INFORME WORD",
                    data=report_buffer,
                    file_name=f"informe_fiscalia_{datetime.now().strftime('%Y%m%d_%H%M')}.docx",
                    mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
                
                st.success("✅ Informe generado exitosamente!")
    
    else:
        # Estado inicial sin datos
        st.markdown("""
        <div style="text-align: center; padding: 3rem;">
            <h2>🚀 BIENVENIDO AL SISTEMA DE ANÁLISIS</h2>
            <p>Para comenzar, selecciona una opción en el panel lateral:</p>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                <li>🧪 Cargar datos de ejemplo para una demostración</li>
                <li>📁 Subir tu propio archivo CSV</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #00ffff; font-family: 'Rajdhani', sans-serif;">
        <p>⚡ Dashboard Fiscalía - Sistema de Análisis Inteligente de Datos Criminales ⚡</p>
        <p>Desarrollado con 🤖 Inteligencia Artificial para la Fiscalía General de la Nación Seccional Medellín</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()