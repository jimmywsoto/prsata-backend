import { generateReport } from "../services/report.service.js";
import { generatePdfFromHtml } from "../services/pdf.service.js";

// POST /api/resources
export const createReport = async (req, res) => {
  try {

    const { reportData } = req.body;

    if (!reportData) {

      return res.status(400).json({
        success: false,
        message: 'reportData es requerido'
      });
    }

    const html = await generateReport( reportData );

    const pdf = await generatePdfFromHtml(html);

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=ReporteSATA.pdf'
    );
    
    return res.send(Buffer.from(pdf)); // Making sure that pdf was a instance of buffer.

    //res.status(201).json(html);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};