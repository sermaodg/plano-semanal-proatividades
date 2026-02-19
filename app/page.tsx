"use client";

import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type GeneratePayload = {
    tema: string;
    ano?: string;
    turma?: string;
    duracao?: string;
    objetivoGeral?: string;
    objetivosEspecificos?: string;
    habilidadesBncc?: string;
    recursos?: string;
    metodologia?: string;
    avaliacao?: string;
};

type GenerateResponse =
    | { ok: true; data: any }
    | { ok: false; error: string; details?: any };

export default function Page() {
    const [tema, setTema] = useState("");
    const [ano, setAno] = useState("");
    const [turma, setTurma] = useState("");
    const [duracao, setDuracao] = useState("50 min");

    const [objetivoGeral, setObjetivoGeral] = useState("");
    const [objetivosEspecificos, setObjetivosEspecificos] = useState("");
    const [habilidadesBncc, setHabilidadesBncc] = useState("");
    const [recursos, setRecursos] = useState("");
    const [metodologia, setMetodologia] = useState("");
    const [avaliacao, setAvaliacao] = useState("");

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [resultado, setResultado] = useState<any>(null);

    const resultRef = useRef<HTMLDivElement | null>(null);

    const canGenerate = useMemo(() => tema.trim().length > 0 && !loading, [tema, loading]);

    async function onGenerate() {
        setErro(null);
        setResultado(null);

        if (!tema || !tema.trim()) {
            setErro("Preencha o tema (assunto da aula).");
            return;
        }

        const payload: GeneratePayload = {
            tema: tema.trim(),
            ano: ano.trim() || undefined,
            turma: turma.trim() || undefined,
            duracao: duracao.trim() || undefined,
            objetivoGeral: objetivoGeral.trim() || undefined,
            objetivosEspecificos: objetivosEspecificos.trim() || undefined,
            habilidadesBncc: habilidadesBncc.trim() || undefined,
            recursos: recursos.trim() || undefined,
            metodologia: metodologia.trim() || undefined,
            avaliacao: avaliacao.trim() || undefined,
        };

        try {
            setLoading(true);

            const res = await fetch("/.netlify/functions/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            let json: GenerateResponse | null = null;

            try {
                json = JSON.parse(text);
            } catch {
                // se não for JSON, mostra o texto bruto
            }

            if (!res.ok) {
                const msg =
                    (json && "error" in json && json.error) ||
                    `Erro ${res.status}: ${text || "Falha na geração"}`;
                setErro(msg);
                return;
            }

            if (json && json.ok === false) {
                setErro(json.error || "Falha na geração.");
                return;
            }

            // Se a function retornar { ok:true, data:{...} }
            // ou até retornar direto um objeto, a gente lida com os dois.
            const data = (json && json.ok === true ? json.data : json) ?? text;
            setResultado(data);
        } catch (e: any) {
            setErro(e?.message || "Erro inesperado ao gerar.");
        } finally {
            setLoading(false);
        }
    }

    async function onDownloadPdf() {
        if (!resultRef.current) return;

        setErro(null);

        try {
            const canvas = await html2canvas(resultRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // calcula proporção da imagem para caber na página
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let y = 0;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                pdf.addPage();
                y = heightLeft - imgHeight;
                pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`plano-aula-${tema.trim().slice(0, 30).replace(/\s+/g, "-")}.pdf`);
        } catch (e: any) {
            setErro(e?.message || "Não consegui gerar o PDF.");
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Criador de Roteiro BNCC</h1>
                    <p className="text-slate-600">
                        Preencha o tema e, se quiser, complete os detalhes. Depois clique em “Gerar”.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* FORM */}
                    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Tema (obrigatório)
                                </label>
                                <input
                                    value={tema}
                                    onChange={(e) => setTema(e.target.value)}
                                    placeholder="Ex: Vogais e consciência fonológica"
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Ano / Etapa</label>
                                    <input
                                        value={ano}
                                        onChange={(e) => setAno(e.target.value)}
                                        placeholder="Ex: 1º ano"
                                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Turma</label>
                                    <input
                                        value={turma}
                                        onChange={(e) => setTurma(e.target.value)}
                                        placeholder="Ex: A"
                                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Duração</label>
                                <input
                                    value={duracao}
                                    onChange={(e) => setDuracao(e.target.value)}
                                    placeholder="Ex: 50 min"
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Objetivo geral</label>
                                <textarea
                                    value={objetivoGeral}
                                    onChange={(e) => setObjetivoGeral(e.target.value)}
                                    placeholder="(opcional)"
                                    className="mt-1 min-h-[80px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Objetivos específicos
                                </label>
                                <textarea
                                    value={objetivosEspecificos}
                                    onChange={(e) => setObjetivosEspecificos(e.target.value)}
                                    placeholder="(opcional)"
                                    className="mt-1 min-h-[80px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Habilidades BNCC</label>
                                <textarea
                                    value={habilidadesBncc}
                                    onChange={(e) => setHabilidadesBncc(e.target.value)}
                                    placeholder="Ex: (EF01LP...) (opcional)"
                                    className="mt-1 min-h-[80px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Recursos</label>
                                <textarea
                                    value={recursos}
                                    onChange={(e) => setRecursos(e.target.value)}
                                    placeholder="(opcional)"
                                    className="mt-1 min-h-[70px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Metodologia</label>
                                <textarea
                                    value={metodologia}
                                    onChange={(e) => setMetodologia(e.target.value)}
                                    placeholder="(opcional)"
                                    className="mt-1 min-h-[70px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Avaliação</label>
                                <textarea
                                    value={avaliacao}
                                    onChange={(e) => setAvaliacao(e.target.value)}
                                    placeholder="(opcional)"
                                    className="mt-1 min-h-[70px] w-full rounded-xl border border-slate-300 px-3 py-2"
                                />
                            </div>

                            {erro && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {erro}
                                </div>
                            )}

                            <button
                                onClick={onGenerate}
                                disabled={!canGenerate}
                                className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
                            >
                                {loading ? "Gerando..." : "Gerar planejamento"}
                            </button>

                            <p className="text-xs text-slate-500">
                                Dica: se der erro, abre o DevTools &gt; Network &gt; “generate” e vê o Response.
                            </p>
                        </div>
                    </section>

                    {/* RESULTADO */}
                    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-slate-900">Resultado</h2>

                            <button
                                onClick={onDownloadPdf}
                                disabled={!resultado}
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 disabled:opacity-50"
                            >
                                Baixar PDF
                            </button>
                        </div>

                        {!resultado ? (
                            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                                Gere um planejamento para aparecer aqui.
                            </div>
                        ) : (
                            <div
                                ref={resultRef}
                                className="rounded-xl border border-slate-200 bg-white p-4"
                            >
                                {/* Se vier texto */}
                                {typeof resultado === "string" ? (
                                    <pre className="whitespace-pre-wrap text-sm text-slate-800">
                                        {resultado}
                                    </pre>
                                ) : (
                                    <pre className="whitespace-pre-wrap text-sm text-slate-800">
                                        {JSON.stringify(resultado, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
