import { onRequest } from "firebase-functions/v2/https";
import OpenAI from "openai";

export const generate = onRequest(
    {
        region: "us-central1",
        secrets: ["OPENAI_API_KEY"],
        cors: true,
    },
    async (req, res) => {
        try {
            // permite apenas POST
            if (req.method !== "POST") {
                res.status(405).json({
                    ok: false,
                    error: "Use POST",
                });
                return;
            }

            // pega a chave do ambiente
            const apiKey = process.env.OPENAI_API_KEY;

            if (!apiKey) {
                res.status(500).json({
                    ok: false,
                    error: "OPENAI_API_KEY ausente no ambiente.",
                });
                return;
            }

            // garante que body seja objeto
            const body =
                typeof req.body === "string"
                    ? JSON.parse(req.body)
                    : req.body;

            const tema = (body?.tema || "").trim();

            if (!tema) {
                res.status(400).json({
                    ok: false,
                    error: "Campo obrigatório: tema (assunto da aula).",
                });
                return;
            }

            // cria cliente OpenAI
            const openai = new OpenAI({
                apiKey: apiKey,
            });

            // prompt
            const prompt = `
Crie um planejamento de aula BNCC para educação infantil.

Tema: "${tema}"

Responda APENAS em JSON puro, sem markdown, com esta estrutura:

{
  "titulo": "",
  "objetivos": [],
  "habilidadesBNCC": [],
  "materiais": [],
  "passoAPasso": [],
  "avaliacao": [],
  "adaptacoes": []
}
`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0.6,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });

            let text =
                completion.choices?.[0]?.message?.content ?? "";

            // remove ```json e ```
            text = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/```$/i, "")
                .trim();

            res.status(200).json({
                ok: true,
                result: text,
            });

        } catch (error: any) {

            console.error("ERRO:", error);

            res.status(500).json({
                ok: false,
                error: error?.message || "Erro interno",
            });

        }
    }
);
