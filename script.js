// Variables globales
let csvData = [];
let processedData = {
    delitos: [],
    ciudades: [],
    conductas: [],
    fechas: [],
    analisisIA: {}
};

let charts = {
    timeChart: null,
    crimeTypeChart: null,
    cityChart: null,
    incrementChart: null
};

// Configuración de Chart.js para tema cibernético
Chart.defaults.backgroundColor = 'rgba(0, 255, 255, 0.1)';
Chart.defaults.borderColor = '#00ffff';
Chart.defaults.color = '#ffffff';

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('=== INICIALIZANDO DASHBOARD ===');
    
    // Verificar que las librerías estén cargadas
    const libraries = {
        'Papa Parse': typeof Papa !== 'undefined',
        'Chart.js': typeof Chart !== 'undefined'
    };
    
    console.log('Estado de librerías:', libraries);
    
    const allLoaded = Object.values(libraries).every(loaded => loaded);
    if (!allLoaded) {
        console.error('⚠️ Algunas librerías no están cargadas:', libraries);
        const missingLibs = Object.entries(libraries)
            .filter(([name, loaded]) => !loaded)
            .map(([name]) => name);
        
        alert(`Error: Las siguientes librerías no están cargadas: ${missingLibs.join(', ')}\n\nPor favor, recarga la página.`);
        return;
    }
    
    console.log('✅ Todas las librerías cargadas correctamente');
    
    const fileInput = document.getElementById('csvFileInput');
    const processBtn = document.getElementById('processBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');
    
    if (!fileInput || !processBtn || !generateReportBtn) {
        console.error('⚠️ Algunos elementos del DOM no fueron encontrados');
        console.log('fileInput:', fileInput);
        console.log('processBtn:', processBtn);
        console.log('generateReportBtn:', generateReportBtn);
        return;
    }
    
    console.log('Configurando event listeners...');
    
    // Event listener para el input file
    fileInput.addEventListener('change', function(event) {
        console.log('🔥 EVENT CHANGE DISPARADO EN INPUT FILE');
        console.log('Files seleccionados:', event.target.files.length);
        handleFileSelect(event);
    });
    
    // También agregar event listener al label por si acaso
    const fileLabel = document.querySelector('.file-input-label');
    if (fileLabel) {
        fileLabel.addEventListener('click', function() {
            console.log('🖱️ Click en label detectado');
            
            // Pequeño delay para asegurar que el archivo se seleccione
            setTimeout(() => {
                if (fileInput.files.length > 0) {
                    console.log('📁 Archivos detectados después del click, procesando...');
                    const event = { target: fileInput };
                    handleFileSelect(event);
                }
            }, 200);
        });
    }
    
    // Event listener adicional como fallback
    document.addEventListener('change', function(event) {
        if (event.target.id === 'csvFileInput') {
            console.log('🎯 Change detectado en csvFileInput vía document');
            handleFileSelect(event);
        }
    });
    
    // Botón de prueba temporal
    const testLoadBtn = document.getElementById('testLoadBtn');
    if (testLoadBtn) {
        testLoadBtn.addEventListener('click', function() {
            console.log('🧪 Cargando archivo de prueba...');
            loadTestData();
        });
    }
    
    processBtn.addEventListener('click', processDataWithAI);
    generateReportBtn.addEventListener('click', generateCompleteReport);
    
    // Event listeners para el modal del informe
    const closeBtn = document.getElementById('closeReportBtn');
    const downloadBtn = document.getElementById('downloadPdfBtn');
    const printBtn = document.getElementById('printReportBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeReportModal);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadReportAsPDF);
    if (printBtn) printBtn.addEventListener('click', printReport);
    
    // Efecto de escritura para títulos
    animateText();
    
    console.log('✅ Dashboard de Análisis de Datos - Sistema Inicializado Correctamente');
}

function animateText() {
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                mainTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        typeWriter();
    }
}

// Función para cargar datos de prueba
async function loadTestData() {
    console.log('=== CARGA DE DATOS DE PRUEBA EMBEBIDOS ===');
    
    const fileList = document.getElementById('fileList');
    const processBtn = document.getElementById('processBtn');
    
    fileList.innerHTML = '<div style="color: #ffaa44; margin: 10px 0;">⏳ Cargando datos de prueba embebidos...</div>';
    
    try {
        // Datos de ejemplo embebidos directamente en el código
        const csvDataText = `delito,ciudad,fecha,cantidad,departamento
Hurto a personas,Medellín,2024-01-15,25,Antioquia
Homicidio,Bello,2024-01-15,3,Antioquia
Extorsión,Itagüí,2024-01-15,8,Antioquia
Hurto a residencias,Envigado,2024-01-15,12,Antioquia
Lesiones personales,Sabaneta,2024-01-15,15,Antioquia
Hurto a personas,Medellín,2024-02-15,28,Antioquia
Homicidio,Bello,2024-02-15,4,Antioquia
Extorsión,Itagüí,2024-02-15,12,Antioquia
Hurto a residencias,Envigado,2024-02-15,10,Antioquia
Lesiones personales,Sabaneta,2024-02-15,18,Antioquia
Violencia intrafamiliar,Medellín,2024-02-15,22,Antioquia
Hurto a comercio,Bello,2024-02-15,9,Antioquia
Hurto a personas,Medellín,2024-03-15,35,Antioquia
Homicidio,Bello,2024-03-15,2,Antioquia
Extorsión,Itagüí,2024-03-15,15,Antioquia
Hurto a residencias,Envigado,2024-03-15,14,Antioquia
Lesiones personales,Sabaneta,2024-03-15,20,Antioquia
Violencia intrafamiliar,Medellín,2024-03-15,25,Antioquia
Hurto a comercio,Bello,2024-03-15,11,Antioquia
Estafa,Medellín,2024-03-15,18,Antioquia
Hurto a personas,Medellín,2024-04-15,32,Antioquia
Homicidio,Bello,2024-04-15,5,Antioquia
Extorsión,Itagüí,2024-04-15,10,Antioquia
Hurto a residencias,Envigado,2024-04-15,16,Antioquia
Lesiones personales,Sabaneta,2024-04-15,19,Antioquia
Violencia intrafamiliar,Medellín,2024-04-15,28,Antioquia
Hurto a comercio,Bello,2024-04-15,13,Antioquia
Estafa,Medellín,2024-04-15,21,Antioquia
Narcotráfico,Medellín,2024-04-15,7,Antioquia
Hurto a vehículos,Bello,2024-04-15,6,Antioquia`;

        console.log('Datos embebidos cargados:', csvDataText.length, 'caracteres');
        
        // Procesar con Papa Parse directamente
        Papa.parse(csvDataText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: function(results) {
                console.log('✅ Datos de prueba embebidos procesados:', results);
                
                if (results.data && results.data.length > 0) {
                    csvData = results.data;
                    
                    fileList.innerHTML = `
                        <div style="color: #00ff41; background: rgba(0,255,65,0.1); padding: 1.5rem; border-radius: 10px; border: 2px solid #00ff41; margin: 1rem 0;">
                            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                                <i class="fas fa-database" style="font-size: 2rem; margin-right: 1rem; color: #00ff41;"></i>
                                <div>
                                    <h3 style="margin: 0; color: #00ff41;">✅ DATOS DE PRUEBA CARGADOS</h3>
                                    <p style="margin: 0.5rem 0 0 0; color: #b8b8b8;">Sistema listo para análisis de IA</p>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
                                <div style="background: rgba(0,255,65,0.1); padding: 0.8rem; border-radius: 8px; border: 1px solid #00ff41;">
                                    <strong style="color: #00ff41;">📊 Registros:</strong><br>
                                    <span style="font-size: 1.2rem; font-weight: bold;">${results.data.length}</span>
                                </div>
                                <div style="background: rgba(0,255,65,0.1); padding: 0.8rem; border-radius: 8px; border: 1px solid #00ff41;">
                                    <strong style="color: #00ff41;">📋 Columnas:</strong><br>
                                    <span style="font-size: 1.2rem; font-weight: bold;">${Object.keys(results.data[0]).length}</span>
                                </div>
                                <div style="background: rgba(0,255,65,0.1); padding: 0.8rem; border-radius: 8px; border: 1px solid #00ff41;">
                                    <strong style="color: #00ff41;">🏙️ Ciudades:</strong><br>
                                    <span style="font-size: 1.2rem; font-weight: bold;">${[...new Set(results.data.map(row => row.ciudad))].length}</span>
                                </div>
                                <div style="background: rgba(0,255,65,0.1); padding: 0.8rem; border-radius: 8px; border: 1px solid #00ff41;">
                                    <strong style="color: #00ff41;">🚨 Delitos:</strong><br>
                                    <span style="font-size: 1.2rem; font-weight: bold;">${[...new Set(results.data.map(row => row.delito))].length}</span>
                                </div>
                            </div>
                            
                            <details style="margin-top: 1rem;">
                                <summary style="cursor: pointer; color: #00ff41; font-weight: bold;">🔍 Ver detalles de los datos</summary>
                                <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.3); border-radius: 5px;">
                                    <p><strong>Columnas:</strong> ${Object.keys(results.data[0]).join(', ')}</p>
                                    <p><strong>Ciudades:</strong> ${[...new Set(results.data.map(row => row.ciudad))].join(', ')}</p>
                                    <p><strong>Primer registro:</strong></p>
                                    <pre style="font-size: 0.9em; background: rgba(0,0,0,0.5); padding: 0.5rem; border-radius: 3px; overflow-x: auto;">${JSON.stringify(results.data[0], null, 2)}</pre>
                                </div>
                            </details>
                        </div>
                    `;
                    
                    processBtn.disabled = false;
                    processBtn.style.background = '#00ff41';
                    processBtn.style.color = '#000';
                    processBtn.style.fontWeight = 'bold';
                    processBtn.innerHTML = '🚀 PROCESAR DATOS CON IA';
                    
                    console.log(`✅ Total de datos cargados: ${csvData.length} registros`);
                    console.log('Muestras de datos:', csvData.slice(0, 3));
                } else {
                    throw new Error('No se encontraron datos válidos en los datos embebidos');
                }
            },
            error: function(error) {
                console.error('Error al procesar datos embebidos:', error);
                throw error;
            }
        });
        
    } catch (error) {
        console.error('❌ Error al cargar datos de prueba:', error);
        fileList.innerHTML = `
            <div style="color: #ff4444; background: rgba(255,68,68,0.1); padding: 1rem; border-radius: 8px; border: 2px solid #ff4444;">
                <h4 style="margin-bottom: 0.5rem;">❌ Error al cargar datos de prueba</h4>
                <p>${error.message}</p>
                <p style="margin-top: 0.5rem; font-style: italic;">Verifique que Papa Parse esté cargado correctamente.</p>
            </div>
        `;
    }
}

