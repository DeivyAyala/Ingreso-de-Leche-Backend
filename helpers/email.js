import nodemailer from "nodemailer";

export const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("Faltan variables SMTP en el entorno");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendVerificationEmail = async ({ email, name, token }) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyUrl = `${frontendUrl}/verify?token=${token}`;
  const from = process.env.SMTP_FROM || "no-reply@registro-leche.com";

  await transporter.sendMail({
    from,
    to: email,
    subject: "Verifica tu cuenta",
    html: `
      <div style="font-family: Arial, sans-serif; color: #2b1a00;">
        <h2>Hola ${name || ""}</h2>
        <p>Se ha creado una cuenta con este correo en Registro de Leche.</p>
        <p>Para activar tu acceso, confirma tu correo haciendo clic en el enlace:</p>
        <p><a href="${verifyUrl}">Verificar correo</a></p>
        <p>Si no fuiste tu, ignora este mensaje.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async ({ email, name, token }) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  const from = process.env.SMTP_FROM || "no-reply@registro-leche.com";

  await transporter.sendMail({
    from,
    to: email,
    subject: "Recuperación de contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; color: #2b1a00;">
        <h2>Hola ${name || ""}</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <p><a href="${resetUrl}">Restablecer contraseña</a></p>
        <p>Este enlace expira en 15 minutos.</p>
        <p>Si no fuiste tú, puedes ignorar este mensaje.</p>
      </div>
    `,
  });
};
