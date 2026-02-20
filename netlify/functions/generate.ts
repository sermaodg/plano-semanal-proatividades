// netlify/functions/generate.ts
import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

/**
 * Best-effort in-memory rate limit (per function instance).
 * If Netlify restarts the function instance, this resets.
 */
const LIMIT_PER_DAY = 5;
const usageByKey = new Map<string, { date: string; count: number }>();

function json(statusCode: number, body: unknown, extraHeaders: Record<string, string> = {}) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            ...extraHeaders,
        },
        body: JSON.stringify(body),
    };
}

function getClientIp(event: any) {
    // Netlify / proxies
    const xfwd = event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"];
    if (typeof xfwd === "string" && xfwd.length > 0) return xfwd.split(",")[0].trim();

    const clientIp = event.headers?.["client-ip"] || event.headers?.["Client-Ip"];
    if (typeof clientIp === "string" && clientIp.length > 0) return clientIp.trim();

    return "unknown";
}

function todayISO() {
    // YYYY-MM-DD
    return new Date().toISOString().slice(0, 10);
}

function safeParseJson(text: string | null) {
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function extractTextFromResponse(resp: any): string {
    // OpenAI Responses API: resp.output_text is common in the SDK.
    if (typeof resp?.output_text === "string" && resp.output_text.trim()) return resp.output_text.trim();

    // Fallback (older/edge shapes)
    const maybe = resp?.output?.[0]?.content?.[0]?.text;
    if (typeof maybe === "string" && maybe.trim()) return maybe.trim();

    return "";
}

export const handler: Handler = async (event) => {
    // Preflight
    if (event.httpMethod === "OPTIONS") {
        return json(200, { ok: true });
    }

    if (event.httpMethod !== "POST") {
        return json(405, { ok: false, error: "Method not allowed. Use POST." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !apiKey.trim()) {
        return json(500, {
            ok: false,
            error: "OPENAI_API_KEY ausente no ambiente do Netlify. Configure a variável e faça novo deploy.",
        });
    }

    // Rate limit (best-effort)
    const ip = getClientIp(event);
    const day = todayISO();
    const key = `${ip}:${day}`;
    const current = usageByKey.get(key);

    const count = current?.date === day ? current.count : 0;
    if (count >= LIMIT_PER_DAY) {
        return json(429, {
            ok: false,
            error: `Você atingiu o limite diário de ${LIMIT_PER_DAY} gerações. Volte amanhã.`,
        });
    }

    const payload = safeParseJson(event.body) ?? {};

    // Parse fields
    const escola = String(payload.escola ?? payload.schoolName ?? "").trim();
    const serie = String(payload.serie ?? payload.ano ?? "").trim();
    const turma = String(payload.turma ?? "").trim();
    const duracao = String(payload.duracao ?? "").trim();

    const tema = String(payload.tema ?? payload.temaAula ?? "").trim();
    const objetivoGeral = String(payload.objetivoGeral ?? "").trim();
    const objetivosEspecificos = String(payload.objetivosEspecificos ?? "").trim();
    const habilidadesBncc = String(payload.habilidadesBncc ?? "").trim();
    const recursos = String(payload.recursos ?? "").trim();
    const metodologia = String(payload.metodologia ?? "").trim();
    const avaliacao = String(payload.avaliacao ?? "").trim();

    // Check mandatory fields (basic check for backend, frontend will handle UI)
    if (!tema) {
        return json(400, { ok: false, error: "Campo obrigatório: tema (assunto da aula)." });
    }

    const openai = new OpenAI({ apiKey });

    const system = `
Você é um especialista em pedagogia e BNCC.
Crie um plano de aula completo, claro, prático e aplicável.
Escreva em português do Brasil, com linguagem objetiva para professoras.
O formato deve ser profissional.
Nome da Escola: ${escola || "Nome da Escola"}
`.trim();

    const user = `
Gere um plano de aula com estes dados:

- Escola: ${escola || "(não informado)"}
- Ano/Série: ${serie || "(não informado)"}
- Turma: ${turma || "(não informado)"}
- Duração: ${duracao || "(não informado)"}
- Tema da Aula: ${tema}

- Objetivo Geral: ${objetivoGeral || "(crie um adequado)"}
- Objetivos Específicos: ${objetivosEspecificos || "(crie 3 a 5 objetivos)"}
- Habilidades BNCC: ${habilidadesBncc || "(selecione as códigos mais adequados à série e tema)"}
- Recursos Didáticos: ${recursos || "(sugira materiais)"}
- Metodologia / Estratégias: ${metodologia || "(descreva o passo a passo)"}
- Avaliação: ${avaliacao || "(sugira como avaliar)"}

Estruture a resposta com Markdown, usando títulos (##), listas e negrito.
Se algum campo acima estiver como "(não informado)", use sua expertise para preencher com o que faz mais sentido para o Tema e Ano.
`.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Correct model name
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
            temperature: 0.7,
        });

        const text = completion.choices[0]?.message?.content?.trim();

        if (!text) {
            return json(500, {
                ok: false,
                error: "A API respondeu, mas não retornou texto. Tente novamente.",
            });
        }

        // increment usage
        usageByKey.set(key, { date: day, count: count + 1 });

        return json(200, { ok: true, text, remainingToday: Math.max(0, LIMIT_PER_DAY - (count + 1)) });
    } catch (err: any) {
        // Log para o Netlify Functions log
        console.error("Generate error:", err?.message || err, err?.stack);

        // Tenta retornar algo amigável
        return json(500, {
            ok: false,
            error: "Falha na geração (erro interno da função). Verifique logs do Netlify.",
            details: err?.message ? String(err.message) : undefined,
        });
    }
};