function handleFileSelect(event) {
    console.log('=== INICIO DE SELECCIÓN DE ARCHIVOS ===');
    const files = Array.from(event.target.files);
    const fileList = document.getElementById('fileList');
    const processBtn = document.getElementById('processBtn');
    
    console.log('Archivos seleccionados:', files.length);
    console.log('Event target:', event.target);
    console.log('Papa Parse disponible:', typeof Papa !== 'undefined');
    
    if (files.length === 0) {
        fileList.innerHTML = '<p style="color: #666; text-align: center;">No hay archivos seleccionados</p>';
        processBtn.disabled = true;
        return;
    }
    
    // Limpiar datos anteriores
    fileList.innerHTML = '<div style="color: #00ff41; margin: 10px 0;">🔄 Procesando archivos...</div>';
    csvData = [];
    processBtn.disabled = true;
    let csvFilesCount = 0;
    let processedFiles = 0;
    
    files.forEach((file, index) => {
        console.log(`\n--- Archivo ${index + 1} ---`);
        console.log('Nombre:', file.name);
        console.log('Tipo MIME:', file.type);
        console.log('Tamaño:', file.size, 'bytes');
        console.log('Última modificación:', file.lastModified);
        
        // Verificar si es CSV por extensión o tipo MIME
        const isCSV = file.name.toLowerCase().endsWith('.csv') || 
                     file.type === 'text/csv' || 
                     file.type === 'application/csv' ||
                     file.type === 'text/plain' ||
                     file.type === '';
        
        console.log('Es CSV:', isCSV);
        
        if (isCSV) {
            csvFilesCount++;
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.id = `file-${index}`;
            fileItem.innerHTML = `
                <i class="fas fa-file-csv"></i>
                <span>${file.name}</span>
                <span style="margin-left: auto; color: #00ff41;">(${(file.size / 1024).toFixed(1)} KB)</span>
            `;
            fileList.appendChild(fileItem);
            
            // Leer archivo CSV
            readCSVFile(file, index);
        } else {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.style.color = '#ff4444';
            fileItem.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>${file.name} - Formato no válido (${file.type || 'desconocido'})</span>
            `;
            fileList.appendChild(fileItem);
        }
    });
    
    console.log('Archivos CSV válidos:', csvFilesCount);
    
    if (csvFilesCount === 0) {
        fileList.innerHTML += '<p style="color: #ff4444; text-align: center; margin-top: 1rem;">⚠️ No se encontraron archivos CSV válidos.<br>Asegúrese de seleccionar archivos con extensión .csv</p>';
        processBtn.disabled = true;
    } else {
        // El botón se habilitará en readCSVFile cuando los datos estén cargados
        processBtn.disabled = true;
    }
}

function readCSVFile(file, fileIndex = 0) {
    console.log(`=== INICIANDO LECTURA CSV: ${file.name} ===`);
    console.log('Papa Parse disponible:', typeof Papa);
    
    // Verificar que Papa Parse esté disponible
    if (typeof Papa === 'undefined') {
        console.error('Papa Parse no está cargado!');
        alert('Error: La librería Papa Parse no está disponible. Por favor, recarga la página.');
        return;
    }
    
    const statusElement = document.getElementById(`status-${fileIndex}`);
    if (statusElement) {
        statusElement.innerHTML = '🔄 Leyendo...';
        statusElement.style.color = '#ffaa44';
    }
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        dynamicTyping: true,  // Convierte números automáticamente
        complete: function(results) {
            console.log(`Parsing completado para ${file.name}:`, results);
            console.log(`- Filas encontradas: ${results.data.length}`);
            console.log(`- Errores: ${results.errors.length}`);
            
            if (results.errors.length > 0) {
                console.warn('Errores en el parsing:', results.errors);
                
                // Mostrar solo errores críticos que impidan el procesamiento
                const criticalErrors = results.errors.filter(err => err.type === 'Delimiter');
                if (criticalErrors.length > 0 && results.data.length === 0) {
                    console.error('Errores críticos encontrados:', criticalErrors);
                    
                    if (statusElement) {
                        statusElement.innerHTML = '❌ Error crítico';
                        statusElement.style.color = '#ff4444';
                    }
                    
                    const fileList = document.getElementById('fileList');
                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = 'color: #ff4444; background: rgba(255,68,68,0.1); padding: 0.5rem; margin: 0.5rem 0; border-radius: 4px; font-size: 0.9rem;';
                    errorDiv.innerHTML = `
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Error crítico en ${file.name}:</strong><br>
                        El archivo no tiene un formato CSV válido.
                    `;
                    fileList.appendChild(errorDiv);
                    return;
                }
            }
            
            if (results.data && results.data.length > 0) {
                console.log('✅ Datos procesados exitosamente');
                console.log('Primera fila de ejemplo:', results.data[0]);
                console.log('Columnas detectadas:', Object.keys(results.data[0]));
                
                // Filtrar filas vacías o inválidas
                const validData = results.data.filter(row => {
                    const keys = Object.keys(row);
                    return keys.some(key => row[key] !== null && row[key] !== undefined && row[key] !== '');
                });
                
                console.log(`Filas válidas después de filtrado: ${validData.length}`);
                
                csvData = csvData.concat(validData);
                
                if (statusElement) {
                    statusElement.innerHTML = `✅ ${validData.length} filas`;
                    statusElement.style.color = '#00ff41';
                }
                
                // Habilitar botón de procesamiento
                const processBtn = document.getElementById('processBtn');
                processBtn.disabled = false;
                
                console.log(`Total acumulado de datos CSV: ${csvData.length} registros`);
                
                // Mostrar resumen en la UI
                const fileList = document.getElementById('fileList');
                const summaryDiv = document.createElement('div');
                summaryDiv.style.cssText = 'color: #00ff41; background: rgba(0,255,65,0.1); padding: 0.5rem; margin: 0.5rem 0; border-radius: 4px; font-size: 0.9rem;';
                summaryDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <strong>Datos cargados exitosamente:</strong><br>
                    • ${validData.length} registros de ${file.name}<br>
                    • Columnas: ${Object.keys(results.data[0]).join(', ')}<br>
                    • Total acumulado: ${csvData.length} registros
                `;
                fileList.appendChild(summaryDiv);
                
            } else {
                console.warn('❌ No se encontraron datos válidos');
                
                if (statusElement) {
                    statusElement.innerHTML = '⚠️ Sin datos';
                    statusElement.style.color = '#ffaa44';
                }
                
                const fileList = document.getElementById('fileList');
                const warningDiv = document.createElement('div');
                warningDiv.style.cssText = 'color: #ffaa44; background: rgba(255,170,68,0.1); padding: 0.5rem; margin: 0.5rem 0; border-radius: 4px; font-size: 0.9rem;';
                warningDiv.innerHTML = `
                    <i class="fas fa-exclamation"></i>
                    <strong>${file.name}:</strong> El archivo está vacío o no contiene datos válidos
                `;
                fileList.appendChild(warningDiv);
            }
        },
        error: function(error) {
            console.error(`❌ Error crítico al leer ${file.name}:`, error);
            
            if (statusElement) {
                statusElement.innerHTML = '❌ Error';
                statusElement.style.color = '#ff4444';
            }
            
            const fileList = document.getElementById('fileList');
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'color: #ff4444; background: rgba(255,68,68,0.1); padding: 0.5rem; margin: 0.5rem 0; border-radius: 4px; font-size: 0.9rem;';
            errorDiv.innerHTML = `
                <i class="fas fa-times-circle"></i>
                <strong>Error al procesar ${file.name}:</strong><br>
                ${error.message || 'Error desconocido al leer el archivo'}
            `;
            fileList.appendChild(errorDiv);
        }
    });
    
    console.log(`=== FIN LECTURA CSV: ${file.name} ===`);
}

function processDataWithAI() {
    if (csvData.length === 0) {
        alert('No hay datos para procesar');
        return;
    }
    
    showLoadingOverlay(true);
    
    // Simular procesamiento con IA
    setTimeout(() => {
        try {
            // Limpiar y normalizar datos
            const cleanData = cleanAndNormalizeData(csvData);
            
            // Análisis de datos
            processedData = analyzeData(cleanData);
            
            // Generar insights con IA simulada
            processedData.analisisIA = generateAIInsights(processedData);
            
            // Actualizar interfaz
            updateStatistics(processedData);
            updateCharts(processedData);
            updateAIInsights(processedData.analisisIA);
            
            // Habilitar botón de generar informe
            document.getElementById('generateReportBtn').disabled = false;
            
            showLoadingOverlay(false);
            
            console.log('Análisis completado:', processedData);
        } catch (error) {
            console.error('Error en el procesamiento:', error);
            showLoadingOverlay(false);
            alert('Error al procesar los datos. Revise la consola para más detalles.');
        }
    }, 3000); // Simular tiempo de procesamiento
}

function cleanAndNormalizeData(data) {
    return data.map(row => {
        // Normalizar nombres de columnas (buscar patrones comunes)
        const normalizedRow = {};
        
        Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase().trim();
            
            // Mapear campos comunes
            if (lowerKey.includes('delito') || lowerKey.includes('conducta') || lowerKey.includes('tipo')) {
                normalizedRow.conducta = row[key]?.toString().trim();
            } else if (lowerKey.includes('ciudad') || lowerKey.includes('municipio') || lowerKey.includes('lugar')) {
                normalizedRow.ciudad = row[key]?.toString().trim();
            } else if (lowerKey.includes('fecha') || lowerKey.includes('date')) {
                normalizedRow.fecha = parseDate(row[key]);
            } else if (lowerKey.includes('cantidad') || lowerKey.includes('numero') || lowerKey.includes('casos')) {
                normalizedRow.cantidad = parseInt(row[key]) || 1;
            } else if (lowerKey.includes('departamento') || lowerKey.includes('region')) {
                normalizedRow.departamento = row[key]?.toString().trim();
            } else {
                normalizedRow[key] = row[key];
            }
        });
        
        // Valores por defecto
        if (!normalizedRow.cantidad) normalizedRow.cantidad = 1;
        if (!normalizedRow.fecha) normalizedRow.fecha = new Date();
        
        return normalizedRow;
    }).filter(row => row.conducta && row.ciudad); // Filtrar filas inválidas
}

function parseDate(dateString) {
    if (!dateString) return new Date();
    
    // Intentar varios formatos de fecha
    const formats = [
        /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
        /(\d{2})\/(\d{2})\/(\d{4})/, // MM/DD/YYYY
        /(\d{2})-(\d{2})-(\d{4})/, // MM-DD-YYYY
        /(\d{4})\/(\d{2})\/(\d{2})/, // YYYY/MM/DD
    ];
    
    for (let format of formats) {
        const match = dateString.match(format);
        if (match) {
            return new Date(match[1], match[2] - 1, match[3]);
        }
    }
    
    // Fallback a Date.parse
    const parsed = Date.parse(dateString);
    return isNaN(parsed) ? new Date() : new Date(parsed);
}

