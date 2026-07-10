export function buildFiltersSection(
  reportData
) {

  const filters =
    reportData.filters;

  const items =
    Object.entries(filters)
      .map(
        ([key, values]) => {

          const value =
            Array.isArray(values)
              ? values.join(", ")
              : values;

          return `
            <tr>
              <td>${key}</td>
              <td>${value}</td>
            </tr>
          `;
        }
      )
      .join("");

  return `
    <section class="section">

      <div class="section-title">
        Parámetros del Informe
      </div>

      <table>

        <thead>
          <tr>
            <th>Filtro</th>
            <th>Valor</th>
          </tr>
        </thead>

        <tbody>
          ${items}
        </tbody>

      </table>

    </section>
  `;
}