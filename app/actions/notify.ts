"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function notifyTutorNewLesson({
  studentName,
  date,
  dlugosc_min,
  temat,
}: {
  studentName: string
  date: string
  dlugosc_min: number
  temat?: string | null
}) {
  try {
    await Promise.all([
      resend.emails.send({
        from: "onboarding@resend.dev",
        to: "piotrbielicki@op.pl",
        subject: `Nowa lekcja — ${studentName}`,
        html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 12px;">
          <h1 style="font-size: 24px; font-weight: 300; margin-bottom: 8px;">Nowa rezerwacja</h1>
          <p style="color: #999; font-size: 14px; margin-bottom: 32px;">Uczeń umówił lekcję przez Binarę</p>

          <div style="background: #111; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #999;">UCZEŃ</p>
            <p style="margin: 0; font-size: 18px;">${studentName}</p>
          </div>

          <div style="background: #111; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #999;">TERMIN</p>
            <p style="margin: 0; font-size: 18px;">${date}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #999;">${dlugosc_min} minut</p>
          </div>

          ${temat ? `
          <div style="background: #111; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #999;">TEMAT</p>
            <p style="margin: 0; font-size: 18px;">${temat}</p>
          </div>
          ` : ""}

          <p style="color: #555; font-size: 12px; margin-top: 32px;">binara · system dla korepetytorów</p>
        </div>
      `,
      }),
      resend.emails.send({
        from: "onboarding@resend.dev",
        to: "48571919888@sms.orange.pl",
        subject: `Binara: ${studentName} umówił lekcję ${date}`,
        text: `Binara: ${studentName} umówił lekcję ${date}, ${dlugosc_min} min${temat ? `, ${temat}` : ""}`,
      }),
    ])
  } catch (e) {
    console.error("[notify] email failed:", e)
  }
}
