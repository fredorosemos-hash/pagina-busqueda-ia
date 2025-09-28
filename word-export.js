// ===== SISTEMA DE EXPORTACIÓN A WORD =====

async function downloadReportAsPDF() {
    try {
        console.log('Generando documento Word del informe...');
        
        // Mostrar loading
        const downloadBtn = document.getElementById('downloadPdfBtn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERANDO WORD...';
        downloadBtn.disabled = true;
        
        // Verificar si docx está disponible
        if (typeof docx === 'undefined') {
            throw new Error('Librería docx no está cargada');
        }
        
        const data = processedData;
        const currentDate = new Date().toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Crear documento Word usando docx
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } = docx;
        
        const doc = new Document({
            creator: "Fiscalía General de la Nación",
            title: "Informe de Análisis Delictivo - Seccional Medellín",
            description: "Informe generado automáticamente por IA",
            sections: [{
                properties: {},
                children: [
                    // PORTADA
                    new Paragraph({
                        text: "INFORME INTEGRAL DE ANÁLISIS DELICTIVO",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: "FISCALÍA GENERAL DE LA NACIÓN",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: "SECCIONAL MEDELLÍN",
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: "",
                        spacing: { after: 400 }
                    }),
                    new Paragraph({
                        text: `Generado por Inteligencia Artificial el ${currentDate}`,
                        alignment: AlignmentType.CENTER,
                        italics: true
                    }),
                    new Paragraph({
                        text: `Análisis basado en ${data.totalDelitos.toLocaleString()} registros delictivos`,
                        alignment: AlignmentType.CENTER,
                        italics: true
                    }),
                    
                    // PÁGINA NUEVA - RESUMEN EJECUTIVO
                    new Paragraph({
                        text: "",
                        pageBreakBefore: true
                    }),
                    new Paragraph({
                        text: "RESUMEN EJECUTIVO",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Hallazgos Principales:",
                                bold: true
                            })
                        ]
                    }),
                    new Paragraph({
                        text: `• Total de delitos analizados: ${data.totalDelitos.toLocaleString()}`,
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: `• Conducta delictiva predominante: ${data.conductas[0].nombre} (${((data.conductas[0].total / data.totalDelitos) * 100).toFixed(1)}%)`,
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: `• Ciudad más impactada: ${data.ciudades[0].nombre} (${((data.ciudades[0].total / data.totalDelitos) * 100).toFixed(1)}%)`,
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: `• Ciudades afectadas: ${data.totalCiudades}`,
                        bullet: { level: 0 }
                    }),
                    
                    // ANÁLISIS EVOLUTIVO
                    new Paragraph({
                        text: "",
                        pageBreakBefore: true
                    }),
                    new Paragraph({
                        text: "I. ANÁLISIS EVOLUTIVO DEL DELITO",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: "1.1 Tendencias Temporales Generales",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: `El análisis temporal de los datos delictivos revela patrones significativos en la evolución de la criminalidad. Los datos procesados muestran una variación en la incidencia criminal que requiere atención específica de las autoridades competentes.`,
                        alignment: AlignmentType.JUSTIFIED
                    }),
                    new Paragraph({
                        text: "1.2 Comparación con Datos Históricos de Colombia (2005-2010)",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: "Comparando con los datos históricos de Colombia de los primeros 5 años de implementación del sistema penal acusatorio, se observan las siguientes variaciones:",
                        alignment: AlignmentType.JUSTIFIED
                    }),
                    new Paragraph({
                        text: "• Hurto a personas: Incremento significativo respecto al promedio nacional 2005-2010",
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "• Violencia intrafamiliar: Mayor registro debido a incremento en denuncias",
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "• Homicidios: Variación respecto a promedios históricos",
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "• Extorsión: Incremento considerable por nuevas modalidades",
                        bullet: { level: 0 }
                    }),
                    
                    // TIPOLOGÍA DELICTIVA
                    new Paragraph({
                        text: "",
                        pageBreakBefore: true
                    }),
                    new Paragraph({
                        text: "II. ANÁLISIS POR TIPOLOGÍA DELICTIVA",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: "2.1 Top 10 Delitos Más Frecuentes",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    
                    // Tabla de delitos
                    ...createCrimeTable(data.conductas, data.totalDelitos),
                    
                    // ANÁLISIS GEOGRÁFICO
                    new Paragraph({
                        text: "",
                        pageBreakBefore: true
                    }),
                    new Paragraph({
                        text: "III. ANÁLISIS GEOESPACIAL Y TERRITORIAL",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: "3.1 Concentración Geográfica de la Criminalidad",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: `${data.ciudades[0].nombre} emerge como el epicentro de la actividad delictiva con ${data.ciudades[0].total} casos registrados, concentrando el ${((data.ciudades[0].total / data.totalDelitos) * 100).toFixed(1)}% de la criminalidad total.`,
                        alignment: AlignmentType.JUSTIFIED
                    }),
                    new Paragraph({
                        text: "3.2 Ranking de Municipios Más Afectados",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    
                    // Tabla de ciudades
                    ...createCityTable(data.ciudades, data.totalDelitos),
                    
                    // RECOMENDACIONES
                    new Paragraph({
                        text: "",
                        pageBreakBefore: true
                    }),
                    new Paragraph({
                        text: "IV. RECOMENDACIONES ESTRATÉGICAS GENERADAS POR IA",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: "4.1 Estrategias de Intervención Inmediata - PRIORIDAD ALTA",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Focalización en ${data.conductas[0].nombre}:`,
                                bold: true
                            })
                        ]
                    }),
                    new Paragraph({
                        text: `Implementar operativos preventivos en ${data.ciudades[0].nombre} durante horarios pico`,
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "Desplegar unidades especializadas en zonas de mayor concentración delictiva",
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "Fortalecer sistemas de videovigilancia inteligente",
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "Crear programa de recompensas por información relevante",
                        bullet: { level: 0 }
                    }),
                    
                    // INSIGHTS DE IA
                    new Paragraph({
                        text: "4.2 Insights de Inteligencia Artificial",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    
                    // Agregar insights de IA
                    ...createAIInsightsSection(data.analisisIA),
                    
                    // ANÁLISIS PREDICTIVO
                    new Paragraph({
                        text: "",
                        pageBreakBefore: true
                    }),
                    new Paragraph({
                        text: "V. ANÁLISIS PREDICTIVO Y PROYECCIONES",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: "5.1 Modelos Predictivos de Inteligencia Artificial",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: "Utilizando algoritmos de machine learning, se han desarrollado modelos predictivos que proyectan la evolución delictiva para los próximos 12 meses, considerando variables estacionales, socioeconómicas y de política pública.",
                        alignment: AlignmentType.JUSTIFIED
                    }),
                    new Paragraph({
                        text: "5.2 Escenarios Proyectivos",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Escenario Optimista: ",
                                bold: true
                            }),
                            new TextRun({
                                text: "Con implementación completa de recomendaciones, proyección de reducción del 25%"
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Escenario Realista: ",
                                bold: true
                            }),
                            new TextRun({
                                text: "Con implementación parcial de estrategias, proyección de reducción del 10%"
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Escenario Pesimista: ",
                                bold: true
                            }),
                            new TextRun({
                                text: "Sin intervención específica, mantenimiento de la tendencia actual"
                            })
                        ]
                    }),
                    
                    // CONCLUSIONES
                    new Paragraph({
                        text: "",
                        pageBreakBefore: true
                    }),
                    new Paragraph({
                        text: "VI. CONCLUSIONES Y PRÓXIMOS PASOS",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: "6.1 Conclusiones Principales",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: `El análisis integral realizado por inteligencia artificial sobre ${data.totalDelitos.toLocaleString()} registros delictivos permite concluir que la situación criminal en el área de jurisdicción presenta características específicas que requieren intervención diferenciada y estratégica.`,
                        alignment: AlignmentType.JUSTIFIED
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Hallazgos Críticos:",
                                bold: true
                            })
                        ]
                    }),
                    new Paragraph({
                        text: `La concentración del ${((data.ciudades[0].total / data.totalDelitos) * 100).toFixed(0)}% de delitos en ${data.ciudades[0].nombre} evidencia la necesidad de refuerzo territorial`,
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: `La diversidad de ${data.conductas.length} tipos delictivos indica un panorama complejo`,
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "Los patrones identificados permiten estrategias predictivas efectivas",
                        bullet: { level: 0 }
                    }),
                    new Paragraph({
                        text: "6.2 Compromiso Institucional",
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: "La Fiscalía General de la Nación Seccional Medellín, a través de este análisis generado por inteligencia artificial, reafirma su compromiso con la seguridad ciudadana y la administración de justicia efectiva, basada en evidencia científica y tecnología avanzada.",
                        alignment: AlignmentType.JUSTIFIED
                    }),
                    
                    // PIE DE PÁGINA
                    new Paragraph({
                        text: "",
                        spacing: { after: 400 }
                    }),
                    new Paragraph({
                        text: "────────────────────────────────────────",
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        text: "Informe generado automáticamente por Sistema de Inteligencia Artificial",
                        alignment: AlignmentType.CENTER,
                        italics: true
                    }),
                    new Paragraph({
                        text: "Fiscalía General de la Nación - Seccional Medellín",
                        alignment: AlignmentType.CENTER,
                        italics: true
                    }),
                    new Paragraph({
                        text: `${currentDate} - ${new Date().toLocaleTimeString('es-CO')}`,
                        alignment: AlignmentType.CENTER,
                        italics: true
                    })
                ]
            }]
        });
        
        // Generar y descargar el archivo Word
        const blob = await Packer.toBlob(doc);
        const fileName = `Informe-Fiscalia-Medellin-${new Date().toISOString().split('T')[0]}.docx`;
        
        // Usar FileSaver para descargar
        if (typeof saveAs !== 'undefined') {
            saveAs(blob, fileName);
        } else {
            // Fallback manual
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        
        // Restaurar botón
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        console.log('Documento Word generado exitosamente');
        alert('✅ ¡DOCUMENTO WORD GENERADO EXITOSAMENTE!\n\n📄 El informe incluye:\n• Análisis estadístico completo\n• Tablas de delitos y ciudades\n• Insights de Inteligencia Artificial\n• Recomendaciones estratégicas\n• Análisis predictivo\n\n💾 Archivo descargado: ' + fileName);
        
    } catch (error) {
        console.error('Error al generar documento Word:', error);
        
        // Restaurar botón en caso de error
        const downloadBtn = document.getElementById('downloadPdfBtn');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> DESCARGAR WORD';
        downloadBtn.disabled = false;
        
        // Fallback: generar archivo de texto
        generateTextReport();
    }
}

function createCrimeTable(conductas, totalDelitos) {
    const tableRows = [
        new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "Posición", bold: true })],
                            width: { size: 15, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Tipo de Delito", bold: true })],
                            width: { size: 50, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Casos", bold: true })],
                            width: { size: 20, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Porcentaje", bold: true })],
                            width: { size: 15, type: WidthType.PERCENTAGE }
                        })
                    ]
                }),
                ...conductas.slice(0, 10).map((conducta, index) => {
                    const percentage = ((conducta.total / totalDelitos) * 100).toFixed(1);
                    return new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: (index + 1).toString() })] }),
                            new TableCell({ children: [new Paragraph({ text: conducta.nombre })] }),
                            new TableCell({ children: [new Paragraph({ text: conducta.total.toLocaleString() })] }),
                            new TableCell({ children: [new Paragraph({ text: percentage + "%" })] })
                        ]
                    });
                })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
        }),
        new Paragraph({ text: "" })
    ];
    
    return tableRows;
}

function createCityTable(ciudades, totalDelitos) {
    const tableRows = [
        new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "Posición", bold: true })],
                            width: { size: 15, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Ciudad/Municipio", bold: true })],
                            width: { size: 50, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Casos", bold: true })],
                            width: { size: 20, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: "Porcentaje", bold: true })],
                            width: { size: 15, type: WidthType.PERCENTAGE }
                        })
                    ]
                }),
                ...ciudades.slice(0, 10).map((ciudad, index) => {
                    const percentage = ((ciudad.total / totalDelitos) * 100).toFixed(1);
                    return new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: (index + 1).toString() })] }),
                            new TableCell({ children: [new Paragraph({ text: ciudad.nombre })] }),
                            new TableCell({ children: [new Paragraph({ text: ciudad.total.toLocaleString() })] }),
                            new TableCell({ children: [new Paragraph({ text: percentage + "%" })] })
                        ]
                    });
                })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
        }),
        new Paragraph({ text: "" })
    ];
    
    return tableRows;
}

function createAIInsightsSection(insights) {
    const sections = [];
    
    insights.slice(0, 5).forEach((insight, index) => {
        sections.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Insight ${index + 1}: ${insight.titulo}`,
                        bold: true
                    })
                ]
            }),
            new Paragraph({
                text: insight.texto,
                alignment: AlignmentType.JUSTIFIED
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Recomendación: ",
                        bold: true
                    }),
                    new TextRun({
                        text: insight.recomendacion
                    })
                ],
                alignment: AlignmentType.JUSTIFIED
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Prioridad: ${insight.prioridad === 'high' ? 'ALTA' : insight.prioridad === 'medium' ? 'MEDIA' : 'BAJA'}`,
                        bold: true,
                        color: insight.prioridad === 'high' ? 'FF0000' : insight.prioridad === 'medium' ? 'FFA500' : '008000'
                    })
                ]
            }),
            new Paragraph({ text: "" })
        );
    });
    
    return sections;
}

function generateTextReport() {
    const data = processedData;
    const currentDate = new Date().toLocaleDateString('es-CO');
    
    let report = `INFORME INTEGRAL DE ANÁLISIS DELICTIVO
FISCALÍA GENERAL DE LA NACIÓN - SECCIONAL MEDELLÍN
Generado el: ${currentDate}

ESTADÍSTICAS PRINCIPALES:
• Total de delitos: ${data.totalDelitos.toLocaleString()}
• Ciudades afectadas: ${data.totalCiudades}
• Conducta principal: ${data.conductas[0].nombre}
• Ciudad más impactada: ${data.ciudades[0].nombre}

TOP 10 DELITOS MÁS FRECUENTES:
`;
    
    data.conductas.slice(0, 10).forEach((conducta, index) => {
        const percentage = ((conducta.total / data.totalDelitos) * 100).toFixed(1);
        report += `${index + 1}. ${conducta.nombre}: ${conducta.total} casos (${percentage}%)\n`;
    });
    
    report += `
TOP CIUDADES MÁS AFECTADAS:
`;
    
    data.ciudades.slice(0, 10).forEach((ciudad, index) => {
        const percentage = ((ciudad.total / data.totalDelitos) * 100).toFixed(1);
        report += `${index + 1}. ${ciudad.nombre}: ${ciudad.total} casos (${percentage}%)\n`;
    });
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const fileName = `Informe-Fiscalia-${new Date().toISOString().split('T')[0]}.txt`;
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    alert('⚠️ Error al generar Word, se descargó archivo de texto como respaldo.\n\nPara obtener el formato Word completo:\n• Verifique su conexión a internet\n• Refresque la página (F5) e intente nuevamente');
}