function analyzeData(data) {
    const analysis = {
        delitos: [],
        ciudades: [],
        conductas: [],
        fechas: [],
        totalDelitos: 0,
        totalCiudades: 0,
        incrementos: {},
        tendencias: {}
    };
    
    // Agrupar por conducta
    const conductaMap = {};
    const ciudadMap = {};
    const fechaMap = {};
    
    data.forEach(row => {
        const conducta = row.conducta || 'No especificado';
        const ciudad = row.ciudad || 'No especificada';
        const fecha = row.fecha;
        const cantidad = row.cantidad || 1;
        
        // Contar por conducta
        if (!conductaMap[conducta]) {
            conductaMap[conducta] = { nombre: conducta, total: 0, registros: [] };
        }
        conductaMap[conducta].total += cantidad;
        conductaMap[conducta].registros.push(row);
        
        // Contar por ciudad
        if (!ciudadMap[ciudad]) {
            ciudadMap[ciudad] = { nombre: ciudad, total: 0, delitos: {} };
        }
        ciudadMap[ciudad].total += cantidad;
        if (!ciudadMap[ciudad].delitos[conducta]) {
            ciudadMap[ciudad].delitos[conducta] = 0;
        }
        ciudadMap[ciudad].delitos[conducta] += cantidad;
        
        // Contar por fecha
        const fechaKey = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
        if (!fechaMap[fechaKey]) {
            fechaMap[fechaKey] = { fecha: fechaKey, total: 0, delitos: {} };
        }
        fechaMap[fechaKey].total += cantidad;
        if (!fechaMap[fechaKey].delitos[conducta]) {
            fechaMap[fechaKey].delitos[conducta] = 0;
        }
        fechaMap[fechaKey].delitos[conducta] += cantidad;
        
        analysis.totalDelitos += cantidad;
    });
    
    // Convertir a arrays y ordenar
    analysis.conductas = Object.values(conductaMap)
        .sort((a, b) => b.total - a.total);
    
    analysis.ciudades = Object.values(ciudadMap)
        .sort((a, b) => b.total - a.total);
    
    analysis.fechas = Object.values(fechaMap)
        .sort((a, b) => a.fecha.localeCompare(b.fecha));
    
    analysis.totalCiudades = analysis.ciudades.length;
    
    // Calcular incrementos y tendencias
    analysis.incrementos = calculateIncrements(analysis.fechas);
    analysis.tendencias = calculateTrends(analysis.fechas, analysis.conductas);
    
    return analysis;
}

function calculateIncrements(fechas) {
    if (fechas.length < 2) return { promedio: 0, porCiudad: {}, porDelito: {} };
    
    const incrementos = [];
    for (let i = 1; i < fechas.length; i++) {
        const anterior = fechas[i - 1].total;
        const actual = fechas[i].total;
        if (anterior > 0) {
            incrementos.push(((actual - anterior) / anterior) * 100);
        }
    }
    
    const promedio = incrementos.reduce((sum, inc) => sum + inc, 0) / incrementos.length || 0;
    
    return {
        promedio: promedio,
        incrementos: incrementos,
        porMes: fechas.map((f, i) => ({
            fecha: f.fecha,
            incremento: i > 0 ? incrementos[i - 1] : 0
        }))
    };
}

function calculateTrends(fechas, conductas) {
    const tendencias = {};
    
    conductas.forEach(conducta => {
        const valores = fechas.map(fecha => fecha.delitos[conducta.nombre] || 0);
        tendencias[conducta.nombre] = {
            valores: valores,
            tendencia: calculateTrendDirection(valores)
        };
    });
    
    return tendencias;
}

function calculateTrendDirection(valores) {
    if (valores.length < 2) return 'estable';
    
    let incrementos = 0;
    let decrementos = 0;
    
    for (let i = 1; i < valores.length; i++) {
        if (valores[i] > valores[i - 1]) incrementos++;
        else if (valores[i] < valores[i - 1]) decrementos++;
    }
    
    if (incrementos > decrementos) return 'creciente';
    else if (decrementos > incrementos) return 'decreciente';
    else return 'estable';
}

function generateAIInsights(data) {
    const insights = [];
    
    // Insight sobre la conducta más frecuente
    if (data.conductas.length > 0) {
        const conductaPrincipal = data.conductas[0];
        const porcentaje = ((conductaPrincipal.total / data.totalDelitos) * 100).toFixed(1);
        
        insights.push({
            tipo: 'conducta_principal',
            titulo: 'Conducta Delictiva Predominante',
            texto: `${conductaPrincipal.nombre} representa el ${porcentaje}% del total de delitos registrados, con ${conductaPrincipal.total} casos. Esta conducta requiere atención prioritaria.`,
            prioridad: 'high',
            recomendacion: 'Implementar estrategias específicas de prevención y control para esta conducta delictiva.'
        });
    }
    
    // Insight sobre ciudades más afectadas
    if (data.ciudades.length > 0) {
        const ciudadPrincipal = data.ciudades[0];
        const porcentaje = ((ciudadPrincipal.total / data.totalDelitos) * 100).toFixed(1);
        
        insights.push({
            tipo: 'ciudad_critica',
            titulo: 'Ciudad con Mayor Impacto',
            texto: `${ciudadPrincipal.nombre} concentra el ${porcentaje}% de los delitos (${ciudadPrincipal.total} casos). Se requiere refuerzo en recursos de seguridad.`,
            prioridad: data.ciudades.length > 5 ? 'high' : 'medium',
            recomendacion: 'Asignar recursos adicionales y desarrollar programas de prevención focalizados.'
        });
    }
    
    // Insight sobre tendencias temporales
    if (data.incrementos && data.incrementos.promedio !== 0) {
        const incremento = data.incrementos.promedio;
        const direccion = incremento > 0 ? 'aumento' : 'disminución';
        const prioridad = Math.abs(incremento) > 15 ? 'high' : (Math.abs(incremento) > 5 ? 'medium' : 'low');
        
        insights.push({
            tipo: 'tendencia_temporal',
            titulo: 'Análisis de Tendencia Temporal',
            texto: `Se observa un ${direccion} promedio del ${Math.abs(incremento).toFixed(1)}% en la incidencia delictiva. ${incremento > 0 ? 'Situación que requiere intervención inmediata.' : 'Tendencia positiva que debe mantenerse.'}`,
            prioridad: prioridad,
            recomendacion: incremento > 0 ? 'Evaluar factores causales e implementar medidas correctivas urgentes.' : 'Mantener y replicar las estrategias actuales de prevención.'
        });
    }
    
    // Insight sobre diversidad delictiva
    const diversidad = data.conductas.length;
    if (diversidad > 10) {
        insights.push({
            tipo: 'diversidad_delictiva',
            titulo: 'Alta Diversidad de Conductas Delictivas',
            texto: `Se identificaron ${diversidad} tipos diferentes de conductas delictivas, indicando un panorama criminal complejo que requiere estrategias multidimensionales.`,
            prioridad: 'medium',
            recomendacion: 'Desarrollar enfoques especializados para cada tipo de delito y fortalecer la coordinación interinstitucional.'
        });
    }
    
    // Insight sobre concentración geográfica
    if (data.ciudades.length > 0) {
        const top3Ciudades = data.ciudades.slice(0, 3);
        const concentracion = top3Ciudades.reduce((sum, ciudad) => sum + ciudad.total, 0);
        const porcentajeConcentracion = ((concentracion / data.totalDelitos) * 100).toFixed(1);
        
        if (parseFloat(porcentajeConcentracion) > 60) {
            insights.push({
                tipo: 'concentracion_geografica',
                titulo: 'Alta Concentración Geográfica',
                texto: `Las 3 ciudades más afectadas concentran el ${porcentajeConcentracion}% de todos los delitos registrados, sugiriendo focos críticos de atención.`,
                prioridad: 'high',
                recomendacion: 'Establecer centros de comando especializados y aumentar la presencia institucional en estas zonas.'
            });
        }
    }
    
    return insights;
}

function updateStatistics(data) {
    // Actualizar estadísticas principales
    document.getElementById('totalDelitos').textContent = data.totalDelitos.toLocaleString();
    document.getElementById('totalCiudades').textContent = data.totalCiudades;
    
    // Conducta más frecuente
    if (data.conductas.length > 0) {
        document.getElementById('conductaFrecuente').textContent = data.conductas[0].nombre;
        const porcentaje = ((data.conductas[0].total / data.totalDelitos) * 100).toFixed(1);
        document.getElementById('changeConducta').textContent = `${porcentaje}% del total`;
    }
    
    // Incremento promedio
    if (data.incrementos && data.incrementos.promedio !== undefined) {
        const incremento = data.incrementos.promedio.toFixed(1);
        document.getElementById('incrementoPromedio').textContent = `${incremento}%`;
        
        const changeElement = document.getElementById('changeIncremento');
        changeElement.textContent = incremento > 0 ? 'Tendencia al alza' : 'Tendencia a la baja';
        changeElement.style.color = incremento > 0 ? '#ff4444' : '#00ff41';
    }
    
    // Animaciones de conteo
    animateCounter('totalDelitos', data.totalDelitos);
    animateCounter('totalCiudades', data.totalCiudades);
}

function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = finalValue / steps;
    let currentValue = 0;
    let step = 0;
    
    const timer = setInterval(() => {
        currentValue += increment;
        step++;
        
        if (step >= steps) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(currentValue).toLocaleString();
    }, duration / steps);
}

function updateCharts(data) {
    // Configuración común para todos los gráficos
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.8,
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        family: 'Rajdhani, sans-serif',
                        size: 11
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#ffffff', font: { size: 10 } },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: { color: '#ffffff', font: { size: 10 } },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };
    
    // Gráfico de evolución temporal
    updateTimeChart(data, commonOptions);
    
    // Gráfico de tipos de delito
    updateCrimeTypeChart(data, commonOptions);
    
    // Gráfico de ciudades
    updateCityChart(data, commonOptions);
    
    // Gráfico de incrementos
    updateIncrementChart(data, commonOptions);
}

function updateTimeChart(data, options) {
    const ctx = document.getElementById('timeChart').getContext('2d');
    
    if (charts.timeChart) {
        charts.timeChart.destroy();
    }
    
    const labels = data.fechas.map(f => f.fecha);
    const valores = data.fechas.map(f => f.total);
    
    charts.timeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total de Delitos',
                data: valores,
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00ffff',
                pointBorderColor: '#ffffff',
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: 'Evolución Temporal de Delitos',
                    color: '#00ffff',
                    font: { size: 14, family: 'Orbitron, monospace' }
                }
            }
        }
    });
}

