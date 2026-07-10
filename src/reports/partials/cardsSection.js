export const buildCardsSection = (
    reportData
) => {

    const stats =
        reportData.stats;

    let severityHigh = 0;
    let severityMedium = 0;
    let severityLow = 0;

    stats.severidad.map(([label, value]) => {
        if(label === "ALTA") {severityHigh = value};
        if(label === "MEDIA") {severityMedium = value};
        if(label === "BAJA") {severityLow = value};
    })

    return `
    <section class="section">

        <div class="section-title">
            Indicadores Generales
        </div>

        <div class="cards-container">
            <div class="cards">

                <div class="card">
                    <div class="card-value">
                        ${stats.total}
                    </div>

                    <div class="card-label">
                        Total Alertas
                    </div>
                </div>

                <div class="card">
                    <div class="card-value">
                        ${
                            stats.provincia?.length ??
                            0
                        }
                    </div>

                    <div class="card-label">
                        Provincias en Alerta
                    </div>
                </div>

                <div class="card">
                    <div class="card-value">
                        ${
                            stats.delimitacion
                                ?.length ?? 0
                        }
                    </div>

                    <div class="card-label">
                        Delimitaciones en Alerta
                    </div>
                </div>
            
            </div>
        
            <div class="cards">

                <div class="card">
                    <div class="card-value">
                        ${severityHigh || 0}
                    </div>

                    <div class="card-label">
                        Alertas con Severidad Alta
                    </div>
                </div>

                <div class="card">
                    <div class="card-value">
                        ${severityMedium || 0}
                    </div>

                    <div class="card-label">
                        Alertas con Severidad Media
                    </div>
                </div>

                <div class="card">
                    <div class="card-value">
                        ${severityLow || 0}
                    </div>

                    <div class="card-label">
                        Alertas con Severidad Baja
                    </div>
                </div>
            
            </div>


        </div>

    </section>
    `;
};