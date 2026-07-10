import { buildReportTemplate } from "../reports/templates/reportTemplate.js";

export const generateReport = async (reportData) => {

    const html =
        buildReportTemplate(
            reportData
        );
    
    //console.log(html);
    /*await page.setContent(
        html,
        {
            waitUntil:
                "networkidle0"
        }
    );

    const pdf =
        await page.pdf({
            format: "A4",
            printBackground: true,
            displayHeaderFooter: false
        });*/

    return html; //pdf
}