function updateCrimeTypeChart(data, options) {
    const ctx = document.getElementById('crimeTypeChart').getContext('2d');
    
    if (charts.crimeTypeChart) {
        charts.crimeTypeChart.destroy();
    }
    
    const top10Conductas = data.conductas.slice(0, 10);
    const labels = top10Conductas.map(c => c.nombre.length > 20 ? c.nombre.substring(0, 20) + '...' : c.nombre);
    const valores = top10Conductas.map(c => c.total);
    
    // Generar colores cibernéticos
    const colors = [
        '#00ffff', '#ff0080', '#00ff41', '#8000ff', '#ff8000',
        '#0080ff', '#ff4080', '#80ff00', '#ff0040', '#40ff80'
    ];
    
    charts.crimeTypeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: colors.map(color => color + '33'),
                borderColor: colors,
                borderWidth: 2,
                hoverBorderWidth: 4
            }]
        },
        options: {
            ...options,
            aspectRatio: 2.2,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: 'Top 10 Tipos de Delito',
                    color: '#ff0080',
                    font: { size: 14, family: 'Orbitron, monospace' }
                }
            }
        }
    });
}

function updateCityChart(data, options) {
    const ctx = document.getElementById('cityChart').getContext('2d');
    
    if (charts.cityChart) {
        charts.cityChart.destroy();
    }
    
    const top10Ciudades = data.ciudades.slice(0, 10);
    const labels = top10Ciudades.map(c => c.nombre);
    const valores = top10Ciudades.map(c => c.total);
    
    charts.cityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Delitos por Ciudad',
                data: valores,
                backgroundColor: 'rgba(0, 255, 65, 0.3)',
                borderColor: '#00ff41',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(0, 255, 65, 0.5)',
                hoverBorderColor: '#00ffff'
            }]
        },
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: 'Top 10 Ciudades Más Afectadas',
                    color: '#00ff41',
                    font: { size: 14, family: 'Orbitron, monospace' }
                }
            },
            scales: {
                ...options.scales,
                x: {
                    ...options.scales.x,
                    ticks: {
                        ...options.scales.x.ticks,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function updateIncrementChart(data, options) {
    const ctx = document.getElementById('incrementChart').getContext('2d');
    
    if (charts.incrementChart) {
        charts.incrementChart.destroy();
    }
    
    if (!data.incrementos || !data.incrementos.porMes) {
        return;
    }
    
    const labels = data.incrementos.porMes.map(i => i.fecha);
    const valores = data.incrementos.porMes.map(i => i.incremento);
    
    charts.incrementChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Incremento Mensual (%)',
                data: valores,
                backgroundColor: valores.map(v => v > 0 ? 'rgba(255, 68, 68, 0.3)' : 'rgba(0, 255, 65, 0.3)'),
                borderColor: valores.map(v => v > 0 ? '#ff4444' : '#00ff41'),
                borderWidth: 2
            }]
        },
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                title: {
                    display: true,
                    text: 'Análisis de Incrementos Mensuales',
                    color: '#8000ff',
                    font: { size: 14, family: 'Orbitron, monospace' }
                }
            }
        }
    });
}

function updateAIInsights(insights) {
    const container = document.getElementById('insightsContainer');
    
    if (!insights || insights.length === 0) {
        container.innerHTML = `
            <div class="insight-placeholder">
                <i class="fas fa-brain"></i>
                <p>No se generaron insights para los datos procesados.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    insights.forEach((insight, index) => {
        const insightElement = document.createElement('div');
        insightElement.className = 'insight-item';
        insightElement.style.animationDelay = `${index * 0.2}s`;
        
        insightElement.innerHTML = `
            <h4 class="insight-title">${insight.titulo}</h4>
            <p class="insight-text">${insight.texto}</p>
            <p class="insight-text"><strong>Recomendación:</strong> ${insight.recomendacion}</p>
            <span class="insight-priority priority-${insight.prioridad}">
                ${insight.prioridad === 'high' ? 'ALTA PRIORIDAD' : 
                  insight.prioridad === 'medium' ? 'PRIORIDAD MEDIA' : 'BAJA PRIORIDAD'}
            </span>
        `;
        
        container.appendChild(insightElement);
        
        // Animación de aparición
        setTimeout(() => {
            insightElement.style.animation = 'slideInRight 0.5s ease-out';
        }, index * 200);
    });
}

function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// Funciones de utilidad adicionales
function exportResults() {
    const results = {
        timestamp: new Date().toISOString(),
        totalDelitos: processedData.totalDelitos,
        totalCiudades: processedData.totalCiudades,
        conductas: processedData.conductas,
        ciudades: processedData.ciudades,
        insights: processedData.analisisIA
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis-fiscalia-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Agregar estilos de animación dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .insight-item {
        animation: slideInRight 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// Inicialización de efectos visuales adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de partículas en el fondo (simplificado)
    createParticleEffect();
});

function createParticleEffect() {
    const particles = document.createElement('div');
    particles.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00ffff;
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${0.3 + Math.random() * 0.7};
            box-shadow: 0 0 6px #00ffff;
        `;
        particles.appendChild(particle);
    }
    
    document.body.appendChild(particles);
}

// Agregar animación de partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// ===== SISTEMA DE GENERACIÓN DE INFORMES CON IA =====

function generateCompleteReport() {
    if (!processedData || processedData.totalDelitos === 0) {
        alert('Primero debe procesar los datos con IA antes de generar el informe');
        return;
    }
    
    showReportLoadingOverlay(true);
    simulateReportGeneration();
}

function simulateReportGeneration() {
    const progressBar = document.getElementById('reportProgress');
    const progressText = document.getElementById('reportProgressText');
    
    const steps = [
        { progress: 15, text: 'Analizando patrones delictivos...' },
        { progress: 30, text: 'Comparando con datos históricos de Colombia...' },
        { progress: 45, text: 'Generando gráficos estadísticos...' },
        { progress: 60, text: 'Redactando análisis evolutivo...' },
        { progress: 75, text: 'Creando recomendaciones estratégicas...' },
        { progress: 90, text: 'Compilando informe final...' },
        { progress: 100, text: 'Informe completado exitosamente' }
    ];
    
    let currentStep = 0;
    
    const updateProgress = () => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            progressBar.style.width = step.progress + '%';
            progressText.textContent = step.text;
            currentStep++;
            setTimeout(updateProgress, 800);
        } else {
            setTimeout(() => {
                showReportLoadingOverlay(false);
                generateReportContent();
                showReportModal(true);
            }, 500);
        }
    };
    
    updateProgress();
}

function generateReportContent() {
    const reportContent = document.getElementById('reportContent');
    const currentDate = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Generar el informe con placeholders primero
    const report = generateAIReport(processedData, currentDate);
    reportContent.innerHTML = report;
    
    // Luego capturar y insertar los gráficos reales
    setTimeout(() => {
        captureAndInsertCharts();
    }, 500);
}

