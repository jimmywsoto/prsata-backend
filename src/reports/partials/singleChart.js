export const buildSingleChart = (
    chart,
    breaking,
    width = "300px",
    height = "400px"
) => {

    const setBreaking = breaking ? "page-break" : "";

    return `
        <section class="section">

            <div class="chart-container">
                ${chart ? 
                    `
                        <img
                            class="chart-single"
                            style="height:${height};width:${width};"
                            src="${chart}"
                        />
                    `
                    : ""
                }
            </div>
            
        </section>
    `;
};