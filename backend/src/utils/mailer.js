import nodemailer from "nodemailer";

// =====================================
// TRANSPORTER
// =====================================

export const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

// =====================================
// VERIFICAR
// =====================================

transporter.verify(
  (error) => {

    if (error) {

      console.error(
        "Error verificando mailer:",
        error
      );

    } else {

      console.log(
        "Mailer listo"
      );
    }
  }
);