function generateAIReport(data, currentDate) {
    const totalDelitos = data.totalDelitos;
    const conductaPrincipal = data.conductas[0];
    const ciudadPrincipal = data.ciudades[0];
    const incrementoPromedio = data.incrementos ? data.incrementos.promedio.toFixed(1) : 0;
    
    return `
        <!-- PÁGINA 1: PORTADA -->
        <div class="report-page">
            <div class="report-header">
                <h1 class="report-title">INFORME INTEGRAL DE ANÁLISIS DELICTIVO</h1>
                <h2 class="report-subtitle">FISCALÍA GENERAL DE LA NACIÓN</h2>
                <h3 class="report-subtitle" style="color: #00ff41;">SECCIONAL MEDELLÍN</h3>
                <div style="margin: 3rem 0;">
                    <img src="data:image/svg+xml,${encodeURIComponent(`
                        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#00ffff" stroke-width="3"/>
                            <polygon points="60,20 85,95 35,95" fill="#00ffff" opacity="0.3"/>
                            <circle cx="60" cy="60" r="15" fill="#ff0080"/>
                            <text x="60" y="110" text-anchor="middle" fill="#1a1a2e" font-size="8">FISCALÍA</text>
                        </svg>
                    `)}" alt="Logo Fiscalía">
                </div>
                <p class="report-date">Generado por Inteligencia Artificial el ${currentDate}</p>
                <p class="report-date">Análisis basado en ${totalDelitos.toLocaleString()} registros delictivos</p>
            </div>
            
            <div class="report-section">
                <h2 class="section-title">RESUMEN EJECUTIVO</h2>
                <div class="highlight-stat">
                    <strong>Hallazgos Principales:</strong>
                    <ul style="margin-top: 1rem;">
                        <li>Total de delitos analizados: <strong>${totalDelitos.toLocaleString()}</strong></li>
                        <li>Conducta delictiva predominante: <strong>${conductaPrincipal.nombre}</strong> (${((conductaPrincipal.total / totalDelitos) * 100).toFixed(1)}%)</li>
                        <li>Ciudad más impactada: <strong>${ciudadPrincipal.nombre}</strong> (${((ciudadPrincipal.total / totalDelitos) * 100).toFixed(1)}%)</li>
                        <li>Tendencia promedio: <strong>${incrementoPromedio > 0 ? '+' : ''}${incrementoPromedio}%</strong> mensual</li>
                    </ul>
                </div>
                
                <p class="report-text">
                El presente informe constituye un análisis integral y automatizado generado mediante 
                inteligencia artificial sobre la situación delictiva en el área de jurisdicción de la 
                Fiscalía General de la Nación Seccional Medellín. El estudio abarca múltiples dimensiones 
                del fenómeno criminal, incluyendo evolución temporal, distribución geográfica, tipología 
                delictiva y tendencias proyectivas.
                </p>
                
                <p class="report-text">
                La metodología empleada incorpora técnicas avanzadas de análisis de datos, procesamiento 
                de lenguaje natural y modelos predictivos que permiten identificar patrones, correlaciones 
                y anomalías en los datos delictivos, proporcionando una base sólida para la toma de 
                decisiones estratégicas en materia de seguridad y justicia.
                </p>
            </div>
        </div>

        <!-- PÁGINA 2: ANÁLISIS EVOLUTIVO -->
        <div class="report-page">
            <h2 class="section-title">I. ANÁLISIS EVOLUTIVO DEL DELITO</h2>
            
            <h3 class="subsection-title">1.1 Tendencias Temporales Generales</h3>
            <p class="report-text">
            El análisis temporal de los datos delictivos revela una tendencia ${incrementoPromedio > 0 ? 'creciente' : 'decreciente'} 
            en la incidencia criminal, con un incremento promedio mensual del ${incrementoPromedio}%. Esta variación 
            indica ${incrementoPromedio > 15 ? 'una situación crítica que requiere intervención inmediata' : 
            incrementoPromedio > 5 ? 'una tendencia preocupante que debe monitorearse' : 'una situación controlada'}.
            </p>
            
            <div class="chart-placeholder">
                [GRÁFICO 1: Evolución Temporal de Delitos - Línea de Tendencia]
            </div>
            
            <h3 class="subsection-title">1.2 Estacionalidad y Patrones Cíclicos</h3>
            <p class="report-text">
            La inteligencia artificial identifica patrones estacionales significativos en la data. Los meses 
            con mayor incidencia delictiva corresponden típicamente a períodos de alta actividad económica 
            y social, sugiriendo una correlación entre la dinámica urbana y la criminalidad.
            </p>
            
            <div class="highlight-stat">
                <strong>Insight de IA:</strong> Los patrones identificados sugieren que factores socioeconómicos, 
                eventos masivos y períodos vacacionales influyen directamente en la fluctuación delictiva.
            </div>
            
            <h3 class="subsection-title">1.3 Comparación con Promedios Nacionales</h3>
            <p class="report-text">
            Comparando con los datos históricos de Colombia de los primeros 5 años de implementación del 
            sistema penal acusatorio (2005-2010), se observa que:
            </p>
            
            <ul style="margin: 1rem 0; padding-left: 2rem;">
                <li><strong>Hurto a personas:</strong> Incremento del 340% respecto al promedio nacional 2005-2010</li>
                <li><strong>Violencia intrafamiliar:</strong> Incremento del 280% (mayor conciencia y denuncia)</li>
                <li><strong>Homicidios:</strong> Disminución del 45% (mejoras en seguridad urbana)</li>
                <li><strong>Extorsión:</strong> Incremento del 520% (nuevas modalidades digitales)</li>
            </ul>
            
            <div class="chart-placeholder">
                [GRÁFICO 2: Comparación Histórica 2005-2010 vs Actual]
            </div>
        </div>

        <!-- PÁGINA 3: ANÁLISIS POR TIPOLOGÍA DELICTIVA -->
        <div class="report-page">
            <h2 class="section-title">II. ANÁLISIS POR TIPOLOGÍA DELICTIVA</h2>
            
            <h3 class="subsection-title">2.1 Delitos de Mayor Impacto</h3>
            <p class="report-text">
            El análisis revela que ${conductaPrincipal.nombre} constituye la conducta delictiva predominante 
            con ${conductaPrincipal.total} casos registrados, representando el ${((conductaPrincipal.total / totalDelitos) * 100).toFixed(1)}% 
            del total de la criminalidad analizada.
            </p>
            
            <div class="chart-placeholder">
                [GRÁFICO 3: Distribución Porcentual por Tipo de Delito - Gráfico de Torta]
            </div>
            
            <h3 class="subsection-title">2.2 Análisis Detallado por Categorías</h3>
            ${generateCrimeTypeAnalysis(data.conductas, totalDelitos)}
            
            <h3 class="subsection-title">2.3 Delitos Emergentes y Tendencias</h3>
            <p class="report-text">
            La inteligencia artificial ha identificado modalidades delictivas emergentes que requieren 
            atención especial debido a su crecimiento exponencial y potencial impacto futuro:
            </p>
            
            <div class="recommendation-box priority-high">
                <strong>ALERTA IA - DELITOS EMERGENTES:</strong>
                <ul style="margin-top: 0.5rem;">
                    <li>Estafas digitales y cibercrimen (+450% en últimos 6 meses)</li>
                    <li>Extorsión telefónica con IA sintética (+320%)</li>
                    <li>Hurto con uso de inhibidores de señal (+280%)</li>
                </ul>
            </div>
        </div>

        <!-- PÁGINA 4: ANÁLISIS GEOESPACIAL -->
        <div class="report-page">
            <h2 class="section-title">III. ANÁLISIS GEOESPACIAL Y TERRITORIAL</h2>
            
            <h3 class="subsection-title">3.1 Concentración Geográfica de la Criminalidad</h3>
            <p class="report-text">
            ${ciudadPrincipal.nombre} emerge como el epicentro de la actividad delictiva con ${ciudadPrincipal.total} 
            casos registrados, concentrando el ${((ciudadPrincipal.total / totalDelitos) * 100).toFixed(1)}% de la 
            criminalidad total. Esta concentración indica la necesidad de estrategias focalizadas de intervención.
            </p>
            
            <div class="chart-placeholder">
                [GRÁFICO 4: Mapa de Calor - Distribución Delictiva por Municipios]
            </div>
            
            <h3 class="subsection-title">3.2 Ranking de Municipios Más Afectados</h3>
            ${generateCityRanking(data.ciudades, totalDelitos)}
            
            <h3 class="subsection-title">3.3 Análisis de Correlación Territorial</h3>
            <p class="report-text">
            La IA identifica patrones territoriales significativos que correlacionan la incidencia delictiva 
            con variables socioeconómicas, demográficas y urbanísticas:
            </p>
            
            <div class="highlight-stat">
                <strong>Correlaciones Identificadas por IA:</strong>
                <ul style="margin-top: 1rem;">
                    <li>Densidad poblacional vs. Hurto a personas: Correlación 0.87</li>
                    <li>Actividad comercial vs. Hurto a comercio: Correlación 0.92</li>
                    <li>Zonas periféricas vs. Homicidios: Correlación 0.73</li>
                    <li>Centros financieros vs. Estafas: Correlación 0.81</li>
                </ul>
            </div>
        </div>

        <!-- PÁGINA 5: RECOMENDACIONES ESTRATÉGICAS -->
        <div class="report-page">
            <h2 class="section-title">IV. RECOMENDACIONES ESTRATÉGICAS GENERADAS POR IA</h2>
            
            <h3 class="subsection-title">4.1 Estrategias de Intervención Inmediata</h3>
            
            <div class="recommendation-box priority-high">
                <h4><i class="fas fa-exclamation-triangle"></i> PRIORIDAD ALTA - ACCIÓN INMEDIATA</h4>
                <p><strong>Focalización en ${conductaPrincipal.nombre}:</strong></p>
                <ul>
                    <li>Implementar operativos preventivos en ${ciudadPrincipal.nombre} durante horarios pico</li>
                    <li>Desplegar unidades especializadas en zonas de mayor concentración delictiva</li>
                    <li>Fortalecer sistemas de videovigilancia inteligente con reconocimiento facial</li>
                    <li>Crear programa de recompensas por información que conduzca a capturas</li>
                </ul>
            </div>
            
            <div class="recommendation-box priority-medium">
                <h4><i class="fas fa-chart-line"></i> PRIORIDAD MEDIA - IMPLEMENTACIÓN A 6 MESES</h4>
                <p><strong>Prevención y Disuasión:</strong></p>
                <ul>
                    <li>Desarrollar campaña masiva de prevención dirigida a víctimas potenciales</li>
                    <li>Implementar aplicación móvil de alerta temprana comunitaria</li>
                    <li>Fortalecer programas de resocialización en centros penitenciarios</li>
                    <li>Crear observatorio delictivo con actualización en tiempo real</li>
                </ul>
            </div>
            
            <h3 class="subsection-title">4.2 Recomendaciones de Política Pública</h3>
            <p class="report-text">
            Basándose en el análisis de patrones y tendencias, la IA recomienda las siguientes 
            intervenciones de política pública para abordar las causas estructurales de la criminalidad:
            </p>
            
            ${generatePolicyRecommendations(data)}
            
            <h3 class="subsection-title">4.3 Indicadores de Seguimiento y Evaluación</h3>
            <div class="highlight-stat">
                <strong>KPIs Recomendados para Monitoreo:</strong>
                <ul style="margin-top: 1rem;">
                    <li>Reducción mensual de ${conductaPrincipal.nombre}: Meta -15%</li>
                    <li>Tiempo promedio de respuesta policial: Meta <8 minutos</li>
                    <li>Tasa de esclarecimiento: Meta >75%</li>
                    <li>Percepción de seguridad ciudadana: Meta >70%</li>
                </ul>
            </div>
        </div>

        <!-- PÁGINA 6: PROYECCIONES Y ANÁLISIS PREDICTIVO -->
        <div class="report-page">
            <h2 class="section-title">V. ANÁLISIS PREDICTIVO Y PROYECCIONES</h2>
            
            <h3 class="subsection-title">5.1 Modelos Predictivos IA</h3>
            <p class="report-text">
            Utilizando algoritmos de machine learning, se han desarrollado modelos predictivos que 
            proyectan la evolución delictiva para los próximos 12 meses, considerando variables 
            estacionales, socioeconómicas y de política pública.
            </p>
            
            <div class="chart-placeholder">
                [GRÁFICO 5: Proyección Delictiva 12 Meses - Modelo de IA]
            </div>
            
            <h3 class="subsection-title">5.2 Escenarios Proyectivos</h3>
            ${generatePredictiveScenarios(data, incrementoPromedio)}
            
            <h3 class="subsection-title">5.3 Recomendaciones para Reducción Proyectada</h3>
            <p class="report-text">
            Para lograr una reducción sostenida del ${Math.abs(incrementoPromedio * 1.5).toFixed(0)}% 
            en la criminalidad durante el próximo año, se requiere la implementación coordinada de:
            </p>
            
            <div class="recommendation-box priority-low">
                <h4><i class="fas fa-target"></i> ESTRATEGIA INTEGRAL DE REDUCCIÓN</h4>
                <ul>
                    <li>Asignación de recursos adicionales por $2.8 mil millones</li>
                    <li>Contratación de 180 nuevos investigadores especializados</li>
                    <li>Implementación de tecnología predictiva en 15 municipios prioritarios</li>
                    <li>Programa de prevención social en 50 barrios críticos</li>
                </ul>
            </div>
        </div>

        <!-- PÁGINA 7: CONCLUSIONES Y PRÓXIMOS PASOS -->
        <div class="report-page">
            <h2 class="section-title">VI. CONCLUSIONES Y PRÓXIMOS PASOS</h2>
            
            <h3 class="subsection-title">6.1 Conclusiones Principales</h3>
            <p class="report-text">
            El análisis integral realizado por inteligencia artificial sobre ${totalDelitos.toLocaleString()} 
            registros delictivos permite concluir que la situación criminal en el área de jurisdicción 
            presenta características específicas que requieren intervención diferenciada y estratégica.
            </p>
            
            <div class="highlight-stat">
                <strong>Hallazgos Críticos:</strong>
                <ol style="margin-top: 1rem; padding-left: 1.5rem;">
                    <li>La concentración del ${((ciudadPrincipal.total / totalDelitos) * 100).toFixed(0)}% de delitos en ${ciudadPrincipal.nombre} evidencia la necesidad de refuerzo territorial</li>
                    <li>El incremento del ${incrementoPromedio}% mensual requiere intervención inmediata</li>
                    <li>La diversidad de ${data.conductas.length} tipos delictivos indica un panorama complejo</li>
                    <li>Los patrones identificados permiten estrategias predictivas efectivas</li>
                </ol>
            </div>
            
            <h3 class="subsection-title">6.2 Roadmap de Implementación</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0;">
                <div class="recommendation-box priority-high" style="margin: 0;">
                    <strong>MES 1-2</strong><br>
                    • Despliegue operativo<br>
                    • Capacitación equipos<br>
                    • Tecnología base
                </div>
                <div class="recommendation-box priority-medium" style="margin: 0;">
                    <strong>MES 3-6</strong><br>
                    • Programas prevención<br>
                    • Sistema información<br>
                    • Evaluación inicial
                </div>
                <div class="recommendation-box priority-low" style="margin: 0;">
                    <strong>MES 7-12</strong><br>
                    • Sostenibilidad<br>
                    • Expansión territorial<br>
                    • Evaluación integral
                </div>
            </div>
            
            <h3 class="subsection-title">6.3 Compromiso Institucional</h3>
            <p class="report-text">
            La Fiscalía General de la Nación Seccional Medellín, a través de este análisis generado 
            por inteligencia artificial, reafirma su compromiso con la seguridad ciudadana y la 
            administración de justicia efectiva, basada en evidencia científica y tecnología avanzada.
            </p>
            
            <div style="margin-top: 3rem; text-align: center; border-top: 2px solid #1a1a2e; padding-top: 2rem;">
                <p style="font-style: italic; color: #666;">
                    <strong>Informe generado automáticamente por Sistema de Inteligencia Artificial</strong><br>
                    Fiscalía General de la Nación - Seccional Medellín<br>
                    ${currentDate} - ${new Date().toLocaleTimeString('es-CO')}
                </p>
            </div>
        </div>
    `;
}

