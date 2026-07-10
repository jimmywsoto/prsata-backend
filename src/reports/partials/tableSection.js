export const buildTableSection = (
    title,
    field,
    description,
    breaking,
    rows
) => {

    const aliase = {
        "ABC-PSB": "Áreas Bajo Conservación Plan Socio Bosque",
        "BVP": "Bosques y Vegetación Protectora",
        "PFE": "Patrimonio Forestal del Estado",
        "PFN": "Patrimonio Forestal Nacional",
        "SNAP": "Sistema Nacional de Áreas Protegidas",
        "MANGLAR": "Ecosistemas de Manglar",
        "ALTA": "Severidad mayor a 0.7 ha",
        "MEDIA": "Severidad 0.3 - 0.7 ha",
        "BAJA": "Severidad menor a 0.3 ha"
    }

    const body =
        rows
            .map(
                ([label, value]) => `
                <tr>
                    <td>${aliase[label] || label}</td>
                    <td>${value}</td>
                </tr>
            `
            )
            .join("");

    const setBreaking = breaking ? "page-break" : "";

    

    return `
    <section class="section ${setBreaking}">

        <div class="section-title">
            ${title}
        </div>
            
        <div>
            ${description}
        </div>

        </br>

        <div class="table-container">
            <table>

                <thead>
                    <tr>
                        <th>${field || 'Clase'}</th>
                        <th>Recuento</th>
                    </tr>
                </thead>

                <tbody>
                    ${body}
                </tbody>

            </table>
        </div>
        
    </section>
    `;
};