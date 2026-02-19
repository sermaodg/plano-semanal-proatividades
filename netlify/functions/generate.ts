import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { getStore } from '@netlify/blobs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const store = getStore('usage');

const LIMIT = 5;

export const handler: Handler = async (event) => {

    try {

        const ip =
            event.headers['x-forwarded-for'] ||
            event.headers['client-ip'] ||
            'unknown';

        const today = new Date().toISOString().split('T')[0];

        const key = `${ip}_${today}`;

        const current = await store.get(key);

        const count = current ? parseInt(current) : 0;

        if (count >= LIMIT) {

            return {
                statusCode: 429,
                body: JSON.stringify({
                    error: "Você atingiu o limite diário de 5 gerações. Volte amanhã."
                })
            };

        }

        const body = JSON.parse(event.body || '{}');

        const prompt = `
Crie um plano semanal para educação infantil baseado em:

Tema: ${body.tema}
Faixa etária: ${body.faixaEtaria}
Objetivo: ${body.objetivo}
`;

        const completion = await openai.chat.completions.create({

            model: "gpt-4o-mini",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.7,

        });

        await store.set(key, (count + 1).toString());

        return {

            statusCode: 200,

            body: JSON.stringify({

                result: completion.choices[0].message.content,

                remaining: LIMIT - (count + 1)

            }),

        };

    } catch (error) {

        return {

            statusCode: 500,

            body: JSON.stringify({

                error: "Erro ao gerar plano"

            }),

        };

    }

};
