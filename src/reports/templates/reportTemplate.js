import { reportStyles }
from "../styles/reportStyles.js";

import { buildCoverSection } from "../partials/coverSection.js";
import { buildHeader } from "../partials/header.js";
import { buildHeaderData } from "../partials/headerData.js";
import { buildFooter } from "../partials/footer.js";
import { buildSummarySection } from "../partials/summarySection.js";
import { buildCardsSection } from "../partials/cardsSection.js";
import { buildMapSection } from "../partials/mapSection.js";
import { buildChartsSection } from "../partials/chartsSection.js";
import { buildSingleChart } from "../partials/singleChart.js";
import { buildTableSection } from "../partials/tableSection.js";
//import { buildFiltersSection } from "../partials/filtersSection.js";

export const buildReportTemplate = (
    reportData
) => `

<!DOCTYPE html>

<html>

<head>
<meta charset="UTF-8"/>
${reportStyles()}
</head>

<body>

<div class="page">

${buildCoverSection(reportData)}

<!--${buildHeader({
    header:
        reportData.metadata.header
})}-->

${buildHeaderData({
    title:
        reportData.metadata.title,

    subtitle:
        reportData.metadata.subtitle,

    generatedAt:
        reportData.metadata.generatedAt,

    logo:
        reportData.metadata.logo,

    reportVersion:
        reportData.metadata.reportVersion
})}

${buildSummarySection(reportData)}

${buildCardsSection(reportData)}

${buildSingleChart(
    reportData.charts.evolucion,
    false,
    "100%",
    "350px"
)}

${buildSingleChart(
    reportData.charts.provincia,
    true,
    "100%",
    "350px"
)}

${buildMapSection(reportData)}

${buildTableSection(
    "Recuento de alertas por año",
    "Periodo (Año)",
    "Recuento de alertas tempranas por deforestación SATA, registradas en un periodo anual.",
    true,
    reportData.stats.anio
)}

${buildSingleChart(
    reportData.charts.anios,
    false,
    "400px",
    "auto"
)}

<!--${buildChartsSection(reportData)}-->

${buildTableSection(
    "Alertas por Delimitación Ambiental",
    "Delimitación Ambiental",
    "Unidades de delimitación ambiental definidas por el MAE, las cuales agrupan espacios naturales bajo diferentes regímenes de protección, conservación y manejo sostenible.",
    false,
    reportData.stats.delimitacion
)}

${buildSingleChart(
    reportData.charts.delimitacion,
    false,
    "400px",
    "auto"
)}

${buildTableSection(
    "Alertas por Severidad",
    "Severidad",
    "Grado de severidad definida a partir de la extensión superficial de las perturbaciones y/o alteraciones identificadas.",
    false,
    reportData.stats.severidad
)}

${buildSingleChart(
    reportData.charts.severidad,
    false,
    "400px",
    "auto"
)}

${buildTableSection(
    "Alertas por Provincia",
    "Provincia",
    "",
    false,
    reportData.stats.provincia
)}



<!--${buildTableSection(
    "Alertas por Canton",
    "Canton",
    "",
    true,
    reportData.stats.canton
)}-->

${buildFooter()}

</div>

</body>

</html>
`;