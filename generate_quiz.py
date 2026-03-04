import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

head_match = re.search(r'(<!DOCTYPE html>.*?</head>)', content, re.DOTALL)
head_content = head_match.group(1) if head_match else ""

# Extract the Plans section from current index.html
planos_match = re.search(r'(<section id="planos" class="plans-section scroll-reveal">.*?</section>)', content, re.DOTALL)
planos_html = anos_match = planos_match.group(1) if planos_match else ""

# Extract proofs section
proofs_match = re.search(r'(<section class="proofs-section scroll-reveal bg-light">.*?</section>)', content, re.DOTALL)
proofs_html = proofs_match.group(1) if proofs_match else ""

# Extract FAQ section
faq_match = re.search(r'(<section class="faq-section scroll-reveal bg-light">.*?</section>)', content, re.DOTALL)
faq_html = faq_match.group(1) if faq_match else ""

# Extract Footer
footer_match = re.search(r'(<footer class="footer">.*?</footer>)', content, re.DOTALL)
footer_html = footer_match.group(1) if footer_match else ""

new_body = f"""
<body>
    <main class="quiz-container">
        <!-- ETAPA 1 - Gancho -->
        <section id="step-1" class="quiz-step active scroll-reveal">
            <div class="container text-center max-w-600 mx-auto step-content pt-4 pb-4">
                <p class="microtext text-muted mb-2 font-bold" style="font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase;">NOVO MATERIAL LIBERADO PARA PROFESSORAS</p>
                <h1 class="headline-primary mb-3" style="font-size: 1.8rem;">Profê, isso aqui está ajudando centenas de professoras a economizar horas toda semana</h1>
                <p class="subheadline mb-4" style="font-size: 1.1rem;">Material completo para Berçário e Maternal já pronto para usar.</p>
                
                <div class="mockup-wrapper floating mx-auto mb-4" style="max-width: 320px; box-shadow: none; background: transparent;">
                    <img src="https://i.imgur.com/vLsgpPq.png" alt="Mockup ProAtividades" class="mockup-image" style="width: 100%; border-radius: 12px;">
                </div>

                <ul class="quiz-bullets text-left mx-auto mb-4" style="max-width: 350px; list-style: none; padding: 0;">
                    <li class="mb-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><polyline points="20 6 9 17 4 12"></polyline></svg> <b>Planejamentos prontos</b></li>
                    <li class="mb-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><polyline points="20 6 9 17 4 12"></polyline></svg> <b>Atividades prontas</b></li>
                    <li class="mb-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><polyline points="20 6 9 17 4 12"></polyline></svg> <b>Histórias, músicas e datas comemorativas</b></li>
                    <li class="mb-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><polyline points="20 6 9 17 4 12"></polyline></svg> <b>Tudo editável</b></li>
                </ul>

                <button class="btn-primary w-100 max-w-400 mx-auto" onclick="nextStep(2)">QUERO VER POR DENTRO</button>
                <p class="microcopy mt-3">Leva menos de 1 minuto</p>
            </div>
        </section>

        <!-- ETAPA 2 - Pergunta 1 -->
        <section id="step-2" class="quiz-step" style="display: none;">
            <div class="container text-center max-w-600 mx-auto step-content pt-5 pb-5 mt-5">
                <h2 class="mb-5" style="font-size: 1.8rem;">Você trabalha com qual faixa etária?</h2>
                <div class="quiz-options max-w-400 mx-auto">
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(3)">Berçário</button>
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(3)">Maternal</button>
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(3)">Ambos</button>
                </div>
            </div>
        </section>

        <!-- ETAPA 3 - Pergunta 2 -->
        <section id="step-3" class="quiz-step" style="display: none;">
            <div class="container text-center max-w-600 mx-auto step-content pt-5 pb-5 mt-5">
                <h2 class="mb-5" style="font-size: 1.8rem;">Você cria seus planejamentos:</h2>
                <div class="quiz-options max-w-400 mx-auto">
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(4)">Do zero</button>
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(4)">Adapta da internet</button>
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(4)">Usa materiais prontos</button>
                </div>
            </div>
        </section>

        <!-- ETAPA 4 - Pergunta 3 -->
        <section id="step-4" class="quiz-step" style="display: none;">
            <div class="container text-center max-w-600 mx-auto step-content pt-5 pb-5 mt-5">
                <h2 class="mb-5" style="font-size: 1.8rem;">Quanto tempo isso consome por semana?</h2>
                <div class="quiz-options max-w-400 mx-auto">
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(5)">Menos de 1 hora</button>
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(5)">1 a 3 horas</button>
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(5)">3 a 5 horas</button>
                    <button class="btn-outline w-100 mb-3 text-left pl-4" style="text-align: left; padding-left: 24px; font-size: 1.1rem;" onclick="nextStep(5)">Mais de 5 horas</button>
                </div>
            </div>
        </section>

        <!-- ETAPA 5 - Transição -->
        <section id="step-5" class="quiz-step" style="display: none;">
            <div class="container text-center max-w-600 mx-auto step-content pt-5 pb-5 mt-5">
                <h2 class="mb-3" style="font-size: 2rem;">Baseado nas suas respostas…</h2>
                <p class="subheadline mb-5" style="font-size: 1.25rem;">Isso pode te ajudar muito.</p>
                <button class="btn-primary w-100 max-w-400 mx-auto text-lg mt-4 py-3" onclick="nextStep(6)">VER MATERIAL</button>
            </div>
        </section>

        <!-- ETAPA 6 - OFERTA FINAL (Removida a VSL e usando o layout original) -->
        <section id="step-6" class="quiz-step" style="display: none;">
            {planos_html}
            {proofs_html}
            {faq_html}
        </section>
    </main>

    {footer_html}

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>
"""

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(head_content + "\n" + new_body)

