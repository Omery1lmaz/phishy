/**
 * SMTP yapılandırmasının geçerli olup olmadığını test eder.
 * Nodemailer ile SMTP sunucusuna bağlanıp doğrulama yapar.
 * @param host SMTP sunucu adresi
 * @param port SMTP portu
 * @param user SMTP kullanıcı adı
 * @param pass SMTP şifresi
 * @returns Başarılıysa { success: true }, hata varsa { success: false, error }
 */
import nodemailer from 'nodemailer';

export async function verifySmtpConfig({ host, port, user, pass }: { host: string, port: number, user: string, pass: string }) {
  console.log(host, port, user, pass , "test")
  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    auth: { user, pass },
    secure: Number(port) === 465, // SSL portu ise true
    tls: { rejectUnauthorized: false }
  });

  try {
    await transporter.verify();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : err };
  }
} 