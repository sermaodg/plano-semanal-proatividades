"use client";

import React, { useState, useEffect, FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Ícones SVG Limpos (Sem Libs)
const EngineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
    </svg>
);

const ChipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
);

const WrenchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default function DieselProScanner() {
    const [isOnline] = useState(true);
    const [diagnosticCount, setDiagnosticCount] = useState(0);

    // Campos principais
    const [oficina, setOficina] = useState("");
    const [codigoFalha, setCodigoFalha] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [descricao, setDescricao] = useState("");

    // Avançado
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [ano, setAno] = useState("");
    const [sintomas, setSintomas] = useState<string[]>([]);
    const [ambiente, setAmbiente] = useState("");
    const [jaFeito, setJaFeito] = useState("");

    // UI State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [submitError, setSubmitError] = useState("");

    const marcas = ["Volvo", "Scania", "Mercedes", "VW", "Ford", "Iveco", "DAF", "MAN", "Outras"];
    const sintomasOptions = ["Sem força", "Fumaça", "Consumo alto", "Falha na lenta", "Luz de painel acesa", "Partida difícil"];
    const loadingMessages = [
        "Lendo ECU...",
        "Verificando sensores...",
        "Consultando base de dados...",
        "Analisando parâmetros...",
        "Formatando relatório final..."
    ];

    useEffect(() => {
        // Carregar dados salvos
        const savedOficina = localStorage.getItem("dp_oficina") || "";
        const savedMarca = localStorage.getItem("dp_marca") || "";
        const savedModelo = localStorage.getItem("dp_modelo") || "";
        const savedCount = localStorage.getItem("dp_count") || "0";

        setOficina(savedOficina);
        setMarca(savedMarca);
        setModelo(savedModelo);
        setDiagnosticCount(parseInt(savedCount, 10));
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isLoading, loadingMessages.length]);

    const toggleSintoma = (s: string) => {
        setSintomas((prev) =>
            prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
        );
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!codigoFalha.trim()) newErrors.codigoFalha = "Obrigatório (Ex: P0420)";
        if (!marca) newErrors.marca = "Selecione uma marca";
        if (!modelo.trim()) newErrors.modelo = "Obrigatório";
        if (!descricao.trim()) newErrors.descricao = "Descreva o defeito brevemente";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!API_URL) {
            setSubmitError("Configure NEXT_PUBLIC_API_URL (.env)");
            return;
        }
        setSubmitError("");
        setResult(null);

        if (!validate()) return;

        // Persistir os dados parciais
        localStorage.setItem("dp_oficina", oficina);
        localStorage.setItem("dp_marca", marca);
        localStorage.setItem("dp_modelo", modelo);

        setIsLoading(true);
        setLoadingMsgIdx(0);

        const payload = {
            falha: codigoFalha,
            marca,
            modelo,
            descricao,
            avancado: { oficina, ano, sintomas, ambiente, jaFeito }
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
                const newCount = diagnosticCount + 1;
                setDiagnosticCount(newCount);
                localStorage.setItem("dp_count", newCount.toString());
            } else {
                setSubmitError(data?.error || "Falha na comunicação com o scanner. Tente novamente.");
            }
        } catch (err) {
            console.error(err);
            setSubmitError("Erro de conexão. Verifique rede/servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const copyToClipboard = () => {
        if (!result) return;
        const textToCopy = `DIAGNÓSTICO DIESEL PRO\nMarca: ${marca} | Modelo: ${modelo} | Falha: ${codigoFalha}\n\nRESULTADO:\n${JSON.stringify(result, null, 2)}`;
        navigator.clipboard.writeText(textToCopy);
        alert("Resultado copiado para a área de transferência!");
    };

    const inputClasses = (err?: string) => `
    w-full bg-[#161a20] border-2 rounded-md p-3 text-gray-200 outline-none transition-colors 
    ${err ? 'border-red-500 focus:border-red-400' : 'border-[#2d3340] focus:border-cyan-500'}
  `;

    // Função auxiliar para renderizar o resultado formatado, permitindo strings soltas e objetos estruturados.
    const renderResultContent = () => {
        if (!result) return null;

        if (typeof result === "string") {
            return <div className="whitespace-pre-wrap text-gray-300 print:text-black">{result}</div>;
        }

        // Se a api retorna o JSON nas chaves formatadas (ou aproximadas)
        const causasList = result.causas || result.possiveisCausas || [];
        const testesList = result.testes || result.testesRecomendados || [];
        const passosList = result.passos || result.comoResolver || result.passoApasso || [];
        const pecasList = result.pecas || result.pecasChecar || result.itens || [];
        const risco = result.risco || result.riscoRodar;

        return (
            <div className="space-y-6 text-sm md:text-base">
                {causasList.length > 0 && (
                    <section>
                        <h3 className="text-cyan-400 font-bold mb-2 flex items-center print:text-black">
                            <span className="bg-cyan-900 text-cyan-200 uppercase text-xs px-2 py-1 rounded mr-2 no-print">PRIORIDADE</span>
                            Possíveis Causas
                        </h3>
                        <ol className="list-decimal list-inside space-y-1 text-gray-300 print:text-black">
                            {causasList.map((c: string, i: number) => <li key={i}>{c}</li>)}
                        </ol>
                    </section>
                )}

                {testesList.length > 0 && (
                    <section>
                        <h3 className="text-yellow-400 font-bold mb-2 print:text-black">Testes Recomendados</h3>
                        <ul className="space-y-2 text-gray-300 print:text-black">
                            {testesList.map((t: string, i: number) => (
                                <li key={i} className="flex items-start">
                                    <div className="mt-0.5 mr-2 text-yellow-500 no-print"><CheckCircleIcon /></div>
                                    <span className="print:list-item print:ml-4">{t}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {passosList.length > 0 && (
                    <section>
                        <h3 className="text-emerald-400 font-bold mb-2 print:text-black">Como Resolver (Passo a Passo)</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-300 print:text-black">
                            {passosList.map((p: string, i: number) => <li key={i}>{p}</li>)}
                        </ul>
                    </section>
                )}

                {pecasList.length > 0 && (
                    <section>
                        <h3 className="text-gray-100 font-bold mb-2 print:text-black">Peças / Itens para Checar</h3>
                        <div className="flex flex-wrap gap-2">
                            {pecasList.map((p: string, i: number) => (
                                <span key={i} className="bg-[#2d3340] px-3 py-1 rounded text-cyan-300 text-xs font-mono print:bg-gray-200 print:text-black print:border">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {risco && (
                    <section className="mt-4 p-4 rounded-md bg-red-900/20 border border-red-500/50 print:bg-white print:border-red-800 print:text-black">
                        <h3 className="text-red-400 font-bold mb-1 flex items-center print:text-red-700">
                            <span className="mr-2 no-print"><AlertTriangleIcon /></span>
                            Risco ao rodar assim
                        </h3>
                        <p className="text-red-200 print:text-black text-sm">{risco}</p>
                    </section>
                )}

                {/* Caso a resposta não tenha os formatos esperados acima, renderizar um dump */}
                {(!causasList.length && !testesList.length && !passosList.length && !pecasList.length && !risco && result.texto) && (
                    <div className="whitespace-pre-wrap text-gray-300 print:text-black">{result.texto}</div>
                )}
                {Object.keys(result).length > 0 && !causasList.length && !result.texto && (
                    <pre className="text-gray-400 text-xs overflow-x-auto print:text-black">{JSON.stringify(result, null, 2)}</pre>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#07090b] text-gray-300 font-sans selection:bg-cyan-900 selection:text-cyan-100 flex flex-col items-center py-6 px-4 tech-bg print:bg-white print:text-black print:p-0 print:min-h-0 relative z-0">

            {/* GLOBAL STYLES PARA IMPRESSÃO E ANIMAÇÕES VISUAIS */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-card { 
            box-shadow: none !important; 
            border: 1px solid #ccc !important; 
            background: white !important; 
            color: black !important;
            margin: 0 !important;
            padding: 1rem !important;
          }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .scanline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 10%;
          background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.25), transparent);
          opacity: 0.8;
          animation: scan 2.5s linear infinite;
          pointer-events: none;
          z-index: 50;
        }
        
        .tech-bg {
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(34, 211, 238, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 40%);
        }

        .scanner-card {
          background: #0f1217;
          border: 1px solid #1f252f;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05);
        }
        .scanner-header {
          background: #151920;
          border-bottom: 1px solid #1f252f;
        }
        
        /* Custom Scrollbar for textareas/panels */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #07090b; }
        ::-webkit-scrollbar-thumb { background: #2d3340; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3c4556; }
      `}} />

            {/* HEADER / TOPBAR (NO-PRINT) */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-6 no-print">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-900 flex items-center justify-center shadow-[0_0_15px_rgba(8,145,178,0.5)]">
                        <ChipIcon />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-wider flex items-center">
                            DIESEL PRO <span className="ml-2 text-[10px] uppercase font-bold bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700">Beta</span>
                        </h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">Scanner de Diagnóstico</p>
                    </div>
                </div>

                <div className="flex flex-col items-end text-right font-mono text-xs">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Status:</span>
                        <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span>ONLINE</span>
                        </span>
                    </div>
                    <div className="mt-1 text-gray-500">
                        Diagnósticos realizados: <span className="text-cyan-400 font-bold">{diagnosticCount}</span>
                    </div>
                </div>
            </div>

            {submitError && (
                <div className="w-full max-w-6xl mb-4 bg-red-900/40 border border-red-500 text-red-200 px-4 py-3 rounded flex items-center space-x-3 no-print">
                    <AlertTriangleIcon />
                    <span>{submitError}</span>
                </div>
            )}

            {/* MAIN CONTAINER: 2 COLUMNS */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* COLUNA ESQUERDA: FORMULÁRIO */}
                <div className="scanner-card rounded-xl overflow-hidden relative no-print">
                    {isLoading && <div className="scanline"></div>}

                    <div className="scanner-header px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-sm tracking-wider">
                            <EngineIcon />
                            <span>ENTRADA DE FALHA</span>
                        </div>
                        {/* LEDs */}
                        <div className="flex space-x-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_red]"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_5px_yellow]"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_#10b981]"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-5">
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Oficina / Mecânico (Opcional)</label>
                            <input type="text" value={oficina} onChange={e => setOficina(e.target.value)} placeholder="Nome ou oficina" className={inputClasses()} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Código da Falha *</label>
                                <input type="text" value={codigoFalha} onChange={e => setCodigoFalha(e.target.value)} placeholder="P0420 / SPN 1234..." className={inputClasses(errors.codigoFalha)} />
                                {errors.codigoFalha && <p className="text-red-400 text-xs mt-1">{errors.codigoFalha}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Marca *</label>
                                <select value={marca} onChange={e => setMarca(e.target.value)} className={inputClasses(errors.marca) + ' appearance-none'}>
                                    <option value="">-- Selecione --</option>
                                    {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                {errors.marca && <p className="text-red-400 text-xs mt-1">{errors.marca}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Modelo do Veículo *</label>
                            <input type="text" value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: FH 460, Actros 2651..." className={inputClasses(errors.modelo)} />
                            {errors.modelo && <p className="text-red-400 text-xs mt-1">{errors.modelo}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Descrição do Defeito *</label>
                            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Não passa de 1500 rpm, perde força..." rows={3} className={inputClasses(errors.descricao)}></textarea>
                            {errors.descricao && <p className="text-red-400 text-xs mt-1">{errors.descricao}</p>}
                        </div>

                        {/* AVANÇADO */}
                        <div className="border border-[#1f252f] rounded-md p-4 bg-[#11141a]">
                            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex items-center justify-between text-sm text-gray-300 font-mono focus:outline-none">
                                <span className="flex items-center"><WrenchIcon /><span className="ml-2 uppercase">Dados Avançados (Opcional)</span></span>
                                <span>{showAdvanced ? "▲" : "▼"}</span>
                            </button>

                            {showAdvanced && (
                                <div className="mt-4 pt-4 border-t border-[#1f252f] space-y-4 animate-in fade-in zoom-in duration-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 mb-1">Ano</label>
                                            <input type="text" value={ano} onChange={e => setAno(e.target.value)} placeholder="2021" className={inputClasses()} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-gray-500 mb-1">Ambiente</label>
                                            <select value={ambiente} onChange={e => setAmbiente(e.target.value)} className={inputClasses() + ' appearance-none'}>
                                                <option value="">Não informado</option>
                                                <option value="Frio">Frio</option>
                                                <option value="Quente">Quente</option>
                                                <option value="Com carga">Com carga</option>
                                                <option value="Sem carga">Sem carga</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-2">Sintomas (Selecione)</label>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {sintomasOptions.map(s => (
                                                <label key={s} className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" checked={sintomas.includes(s)} onChange={() => toggleSintoma(s)} className="form-checkbox text-cyan-600 bg-[#161a20] border-[#2d3340] rounded focus:ring-cyan-500 focus:ring-opacity-25" />
                                                    <span className={sintomas.includes(s) ? 'text-cyan-300' : 'text-gray-400'}>{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-gray-500 mb-1">O que já foi feito na oficina?</label>
                                        <textarea value={jaFeito} onChange={e => setJaFeito(e.target.value)} placeholder="Trocado filtro, conferido chicote..." rows={2} className={inputClasses()}></textarea>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full mt-2 py-4 rounded-md font-black uppercase tracking-widest text-lg transition-all
                ${isLoading
                                    ? 'bg-cyan-900/50 text-cyan-500 cursor-not-allowed border border-cyan-800'
                                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(8,145,178,0.7)]'}`}
                        >
                            {isLoading ? 'Escaneando...' : 'ESCANEAR'}
                        </button>
                    </form>
                </div>

                {/* COLUNA DIREITA: RESULTADO */}
                <div className="scanner-card rounded-xl flex flex-col print-card">
                    <div className="scanner-header px-4 py-3 flex items-center justify-between no-print">
                        <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-sm tracking-wider">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                            <span>DIAGNÓSTICO</span>
                        </div>

                        {result && (
                            <div className="flex space-x-2">
                                <button onClick={copyToClipboard} className="text-gray-400 hover:text-white px-2 py-1 bg-[#1f252f] hover:bg-[#2d3340] rounded text-xs transition-colors">Copiar</button>
                                <button onClick={handlePrint} className="text-cyan-400 hover:text-cyan-200 px-2 py-1 bg-cyan-900/30 hover:bg-cyan-900/60 rounded text-xs transition-colors border border-cyan-800">Imprimir / PDF</button>
                            </div>
                        )}
                    </div>

                    <div className="p-5 flex-1 relative overflow-y-auto min-h-[400px]">

                        {!isLoading && !result && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 font-mono no-print">
                                <svg className="w-16 h-16 mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                                <p>Aguardando leitura de falha...</p>
                                <p className="text-xs opacity-50 mt-2">Insira os dados e clique em Escanear</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f1217] z-10 font-mono no-print">
                                <div className="w-32 h-32 relative flex items-center justify-center mb-6">
                                    {/* Círculo Giratório */}
                                    <svg className="animate-spin absolute w-full h-full text-cyan-600/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /></svg>
                                    <svg className="animate-spin absolute w-full h-full text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="15 85"><circle cx="12" cy="12" r="10" /></svg>
                                    <EngineIcon />
                                </div>

                                <p className="text-cyan-400 text-sm mb-4 animate-pulse uppercase tracking-widest text-center min-h-[1.5rem]">
                                    {loadingMessages[loadingMsgIdx]}
                                </p>

                                {/* Barra de Progresso Fake */}
                                <div className="w-64 h-1.5 bg-[#1f252f] rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400 transition-all duration-[1500ms] ease-out"
                                        style={{ width: `${((loadingMsgIdx + 1) / loadingMessages.length) * 100}%` }}></div>
                                </div>
                            </div>
                        )}

                        {result && !isLoading && (
                            <div className="animate-in fade-in duration-500 text-gray-200">
                                {/* Cabeçalho de Impressão (Visível apenas em Print ou topo do card) */}
                                <div className="print-only hidden mb-6 pb-4 border-b border-gray-300">
                                    <h2 className="text-2xl font-black text-black">DIESEL PRO - RELATÓRIO DE DIAGNÓSTICO</h2>
                                    <div className="mt-2 text-sm space-y-1 text-gray-700">
                                        <p><b>Oficina/Mecânico:</b> {oficina || "Não informado"}</p>
                                        <p><b>Veículo:</b> {marca} {modelo} {ano && `(${ano})`}</p>
                                        <p><b>Código de Falha:</b> {codigoFalha}</p>
                                    </div>
                                </div>

                                {/* Renderização do Resultado */}
                                {renderResultContent()}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div >
    );
}
