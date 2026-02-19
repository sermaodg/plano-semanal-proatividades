import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const {
            nomeProfessor,
            escola,
            turmaSerie,
            faixaEtaria,
            turno,
            periodoSemana,
            temaSemana,
            objetivoGeral,
            tempoAtividade,
            camposExperiencia,
            codigosBNCC,
            recursosDisponiveis,
            estilo
        } = body;

        const systemPrompt = `Você é um assistente pedagógico especializado na BNCC. Gere um plano de aula semanal completo em formato JSON.
    Aja como um coordenador pedagógico experiente.
    O formato de saída DEVE ser estritamente JSON. Não inclua markdown ou texto extra.`;

        const userPrompt = `
    Crie um plano de aula semanal para Educação Infantil com os seguintes dados:
    - Professor: ${nomeProfessor}
    - Escola: ${escola}
    - Turma: ${turmaSerie} (${faixaEtaria})
    - Turno: ${turno}
    - Semana: ${periodoSemana}
    - Tema: ${temaSemana}
    - Objetivo: ${objetivoGeral}
    - Tempo por atividade: ${tempoAtividade} minutos
    - Campos de Experiência: ${camposExperiencia?.join(', ')}
    - Códigos BNCC já definidos (se houver): ${codigosBNCC}
    - Recursos disponíveis: ${recursosDisponiveis?.join(', ')}
    - Estilo da aula: ${estilo} (Ex: Lúdico, Musical, etc)

    REGRAS DE GERAÇÃO:
    1. Se 'Códigos BNCC' estiver vazio, SUGIRA 2 a 3 códigos (ex: EI02EF01) coerentes com a faixa etária e o tema.
    2. Gere 5 atividades (Segunda a Sexta).
    3. O campo 'bncc.campos' deve ser uma lista de strings.
    4. O campo 'bncc.habilidades' deve ser uma string descritiva com os códigos e seus significados.
    5. O JSON deve ter EXATAMENTE esta estrutura:
    {
      "identificacao": {
        "nomeProfessor": "...",
        "escola": "...",
        "turmaSerie": "...",
        "turno": "...",
        "periodoSemana": "...",
        "temaSemana": "..."
      },
      "bncc": {
        "campos": ["Campo 1", "Campo 2"],
        "habilidades": "Códigos e descrições..."
      },
      "dias": [
        {
          "diaSemana": "Segunda-feira",
          "titulo": "Nome criativo da atividade",
          "descricao": "Descrição detalhada do desenvolvimento da atividade...",
          "recursos": "Lista de materiais usados"
        }
        // ... até Sexta-feira
      ],
      "adaptacoes": "Sugestão de adaptação para inclusão...",
      "avaliacao": "Sugestão de como avaliar as crianças..."
    }
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error("No content from OpenAI");
        }

        // Ensure it's valid JSON
        const jsonContent = JSON.parse(content);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonContent),
        };

    } catch (error: any) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: 'Failed to generate plan', details: error.message }),
        };
    }
};