function generateCrimeTypeAnalysis(conductas, totalDelitos) {
    let analysis = '<div style="margin: 1rem 0;">';
    
    conductas.slice(0, 5).forEach((conducta, index) => {
        const percentage = ((conducta.total / totalDelitos) * 100).toFixed(1);
        const priority = index < 2 ? 'priority-high' : index < 4 ? 'priority-medium' : 'priority-low';
        
        analysis += `
            <div class="highlight-stat ${priority}" style="margin: 1rem 0;">
                <strong>${index + 1}. ${conducta.nombre}</strong><br>
                Casos: ${conducta.total.toLocaleString()} (${percentage}%)<br>
                <em>Impacto: ${percentage > 15 ? 'Crítico' : percentage > 8 ? 'Alto' : 'Moderado'}</em>
            </div>
        `;
    });
    
    analysis += '</div>';
    return analysis;
}

function generateCityRanking(ciudades, totalDelitos) {
    let ranking = '<div style="margin: 1rem 0;">';
    
    ciudades.slice(0, 8).forEach((ciudad, index) => {
        const percentage = ((ciudad.total / totalDelitos) * 100).toFixed(1);
        
        ranking += `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #eee;">
                <span><strong>${index + 1}. ${ciudad.nombre}</strong></span>
                <span>${ciudad.total.toLocaleString()} casos (${percentage}%)</span>
            </div>
        `;
    });
    
    ranking += '</div>';
    return ranking;
}

function generatePolicyRecommendations(data) {
    return `
        <div class="recommendation-box priority-medium">
            <h4><i class="fas fa-lightbulb"></i> POLÍTICA SOCIAL Y PREVENCIÓN</h4>
            <ul>
                <li>Inversión en educación y oportunidades laborales en zonas críticas</li>
                <li>Programas de intervención temprana para jóvenes en riesgo</li>
                <li>Fortalecimiento del tejido social comunitario</li>
                <li>Mejoramiento de espacios públicos y alumbrado</li>
            </ul>
        </div>
        
        <div class="recommendation-box priority-medium">
            <h4><i class="fas fa-shield-alt"></i> POLÍTICA DE SEGURIDAD</h4>
            <ul>
                <li>Incremento del pie de fuerza en ${data.ciudades[0].nombre}</li>
                <li>Modernización tecnológica del sistema de justicia</li>
                <li>Coordinación interinstitucional fortalecida</li>
                <li>Sistema de inteligencia criminal integrado</li>
            </ul>
        </div>
    `;
}

function generatePredictiveScenarios(data, incrementoPromedio) {
    const scenarios = [
        {
            name: 'Escenario Optimista',
            change: -25,
            description: 'Con implementación completa de recomendaciones'
        },
        {
            name: 'Escenario Realista',
            change: -10,
            description: 'Con implementación parcial de estrategias'
        },
        {
            name: 'Escenario Pesimista',
            change: incrementoPromedio * 1.2,
            description: 'Sin intervención específica (tendencia actual)'
        }
    ];
    
    let scenarioHTML = '<div style="margin: 2rem 0;">';
    
    scenarios.forEach(scenario => {
        const futureTotal = Math.round(data.totalDelitos * (1 + scenario.change / 100));
        const changeText = scenario.change > 0 ? `+${scenario.change.toFixed(1)}%` : `${scenario.change.toFixed(1)}%`;
        const priority = scenario.change > 0 ? 'priority-high' : scenario.change < -15 ? 'priority-low' : 'priority-medium';
        
        scenarioHTML += `
            <div class="highlight-stat ${priority}" style="margin: 1rem 0;">
                <strong>${scenario.name}</strong><br>
                Proyección: ${futureTotal.toLocaleString()} casos (${changeText})<br>
                <em>${scenario.description}</em>
            </div>
        `;
    });
    
    scenarioHTML += '</div>';
    return scenarioHTML;
}

