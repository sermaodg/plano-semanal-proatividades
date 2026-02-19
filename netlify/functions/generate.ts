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

        // identifica usuário
        const ip =
            event.headers['x-forwarded-for'] ||
            event.headers['client-ip'] ||
            'unknown';

        const today = new Date().toISOString().split('T')[0];

        const key = `${ip}_${today}`;

        // pega uso atual
        const current = await store.get(key);

        let count = 0;

        if (current) {
            const text = new TextDecoder().decode(current);
            count = parseInt(text || "0", 10);
        }

        // bloqueia se atingiu limite
        if (count >= LIMIT) {

            return {
                statusCode: 429,
                body: JSON.stringify({
                    error: "Você atingiu o limite diário de 5 roteiros. Volte amanhã."
                })
            };

        }


        // recebe dados do front
        const data = JSON.parse(event.body || '{}');

        const prompt = `
Crie um plano semanal BNCC completo.

Professor: ${data.professor}
Turma: ${data.turma}
Escola: ${data.escola}
Faixa etária: ${data.faixa}
Tema: ${data.tema}

Formato:

Segunda
Objetivo
Atividade
Materiais

Terça
Objetivo
Atividade
Materiais

Quarta
Objetivo
Atividade
Materiais

Quinta
Objetivo
Atividade
Materiais

Sexta
Objetivo
Atividade
Materiais
`;


        // chama IA
        const response = await openai.chat.completions.create({

            model: "gpt-4o-mini",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.7

        });


        const result = response.choices[0].message.content;


        // salva novo uso
        await store.set(key, String(count + 1));


        return {

            statusCode: 200,

            body: JSON.stringify({
                result
            })

        };


    } catch (error) {

        return {

            statusCode: 500,

            body: JSON.stringify({
                error: "Erro ao gerar roteiro"
            })

        };

    }

};

