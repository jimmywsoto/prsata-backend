export function buildCoverSection(
  reportData
) {
  return `
  <section
      class="cover">

      <img
        class="cover-logo"
        src="${reportData.metadata.logo}"
      />

      <h1>
        MINISTERIO DE AMBIENTE Y ENERGÍA
      </h1>

      <h1>
        ${reportData.metadata.subtitle}
      </h1>

      <h1>
        ${reportData.metadata.title}
      </h1>

      <h2>
        Periodo: ${reportData.metadata.period} de ${reportData.metadata.anio}
      </h2>

      <p>
        PR-SATA | Report versión: ${reportData.metadata.reportVersion} </br>
        Fecha de impresión: ${reportData.metadata.generatedAt}
      </p>

  </section>
  `;
}