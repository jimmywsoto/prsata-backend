export const buildSummarySection = (
    reportData
) => {

    const stats =
        reportData.stats;

    return `
    <section class="section">

        <div class="section-title">
            Resumen Ejecutivo
        </div>

        <div class="summary-box">

            <p>
                Durante el periodo evaluado
                se registraron un total de 
                <strong>
                    ${stats.total}
                </strong>
                Alertas Tempranas por Deforestación SATA 
                a nivel del Ecuador continental.
            </p>

            <p>
                La información presentada
                corresponde a los filtros
                aplicados por el usuario
                al momento de generar el
                informe.
            </p>

        </div>

    </section>
    `;
};