export const buildChartsSection = (
    reportData
) => {

    const charts =
        reportData.charts;

    return `
    <section class="section page-break">

        <div class="section-title">
            Estadísticas
        </div>

        <div class="chart-container">
            <div class="chart-grid-one">

                ${
                    charts.provincia
                        ? `
                    <img
                        class="chart-image"
                        src="${charts.provincia}"
                    />
                    `
                        : ""
                }

            </div>

            <div class="chart-grid-two">

                ${
                    charts.severidad
                        ? `
                    <img
                        class="chart-image"
                        src="${charts.severidad}"
                    />
                    `
                        : ""
                }

                ${
                    charts.periodo
                        ? `
                    <img
                        class="chart-image"
                        src="${charts.periodo}"
                    />
                    `
                        : ""
                }

            </div>
        </div>
        

    </section>
    `;
};