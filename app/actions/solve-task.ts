"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function solveTask(prevState: unknown, formData: FormData) {
  const file = formData.get("image") as File
  const question = formData.get("question") as string

  if (!file || file.size === 0) return { error: "Dodaj zdjęcie zadania." }
  if (file.size > 5 * 1024 * 1024) return { error: "Zdjęcie jest za duże (max 5MB)." }

  try {
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = file.type as "image/jpeg" | "image/png" | "image/webp"

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Jesteś pomocnym korepetytorem matematyki. Rozwiąż zadanie ze zdjęcia krok po kroku po polsku.

Zasady:
- Wyjaśnij każdy krok jasno i zrozumiale
- Używaj notacji LaTeX dla wzorów matematycznych (otocz wzory znakami $...$ dla inline lub $$...$$ dla display)
- Na końcu podaj odpowiedź końcową
- Pisz po polsku
- Używaj emoji na początku każdego kroku dla lepszej czytelności: 🔍 dla analizy, 📝 dla kroków, ✅ dla odpowiedzi końcowej, 💡 dla wskazówek
${question ? `\nDodatkowe pytanie ucznia: ${question}` : ""}

Rozwiąż zadanie:`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ])

    const text = result.response.text()
    return { solution: text }
  } catch (e) {
    console.error("[ai-tutor] error:", e)
    return { error: "Błąd AI. Spróbuj ponownie za chwilę." }
  }
}