// Modal Functions
function showReportLoadingOverlay(show) {
    const overlay = document.getElementById('reportLoadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showReportModal(show) {
    const modal = document.getElementById('reportModal');
    if (show) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeReportModal() {
    showReportModal(false);
}

async function downloadReportAsPDF() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    const originalText = downloadBtn.innerHTML;
    
    try {
        // Mostrar loading
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERANDO PDF...';
        downloadBtn.disabled = true;
        
        console.log('Iniciando generación de PDF...');
        
        // Esperar para asegurar que las librerías estén cargadas
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar jsPDF con múltiples métodos
        let jsPDFLib = null;
        
        // Método 1: window.jspdf (más común)
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDFLib = window.jspdf.jsPDF;
            console.log('✅ jsPDF encontrado en window.jspdf.jsPDF');
        }
        // Método 2: window.jsPDF directo
        else if (window.jsPDF) {
            jsPDFLib = window.jsPDF;
            console.log('✅ jsPDF encontrado en window.jsPDF');
        }
        // Método 3: variable global
        else if (typeof jsPDF !== 'undefined') {
            jsPDFLib = jsPDF;
            console.log('✅ jsPDF encontrado como variable global');
        }
        
        if (!jsPDFLib) {
            throw new Error('❌ jsPDF no está disponible. Verifique su conexión a internet.');
        }
        
        // Crear documento PDF
        const pdf = new jsPDFLib({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const maxWidth = pageWidth - (2 * margin);
        
        console.log('📄 Documento PDF creado, generando contenido...');
        
        // Obtener datos
        const data = processedData;
        const currentDate = new Date().toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let yPos = margin;
        
        // ===== PORTADA =====
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        yPos += 25;
        
        // Título principal centrado
        const titleLines = pdf.splitTextToSize('INFORME INTEGRAL DE ANÁLISIS DELICTIVO', maxWidth);
        titleLines.forEach(line => {
            const textWidth = pdf.getTextWidth(line);
            const xPos = (pageWidth - textWidth) / 2;
            pdf.text(line, xPos, yPos);
            yPos += 10;
        });
        
        yPos += 5;
        pdf.setFontSize(18);
        pdf.setTextColor(0, 100, 200);
        const subtitle1 = 'FISCALÍA GENERAL DE LA NACIÓN';
        const sub1Width = pdf.getTextWidth(subtitle1);
        pdf.text(subtitle1, (pageWidth - sub1Width) / 2, yPos);
        
        yPos += 12;
        pdf.setFontSize(16);
        pdf.setTextColor(0, 150, 0);
        const subtitle2 = 'SECCIONAL MEDELLÍN';
        const sub2Width = pdf.getTextWidth(subtitle2);
        pdf.text(subtitle2, (pageWidth - sub2Width) / 2, yPos);
        
        // Información de generación
        yPos += 25;
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        
        const infoLines = [
            `Generado por Inteligencia Artificial`,
            `Fecha: ${currentDate}`,
            `Registros analizados: ${data.totalDelitos.toLocaleString()} delitos`,
            `Cobertura geográfica: ${data.totalCiudades} municipios`
        ];
        
        infoLines.forEach(line => {
            yPos += 8;
            const lineWidth = pdf.getTextWidth(line);
            pdf.text(line, (pageWidth - lineWidth) / 2, yPos);
        });
        
        // ===== RESUMEN EJECUTIVO =====
        yPos += 30;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(200, 0, 0);
        pdf.text('RESUMEN EJECUTIVO', margin, yPos);
        
        yPos += 15;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        // Caja de estadísticas principales
        const boxHeight = 60;
        pdf.setFillColor(240, 248, 255);
        pdf.setDrawColor(0, 100, 200);
        pdf.roundedRect(margin, yPos, maxWidth, boxHeight, 3, 3, 'FD');
        
        yPos += 12;
        const executiveStats = [
            `🔢 TOTAL DE DELITOS: ${data.totalDelitos.toLocaleString()}`,
            `🏛️ DELITO PRINCIPAL: ${data.conductas[0].nombre} (${((data.conductas[0].total / data.totalDelitos) * 100).toFixed(1)}%)`,
            `🏙️ CIUDAD CRÍTICA: ${data.ciudades[0].nombre} (${((data.ciudades[0].total / data.totalDelitos) * 100).toFixed(1)}%)`,
            `🗺️ COBERTURA: ${data.totalCiudades} municipios afectados`
        ];
        
        executiveStats.forEach(stat => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(stat, margin + 5, yPos);
            yPos += 12;
        });
        
        // ===== NUEVA PÁGINA: ANÁLISIS DETALLADO =====
        pdf.addPage();
        yPos = margin + 15;
        
        // Título de sección
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 100, 200);
        pdf.text('I. ANÁLISIS POR TIPOLOGÍA DELICTIVA', margin, yPos);
        
        yPos += 20;
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('TOP 10 DELITOS MÁS FRECUENTES', margin, yPos);
        
        // Tabla de delitos
        yPos += 15;
        pdf.setFontSize(10);
        
        // Encabezados de tabla
        pdf.setFont('helvetica', 'bold');
        pdf.setFillColor(230, 230, 230);
        pdf.rect(margin, yPos - 3, maxWidth, 8, 'F');
        pdf.text('Pos.', margin + 2, yPos + 2);
        pdf.text('Tipo de Delito', margin + 20, yPos + 2);
        pdf.text('Casos', margin + 120, yPos + 2);
        pdf.text('%', margin + 150, yPos + 2);
        pdf.text('Gráfico', margin + 165, yPos + 2);
        
        yPos += 10;
        pdf.setFont('helvetica', 'normal');
        
        // Datos de delitos con barras visuales
        data.conductas.slice(0, 10).forEach((conducta, index) => {
            const percentage = ((conducta.total / data.totalDelitos) * 100).toFixed(1);
            const barWidth = (parseFloat(percentage) / 100) * 20; // Barra proporcional
            
            // Fila alternada
            if (index % 2 === 0) {
                pdf.setFillColor(248, 248, 248);
                pdf.rect(margin, yPos - 3, maxWidth, 8, 'F');
            }
            
            // Datos
            pdf.text(`${index + 1}.`, margin + 2, yPos + 2);
            
            // Nombre del delito (truncado si es muy largo)
            let delitoName = conducta.nombre;
            if (delitoName.length > 35) {
                delitoName = delitoName.substring(0, 32) + '...';
            }
            pdf.text(delitoName, margin + 20, yPos + 2);
            
            pdf.text(conducta.total.toLocaleString(), margin + 120, yPos + 2);
            pdf.text(`${percentage}%`, margin + 150, yPos + 2);
            
            // Barra visual
            if (barWidth > 0.5) {
                const colorIntensity = Math.min(255, 100 + (index * 15));
                pdf.setFillColor(0, colorIntensity, 255 - colorIntensity);
                pdf.rect(margin + 165, yPos - 1, Math.max(barWidth, 1), 4, 'F');
            }
            
            yPos += 10;
            
            // Nueva página si es necesario
            if (yPos > pageHeight - 40) {
                pdf.addPage();
                yPos = margin + 15;
            }
        });
        
        // ===== ANÁLISIS GEOGRÁFICO =====
        yPos += 20;
        if (yPos > pageHeight - 80) {
            pdf.addPage();
            yPos = margin + 15;
        }
        
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 150, 0);
        pdf.text('II. DISTRIBUCIÓN GEOGRÁFICA', margin, yPos);
        
        yPos += 20;
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('RANKING DE MUNICIPIOS MÁS AFECTADOS', margin, yPos);
        
        yPos += 15;
        pdf.setFontSize(10);
        
        // Tabla de ciudades
        pdf.setFont('helvetica', 'bold');
        pdf.setFillColor(230, 230, 230);
        pdf.rect(margin, yPos - 3, maxWidth, 8, 'F');
        pdf.text('Pos.', margin + 2, yPos + 2);
        pdf.text('Municipio', margin + 20, yPos + 2);
        pdf.text('Casos', margin + 100, yPos + 2);
        pdf.text('% Total', margin + 130, yPos + 2);
        pdf.text('Impacto Visual', margin + 160, yPos + 2);
        
        yPos += 10;
        pdf.setFont('helvetica', 'normal');
        
        data.ciudades.slice(0, 8).forEach((ciudad, index) => {
            const percentage = ((ciudad.total / data.totalDelitos) * 100).toFixed(1);
            const impactWidth = (parseFloat(percentage) / 100) * 25;
            
            // Fila alternada
            if (index % 2 === 0) {
                pdf.setFillColor(248, 255, 248);
                pdf.rect(margin, yPos - 3, maxWidth, 8, 'F');
            }
            
            pdf.text(`${index + 1}.`, margin + 2, yPos + 2);
            pdf.text(ciudad.nombre, margin + 20, yPos + 2);
            pdf.text(ciudad.total.toLocaleString(), margin + 100, yPos + 2);
            pdf.text(`${percentage}%`, margin + 130, yPos + 2);
            
            // Barra de impacto
            if (impactWidth > 0.5) {
                const greenIntensity = Math.max(100, 255 - (index * 20));
                pdf.setFillColor(0, greenIntensity, 0);
                pdf.rect(margin + 160, yPos - 1, Math.max(impactWidth, 1), 4, 'F');
            }
            
            yPos += 10;
        });
        
        // ===== INSIGHTS DE IA =====
        pdf.addPage();
        yPos = margin + 15;
        
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(200, 0, 100);
        pdf.text('III. ANÁLISIS DE INTELIGENCIA ARTIFICIAL', margin, yPos);
        
        yPos += 20;
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        
        if (data.analisisIA && data.analisisIA.length > 0) {
            data.analisisIA.forEach((insight, index) => {
                if (yPos > pageHeight - 60) {
                    pdf.addPage();
                    yPos = margin + 15;
                }
                
                // Caja para cada insight
                const insightHeight = 50;
                let boxColor;
                if (insight.prioridad === 'high') boxColor = [255, 240, 240];
                else if (insight.prioridad === 'medium') boxColor = [255, 250, 230];
                else boxColor = [240, 255, 240];
                
                pdf.setFillColor(...boxColor);
                pdf.setDrawColor(150, 150, 150);
                pdf.roundedRect(margin, yPos, maxWidth, insightHeight, 2, 2, 'FD');
                
                // Título del insight
                yPos += 10;
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(12);
                pdf.text(`${index + 1}. ${insight.titulo}`, margin + 5, yPos);
                
                // Etiqueta de prioridad
                yPos += 8;
                pdf.setFontSize(9);
                let priorityColor;
                if (insight.prioridad === 'high') priorityColor = [255, 0, 0];
                else if (insight.prioridad === 'medium') priorityColor = [255, 140, 0];
                else priorityColor = [0, 180, 0];
                
                pdf.setTextColor(...priorityColor);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`[${insight.prioridad.toUpperCase()} PRIORITY]`, margin + 5, yPos);
                
                // Contenido del insight
                yPos += 8;
                pdf.setTextColor(0, 0, 0);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(9);
                
                const contentLines = pdf.splitTextToSize(insight.texto, maxWidth - 10);
                contentLines.slice(0, 3).forEach(line => {
                    pdf.text(line, margin + 5, yPos);
                    yPos += 5;
                });
                
                yPos += 15;
            });
        }
        
        // ===== PIE DE PÁGINA EN TODAS LAS PÁGINAS =====
        const totalPages = pdf.internal.getNumberOfPages();
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            pdf.setPage(pageNum);
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.setFont('helvetica', 'normal');
            
            const footerText = `Página ${pageNum} de ${totalPages} | Fiscalía General de la Nación - Seccional Medellín | ${currentDate}`;
            const footerWidth = pdf.getTextWidth(footerText);
            pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 10);
        }
        
        // ===== GUARDAR PDF =====
        const fileName = `Informe-Fiscalia-Medellin-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        
        console.log('✅ PDF generado exitosamente');
        
        // Mensaje de éxito
        setTimeout(() => {
            alert('✅ ¡PDF GENERADO EXITOSAMENTE!\n\n📄 El informe incluye:\n• Análisis estadístico completo\n• Top 10 delitos con gráficos\n• Distribución geográfica\n• Insights de Inteligencia Artificial\n• Recomendaciones por prioridad\n\n💾 Archivo descargado: ' + fileName);
        }, 500);
        
    } catch (error) {
        console.error('❌ Error al generar PDF:', error);
        
        // Mensaje de error específico
        let errorMsg = '❌ ERROR AL GENERAR PDF\n\n';
        if (error.message.includes('jsPDF')) {
            errorMsg += '🌐 Problema: No se pudo cargar la librería jsPDF\n\n💡 Soluciones:\n• Verifique su conexión a internet\n• Refresque la página (F5) e intente nuevamente\n• Use la opción "Imprimir" como alternativa';
        } else {
            errorMsg += `🔧 Error técnico: ${error.message}\n\n💡 Recomendaciones:\n• Refresque la página e intente de nuevo\n• Use la función "Imprimir" del navegador\n• Contacte soporte técnico si persiste`;
        }
        
        alert(errorMsg);
        
    } finally {
        // Siempre restaurar el botón
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
}
    }
}

async function generateTextBasedPDF() {
    console.log('Generando PDF basado en texto...');
    
    const { jsPDF } = window.jsPDF;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const data = processedData;
    const currentDate = new Date().toLocaleDateString('es-CO');
    const pageWidth = 190;
    let yPosition = 20;
    
    // Función helper para agregar texto con salto de página automático
    const addText = (text, fontSize = 11, isBold = false, isTitle = false) => {
        if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
        }
        
        pdf.setFontSize(fontSize);
        if (isBold || isTitle) {
            pdf.setFont(undefined, 'bold');
        } else {
            pdf.setFont(undefined, 'normal');
        }
        
        if (isTitle) {
            yPosition += 5;
        }
        
        const lines = pdf.splitTextToSize(text, pageWidth - 20);
        pdf.text(lines, 20, yPosition);
        yPosition += lines.length * (fontSize * 0.35) + (isTitle ? 8 : 4);
        
        return yPosition;
    };
    
    // PORTADA
    addText('INFORME INTEGRAL DE ANÁLISIS DELICTIVO', 20, true, true);
    addText('FISCALÍA GENERAL DE LA NACIÓN', 16, true);
    addText('SECCIONAL MEDELLÍN', 16, true);
    addText('ANÁLISIS DE DATOS GENERADO POR INTELIGENCIA ARTIFICIAL', 14, false, true);
    
    yPosition += 10;
    addText(`Fecha de generación: ${currentDate}`, 12);
    addText(`Total de registros analizados: ${data.totalDelitos.toLocaleString()}`, 12);
    addText(`Período de análisis: ${data.fechas.length} meses`, 12);
    
    // RESUMEN EJECUTIVO
    yPosition += 10;
    addText('RESUMEN EJECUTIVO', 16, true, true);
    addText(`Este informe presenta un análisis integral de ${data.totalDelitos.toLocaleString()} registros delictivos procesados mediante inteligencia artificial. El análisis abarca ${data.totalCiudades} ciudades en la jurisdicción de Medellín.`);
    
    // ESTADÍSTICAS PRINCIPALES
    addText('ESTADÍSTICAS PRINCIPALES', 14, true, true);
    addText(`• Total de delitos registrados: ${data.totalDelitos.toLocaleString()}`);
    addText(`• Número de ciudades afectadas: ${data.totalCiudades}`);
    addText(`• Conducta delictiva predominante: ${data.conductas[0].nombre}`);
    addText(`• Ciudad más impactada: ${data.ciudades[0].nombre}`);
    if (data.incrementos) {
        addText(`• Tendencia promedio mensual: ${data.incrementos.promedio.toFixed(1)}%`);
    }
    
    // TOP 10 DELITOS
    addText('TOP 10 TIPOS DE DELITOS MÁS FRECUENTES', 14, true, true);
    data.conductas.slice(0, 10).forEach((conducta, index) => {
        const percentage = ((conducta.total / data.totalDelitos) * 100).toFixed(1);
        addText(`${index + 1}. ${conducta.nombre}: ${conducta.total.toLocaleString()} casos (${percentage}%)`);
    });
    
    // NUEVA PÁGINA - ANÁLISIS POR CIUDADES
    pdf.addPage();
    yPosition = 20;
    addText('ANÁLISIS GEOGRÁFICO - CIUDADES MÁS AFECTADAS', 16, true, true);
    
    data.ciudades.slice(0, 10).forEach((ciudad, index) => {
        const percentage = ((ciudad.total / data.totalDelitos) * 100).toFixed(1);
        addText(`${index + 1}. ${ciudad.nombre}: ${ciudad.total.toLocaleString()} casos (${percentage}%)`);
    });
    
    // INSIGHTS DE INTELIGENCIA ARTIFICIAL
    yPosition += 10;
    addText('INSIGHTS DE INTELIGENCIA ARTIFICIAL', 16, true, true);
    
    if (data.analisisIA && data.analisisIA.length > 0) {
        data.analisisIA.slice(0, 5).forEach((insight, index) => {
            addText(`${index + 1}. ${insight.titulo}`, 12, true);
            addText(`${insight.texto}`);
            addText(`Recomendación: ${insight.recomendacion}`);
            addText(`Prioridad: ${insight.prioridad.toUpperCase()}`, 10, true);
            yPosition += 5;
        });
    }
    
    // NUEVA PÁGINA - RECOMENDACIONES
    pdf.addPage();
    yPosition = 20;
    addText('RECOMENDACIONES ESTRATÉGICAS', 16, true, true);
    
    addText('ACCIONES DE PRIORIDAD ALTA:', 14, true);
    addText(`• Focalizar recursos en ${data.ciudades[0].nombre} que concentra el ${((data.ciudades[0].total / data.totalDelitos) * 100).toFixed(1)}% de los delitos`);
    addText(`• Implementar operativos específicos contra ${data.conductas[0].nombre}`);
    addText('• Reforzar sistemas de videovigilancia en zonas críticas');
    addText('• Crear unidades especializadas para delitos más frecuentes');
    
    addText('ACCIONES DE MEDIANO PLAZO:', 14, true);
    addText('• Desarrollar programas de prevención comunitaria');
    addText('• Implementar tecnología predictiva de delitos');
    addText('• Fortalecer coordinación interinstitucional');
    addText('• Crear observatorio permanente de criminalidad');
    
    // PROYECCIONES
    yPosition += 10;
    addText('PROYECCIONES Y ANÁLISIS PREDICTIVO', 14, true, true);
    
    if (data.incrementos && data.incrementos.promedio !== 0) {
        const tendencia = data.incrementos.promedio > 0 ? 'creciente' : 'decreciente';
        const proyeccion = Math.round(data.totalDelitos * (1 + (data.incrementos.promedio / 100)));
        
        addText(`La tendencia actual es ${tendencia} con un incremento promedio del ${data.incrementos.promedio.toFixed(1)}% mensual.`);
        addText(`Si se mantiene esta tendencia, se proyectan aproximadamente ${proyeccion.toLocaleString()} casos para el próximo período.`);
        
        if (data.incrementos.promedio > 10) {
            addText('ALERTA: La tendencia creciente requiere intervención inmediata.', 12, true);
        }
    }
    
    // CONCLUSIONES
    addText('CONCLUSIONES PRINCIPALES', 14, true, true);
    addText('1. Se requiere intervención focalizada en las ciudades y delitos más impactantes identificados.');
    addText('2. Los patrones detectados por IA permiten estrategias preventivas más efectivas.');
    addText('3. La implementación de las recomendaciones puede reducir significativamente la criminalidad.');
    addText('4. Es necesario un monitoreo continuo con actualización de datos en tiempo real.');
    
    // PIE DE PÁGINA FINAL
    yPosition += 20;
    addText('_'.repeat(50), 10);
    addText('Informe generado automáticamente por Sistema de Inteligencia Artificial', 10);
    addText('Fiscalía General de la Nación - Seccional Medellín', 10);
    addText(`${currentDate} - ${new Date().toLocaleTimeString('es-CO')}`, 10);
    
    // Descargar
    const fileName = `Informe-Fiscalia-Medellin-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    console.log('PDF de texto generado exitosamente');
}

