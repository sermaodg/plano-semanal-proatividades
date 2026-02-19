'use client';
import { useState, useRef } from 'react';
import Head from 'next/head';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
    const [formData, setFormData] = useState({
        nomeProfessor: '',
        escola: '',
        turmaSerie: '',
        faixaEtaria: '3-4',
        turno: 'tarde',
        periodoSemana: '',
        temaSemana: '',
        objetivoGeral: '',
        tempoAtividade: '20',
        camposExperiencia: [] as string[],
        codigosBNCC: '',
        recursosDisponiveis: [] as string[],
        estilo: 'ludico',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const camposBNCC = [
        "O eu, o outro e o nós",
        "Corpo, gestos e movimentos",
        "Traços, sons, cores e formas",
        "Escuta, fala, pensamento e imaginação",
        "Espaços, tempos, quantidades, relações e transformações"
    ];

    const recursosOptions = [
        "Papelaria (papel, cola, tesoura)",
        "Materiais de Arte (tintas, pincéis)",
        "Materiais Naturais (folhas, pedras)",
        "Brinquedos Estruturados",
        "Multimídia",
        "Espaço Externo",
        "Instrumentos Musicais"
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, group: 'camposExperiencia' | 'recursosDisponiveis') => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const current = prev[group];
            if (checked) return { ...prev, [group]: [...current, value] };
            return { ...prev, [group]: current.filter(item => item !== value) };
        });
    };

    const generatePlan = async () => {
        setIsLoading(true);
        try {
            // Usar endpoint Netlify Function (para deploy)
            // Nota: Em desenvolvimento local, se não usar 'netlify dev', isso pode dar 404.
            const endpoint = '/.netlify/functions/generate';

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Falha na geração');
            const data = await res.json();
            setPlan(data);
            // Wait for render then scroll
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            alert('Ocorreu um erro ao gerar o plano. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!resultRef.current) return;

        // Show loading state for PDF
        const btn = document.getElementById('btn-download');
        if (btn) btn.innerText = 'Gerando PDF...';

        try {
            const canvas = await html2canvas(resultRef.current, {
                scale: 2, // Higher resolution
                useCORS: true,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Plano_Semanal_${formData.temaSemana || 'ProAtividades'}.pdf`);
        } catch (err) {
            console.error(err);
            alert('Erro ao gerar PDF');
        } finally {
            if (btn) btn.innerText = 'Baixar PDF';
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-10 print:bg-white print:text-black print:pb-0">
            <header className="p-6 text-center bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg print:hidden">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-pink-200">
                    Plano Semanal — ProAtividades
                </h1>
                <p className="text-indigo-200 mt-2">Crie planejamentos incríveis em segundos</p>
            </header>

            <main className="max-w-4xl mx-auto p-6">

                {/* Form Section */}
                <section className={`transition-all duration-500 ${plan ? 'hidden print:hidden' : 'block'}`}>
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
                        <h2 className="text-2xl font-semibold mb-6 text-indigo-300 border-b border-slate-700 pb-2">Preencha os dados do planejamento</h2>

                        <div className="grid gap-6">

                            {/* Identificação */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-pink-400">Identificação</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Nome do Professor(a)</label>
                                        <input type="text" name="nomeProfessor" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Ana Silva" onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Escola</label>
                                        <input type="text" name="escola" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nome da instituição" onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Turma/Série</label>
                                        <input type="text" name="turmaSerie" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Maternal II" onChange={handleInputChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Faixa Etária</label>
                                            <select name="faixaEtaria" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" onChange={handleInputChange} value={formData.faixaEtaria}>
                                                <option value="1-2">1 a 2 anos</option>
                                                <option value="2-3">2 a 3 anos</option>
                                                <option value="3-4">3 a 4 anos</option>
                                                <option value="4-5">4 a 5 anos</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Turno</label>
                                            <select name="turno" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" onChange={handleInputChange} value={formData.turno}>
                                                <option value="manha">Manhã</option>
                                                <option value="tarde">Tarde</option>
                                                <option value="noite">Noite</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Planejamento */}
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-lg font-medium text-pink-400">Planejamento</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Período (Data)</label>
                                        <input type="text" name="periodoSemana" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" placeholder="Ex: 10/05 a 14/05" onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Tempo Estimado</label>
                                        <select name="tempoAtividade" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" onChange={handleInputChange} value={formData.tempoAtividade}>
                                            <option value="10">10 minutos</option>
                                            <option value="20">20 minutos</option>
                                            <option value="30">30 minutos</option>
                                            <option value="60">1 hora</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-slate-400 mb-1">Tema da Semana</label>
                                        <input type="text" name="temaSemana" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" placeholder="Ex: O Mundo dos Dinossauros" onChange={handleInputChange} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-slate-400 mb-1">Objetivo Geral</label>
                                        <textarea name="objetivoGeral" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none h-24" placeholder="Descreva o objetivo principal..." onChange={handleInputChange}></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* BNCC */}
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-lg font-medium text-pink-400">BNCC - Campos de Experiência</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {camposBNCC.map((campo, idx) => (
                                        <label key={idx} className="flex items-center space-x-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700 hover:bg-slate-800 cursor-pointer transition">
                                            <input type="checkbox" value={campo} className="w-5 h-5 accent-indigo-500" onChange={(e) => handleCheckboxChange(e, 'camposExperiencia')} />
                                            <span className="text-sm text-slate-300">{campo}</span>
                                        </label>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1 mt-3">Códigos BNCC (Opcional)</label>
                                    <input type="text" name="codigosBNCC" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" placeholder="Ex: EI02EF01, EI02CG03 (separados por vírgula)" onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* Recursos e Estilo */}
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-lg font-medium text-pink-400">Recursos e Estilo</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Recursos Disponíveis</label>
                                        <div className="space-y-2">
                                            {recursosOptions.map((rec, idx) => (
                                                <label key={idx} className="flex items-center space-x-2">
                                                    <input type="checkbox" value={rec} className="accent-indigo-500" onChange={(e) => handleCheckboxChange(e, 'recursosDisponiveis')} />
                                                    <span className="text-sm text-slate-300">{rec}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Estilo da Aula</label>
                                        <select name="estilo" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none" onChange={handleInputChange} value={formData.estilo}>
                                            <option value="ludico">Lúdico (Brincadeiras)</option>
                                            <option value="musical">Musical</option>
                                            <option value="psicomotor">Psicomotor (Movimento)</option>
                                            <option value="contacao">Contação de Histórias</option>
                                            <option value="artes">Artes Visuais</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={generatePlan}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Gerando Planejamento...
                                        </>
                                    ) : (
                                        'Gerar Plano Semanal'
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Result Section */}
                {bindingResult()}
            </main>
        </div>
    );

    function bindingResult() {
        if (!plan) return null;

        return (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <button
                        onClick={() => setPlan(null)}
                        className="text-slate-400 hover:text-white flex items-center gap-2"
                    >
                        ← Voltar e Editar
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                            Print / Salvar PDF
                        </button>
                        <button
                            id="btn-download"
                            onClick={downloadPDF}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition"
                        >
                            Baixar Imagem/PDF
                        </button>
                    </div>
                </div>

                {/* The Printable Area */}
                <div ref={resultRef} className="bg-white text-slate-800 p-8 rounded-xl shadow-2xl print:shadow-none print:w-full print:border-none max-w-[210mm] mx-auto min-h-[297mm]">
                    {/* Header */}
                    <div className="border-b-4 border-indigo-600 pb-4 mb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-900">Planejamento Semanal</h1>
                            <p className="text-slate-500 text-sm mt-1">Gerado por ProAtividades</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-700">{plan.identificacao.escola}</p>
                            <p className="text-sm text-slate-500">Prof. {plan.identificacao.nomeProfessor}</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Turma</p>
                            <p className="font-medium">{plan.identificacao.turmaSerie} ({plan.identificacao.turno})</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Período</p>
                            <p className="font-medium">{plan.identificacao.periodoSemana}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-slate-500 uppercase font-semibold">Tema da Semana</p>
                            <p className="font-medium text-lg text-indigo-700">{plan.identificacao.temaSemana}</p>
                        </div>
                    </div>

                    {/* BNCC Focus */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase border-b border-slate-200 pb-1 mb-2">Foco na BNCC</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {plan.bncc.campos.map((c: string, i: number) => (
                                <span key={i} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">{c}</span>
                            ))}
                        </div>
                        <p className="text-sm italic text-slate-600 bg-slate-50 p-3 rounded border-l-4 border-indigo-400">
                            <strong>Códigos/Habilidades Sugeridas:</strong> {plan.bncc.habilidades}
                        </p>
                    </div>

                    {/* Weekly Schedule */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-indigo-900 border-b-2 border-indigo-100 pb-2 mb-4">Cronograma de Atividades</h3>
                        <div className="space-y-4">
                            {plan.dias.map((dia: any, index: number) => (
                                <div key={index} className="flex border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="bg-indigo-600 text-white w-24 flex items-center justify-center p-2 font-bold text-sm text-center">
                                        {dia.diaSemana}
                                    </div>
                                    <div className="p-3 bg-white flex-1">
                                        <h4 className="font-bold text-slate-800 mb-1">{dia.titulo}</h4>
                                        <p className="text-sm text-slate-600 mb-2">{dia.descricao}</p>
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium">Recursos: {dia.recursos}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer: Adaptations and Evaluation */}
                    <div className="grid grid-cols-2 gap-6 mt-8">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="text-green-800 font-bold text-sm mb-2">Adaptações / Inclusão</h4>
                            <p className="text-sm text-green-900">{plan.adaptacoes}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="text-blue-800 font-bold text-sm mb-2">Avaliação</h4>
                            <p className="text-sm text-blue-900">{plan.avaliacao}</p>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
