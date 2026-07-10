{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { mailTransporter } from "../services/mail.service.js";

export async function sendContactMail(req, res) {
  const { name, email, subject, message } = req.body;

  try {
    await mailTransporter.sendMail({
      from: `"GeoInspire Hub" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      replyTo: email,
      subject: subject || "Nuevo mensaje desde GeoInspire Hub",
      html: `
        <h2>Nueva mensaje en GeoInspire Hub</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error sending email",
    });
  }
}