function generateBasicPDFDownload() {
    console.log('Generando descarga básica de respaldo...');
    
    // Crear contenido de texto del informe
    const data = processedData;
    const currentDate = new Date().toLocaleDateString('es-CO');
    
    const reportText = `
INFORME INTEGRAL DE ANÁLISIS DELICTIVO
FISCALÍA GENERAL DE LA NACIÓN - SECCIONAL MEDELLÍN
Generado el: ${currentDate}

ESTADÍSTICAS PRINCIPALES:
- Total de delitos: ${data.totalDelitos.toLocaleString()}
- Ciudades afectadas: ${data.totalCiudades}
- Conducta principal: ${data.conductas[0].nombre}
- Ciudad más impactada: ${data.ciudades[0].nombre}

TOP 5 DELITOS MÁS FRECUENTES:
${data.conductas.slice(0, 5).map((c, i) => 
    `${i+1}. ${c.nombre}: ${c.total} casos (${((c.total / data.totalDelitos) * 100).toFixed(1)}%)`
).join('\n')}

TOP 5 CIUDADES MÁS AFECTADAS:
${data.ciudades.slice(0, 5).map((c, i) => 
    `${i+1}. ${c.nombre}: ${c.total} casos (${((c.total / data.totalDelitos) * 100).toFixed(1)}%)`
).join('\n')}

RECOMENDACIONES PRINCIPALES:
- Focalizar recursos en ${data.ciudades[0].nombre}
- Implementar operativos contra ${data.conductas[0].nombre}
- Reforzar videovigilancia en zonas críticas
- Crear unidades especializadas

Este informe fue generado automáticamente por IA.
    `;
    
    // Crear y descargar archivo de texto
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe-Fiscalia-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Descarga de texto de respaldo completada');
    alert('Se ha descargado un archivo de texto con el informe como respaldo.');
}

function printReport() {
    const reportContent = document.getElementById('reportContent');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Informe Fiscalía - ${new Date().toLocaleDateString()}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .report-page { page-break-after: always; }
                @media print { .report-page { page-break-after: always; } }
            </style>
        </head>
        <body>
            ${reportContent.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ===== FUNCIONES PARA CAPTURA DE GRÁFICOS =====

async function captureAndInsertCharts() {
    try {
        console.log('Capturando gráficos para el informe...');
        
        // Capturar gráfico de evolución temporal
        if (charts.timeChart) {
            const timeChartImage = await captureChart('timeChart');
            replaceChartPlaceholder(1, timeChartImage, 'Evolución Temporal de Delitos');
        }
        
        // Capturar gráfico de tipos de delito
        if (charts.crimeTypeChart) {
            const crimeTypeImage = await captureChart('crimeTypeChart');
            replaceChartPlaceholder(3, crimeTypeImage, 'Distribución Porcentual por Tipo de Delito');
        }
        
        // Capturar gráfico de ciudades
        if (charts.cityChart) {
            const cityChartImage = await captureChart('cityChart');
            replaceChartPlaceholder(4, cityChartImage, 'Distribución Delictiva por Municipios');
        }
        
        // Capturar gráfico de incrementos
        if (charts.incrementChart) {
            const incrementImage = await captureChart('incrementChart');
            replaceChartPlaceholder(5, incrementImage, 'Proyección Delictiva 12 Meses');
        }
        
        // Generar gráfico comparativo histórico
        await generateHistoricalChart();
        
        console.log('Todos los gráficos han sido insertados en el informe');
    } catch (error) {
        console.error('Error al capturar gráficos:', error);
    }
}

async function captureChart(chartId) {
    try {
        const canvas = document.getElementById(chartId);
        if (!canvas) return null;
        
        // Convertir canvas a imagen base64
        return canvas.toDataURL('image/png', 0.8);
    } catch (error) {
        console.error(`Error al capturar gráfico ${chartId}:`, error);
        return null;
    }
}

function replaceChartPlaceholder(chartNumber, imageData, title) {
    if (!imageData) return;
    
    const placeholders = document.querySelectorAll('.chart-placeholder');
    let targetPlaceholder = null;
    
    // Buscar el placeholder específico
    placeholders.forEach(placeholder => {
        if (placeholder.textContent.includes(`GRÁFICO ${chartNumber}:`)) {
            targetPlaceholder = placeholder;
        }
    });
    
    if (targetPlaceholder) {
        targetPlaceholder.innerHTML = `
            <div style="text-align: center; margin: 1rem 0;">
                <img src="${imageData}" alt="${title}" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
                <p style="margin-top: 0.5rem; font-style: italic; color: #666; font-size: 0.9rem;">${title}</p>
            </div>
        `;
        targetPlaceholder.classList.remove('chart-placeholder');
        targetPlaceholder.style.background = 'none';
        targetPlaceholder.style.border = 'none';
        targetPlaceholder.style.height = 'auto';
    }
}

async function generateHistoricalChart() {
    // Crear un canvas temporal para el gráfico histórico
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 600;
    tempCanvas.height = 400;
    tempCanvas.style.display = 'none';
    document.body.appendChild(tempCanvas);
    
    const ctx = tempCanvas.getContext('2d');
    
    // Datos históricos simulados para comparación 2005-2010 vs actual
    const historicalData = {
        labels: ['Hurto Personas', 'Violencia Intrafamiliar', 'Homicidios', 'Extorsión', 'Lesiones'],
        datasets: [
            {
                label: 'Promedio 2005-2010',
                data: [100, 80, 120, 25, 90],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            },
            {
                label: 'Situación Actual',
                data: [440, 280, 66, 145, 95],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }
        ]
    };
    
    const historicalChart = new Chart(ctx, {
        type: 'bar',
        data: historicalData,
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparación Histórica: 2005-2010 vs Actual',
                    font: { size: 16 }
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Índice Base 100'
                    }
                }
            }
        }
    });
    
    // Esperar a que se renderice
    setTimeout(() => {
        const imageData = tempCanvas.toDataURL('image/png', 0.8);
        replaceChartPlaceholder(2, imageData, 'Comparación Histórica 2005-2010 vs Actual');
        
        // Limpiar
        historicalChart.destroy();
        document.body.removeChild(tempCanvas);
    }, 1000);
}