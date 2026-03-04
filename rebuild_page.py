import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the <head> segment and keep it.
head_match = re.search(r'(<!DOCTYPE html>.*?</head>)', content, re.DOTALL)
if head_match:
    head_content = head_match.group(1)
else:
    print("Could not find head")
    exit(1)

new_body = """
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

        <!-- ETAPA 6 - VSL -->
        <section id="step-6" class="quiz-step" style="display: none;">
            <div class="container text-center max-w-800 mx-auto step-content pt-4">
                <p class="microtext text-muted mb-4 font-bold" style="font-size: 1.1rem;">Assista. É rápido.</p>
                
                <div class="video-wrapper vertical-video card-shadow mx-auto" id="vturb-player" style="max-width: 360px;">
                    <video id="promo-video" playsinline preload="auto" webkit-playsinline
                        controlslist="nodownload noplaybackrate" crossorigin="anonymous" referrerpolicy="no-referrer"
                        poster="imagens/Whisk_45317e6199a005285bc44c22aa573581dr.jpeg">
                        <source src="https://i.imgur.com/YItYFv7.mp4" type="video/mp4" />
                        Seu navegador não suporta vídeos.
                    </video>
                    <button class="play-overlay" id="play-overlay" type="button" aria-label="Reproduzir vídeo">
                        <span class="play-btn" aria-hidden="true">▶</span>
                    </button>
                    <div class="progress-container" aria-hidden="true">
                        <div class="progress-bar" id="progress-bar"></div>
                    </div>
                    <div class="video-fallback" id="video-fallback" style="display:none;">
                        <p>Ops… seu vídeo não carregou.</p>
                        <a class="btn-outline" href="https://i.imgur.com/YItYFv7.mp4" target="_blank" rel="noopener"
                            style="padding: 10px 20px; font-size: 0.9rem;">Abrir vídeo</a>
                    </div>
                </div>

                <div id="vsl-cta-container" class="mt-4" style="display: none; opacity: 0; transition: opacity 1s ease;">
                    <p class="microcopy mb-3" style="font-size: 0.9rem;">Estamos preparando um presente...</p>
                    <button class="btn-primary w-100 mx-auto max-w-400" onclick="nextStep(7)">LIBERAR ACESSO</button>
                </div>
            </div>
        </section>

        <!-- ETAPA 7 - OFERTA FINAL -->
        <section id="step-7" class="quiz-step" style="display: none;">
            <div class="bg-light pb-5">
                <div class="container step-content pt-5">
                    
                    <div class="mockup-wrapper mx-auto mb-4 floating" style="max-width: 250px; box-shadow: none; background: transparent;">
                        <img src="https://i.imgur.com/vLsgpPq.png" alt="Mockup ProAtividades" class="mockup-image" style="width: 100%; border-radius: 12px;">
                    </div>

                    <div class="section-header mb-5 text-center">
                        <h2 style="font-size: 2.2rem;">Escolha seu acesso</h2>
                    </div>

                    <div class="plans-grid max-w-800 mx-auto mb-5" style="display: grid; gap: 32px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
                        <!-- Basic Plan -->
                        <div class="plan-card card-shadow" style="padding: 32px 24px; display: flex; flex-direction: column;">
                            <h3 class="plan-name" style="font-size: 1.25rem; font-weight: 700;">Plano Básico</h3>
                            <div class="plan-price" style="font-size: 2.5rem; font-weight: 800;">R$ 19<span>,90</span></div>
                            <p class="plan-type" style="margin-bottom: 24px; color: var(--text-muted);">Pagamento único</p>

                            <ul class="plan-features" style="flex: 1; margin-bottom: 32px;">
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Atividades</span></li>
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Histórias</span></li>
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Músicas</span></li>
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Datas comemorativas</span></li>
                            </ul>

                            <a href="https://checkout.navenaut.com/D85G4" class="btn-outline w-100 mt-auto" style="border-radius: 12px; padding: 14px;" onclick="fireUtmifyAndRedirect('https://checkout.navenaut.com/D85G4', event, 'Plano Basico')" data-utmify="checkout">QUERO BÁSICO</a>
                        </div>

                        <!-- Complete Plan -->
                        <div class="plan-card featured card-shadow" style="border: 3px solid var(--primary); padding: 32px 24px; position: relative; transform: scale(1.02); display: flex; flex-direction: column;">
                            <div class="featured-badge" style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--primary); color: white; padding: 4px 16px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; white-space: nowrap;">MAIS ESCOLHIDO PELAS PROFESSORAS</div>
                            <h3 class="plan-name" style="font-size: 1.25rem; font-weight: 700;">Plano Completo</h3>
                            <div class="plan-price" style="font-size: 2.5rem; font-weight: 800; color: var(--primary);">R$ 29<span>,90</span></div>
                            <p class="plan-type" style="margin-bottom: 24px; color: var(--text-muted);">⭐ Recomendado</p>

                            <ul class="plan-features" style="flex: 1; margin-bottom: 32px;">
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Tudo do básico</strong></li>
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Planejamentos semanais</span></li>
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Materiais premium</span></li>
                                <li style="margin-bottom: 12px; display: flex; align-items: start; gap: 8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Atualizações</span></li>
                            </ul>

                            <a href="https://checkout.navenaut.com/9hxvj" class="btn-primary w-100 mt-auto" style="border-radius: 12px; padding: 14px; font-weight: bold;" onclick="fireUtmifyAndRedirect('https://checkout.navenaut.com/9hxvj', event, 'Plano Completo')" data-utmify="checkout">QUERO COMPLETO</a>
                        </div>
                    </div>

                    <!-- Trust text -->
                    <div class="trust-text mb-5 text-center">
                        <p style="font-weight: 500; margin-bottom: 8px;">🔒 Compra 100% Segura. Acesso liberado imediatamente após o pagamento.</p>
                        <a href="https://www.instagram.com/proc.aroloficial?igsh=cGcyYWtjMzZicHhw&utm_source=qr" target="_blank" rel="noopener" class="btn-instagram-discreet mx-auto" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 1px solid #ccc; padding: 6px 16px; border-radius: 20px; text-decoration: none; color: #333; font-weight: 500;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Siga-nos no Instagram
                        </a>
                    </div>
                </div>
            </div>

            <div class="container pt-5">
                <div class="section-header text-center mb-4">
                    <h2>Alguns exemplos reais do que você recebe</h2>
                </div>

                <div class="proofs-grid mb-5" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                    <div class="proof-card card-shadow" style="border-radius: 12px; overflow: hidden;"><img src="https://i.imgur.com/yHqQC3F.png" alt="Print 1" style="width: 100%; height: 100%; object-fit: contain;"></div>
                    <div class="proof-card card-shadow" style="border-radius: 12px; overflow: hidden;"><img src="https://i.imgur.com/Dyioh7Z.png" alt="Print 2" style="width: 100%; height: 100%; object-fit: contain;"></div>
                    <div class="proof-card card-shadow" style="border-radius: 12px; overflow: hidden;"><img src="https://i.imgur.com/04Cde0b.png" alt="Print 3" style="width: 100%; height: 100%; object-fit: contain;"></div>
                    <div class="proof-card card-shadow" style="border-radius: 12px; overflow: hidden;"><img src="https://i.imgur.com/S6hpq4X.png" alt="Print 4" style="width: 100%; height: 100%; object-fit: contain;"></div>
                    <div class="proof-card card-shadow hide-mobile" style="border-radius: 12px; overflow: hidden;"><img src="https://i.imgur.com/fOjvNJv.png" alt="Print 5" style="width: 100%; height: 100%; object-fit: contain;"></div>
                    <div class="proof-card card-shadow hide-mobile" style="border-radius: 12px; overflow: hidden;"><img src="https://i.imgur.com/AfCFeG6.png" alt="Print 6" style="width: 100%; height: 100%; object-fit: contain;"></div>
                </div>

                <!-- FAQ Section -->
                <div class="section-header text-center mb-4 pt-4" style="border-top: 1px solid #eee;">
                    <h2>Dúvidas Frequentes</h2>
                </div>

                <div class="faq-accordion mx-auto mb-5" style="max-width: 700px; display: flex; flex-direction: column; gap: 12px;">
                    <div class="faq-item card-shadow" style="border-radius: 12px; overflow: hidden;">
                        <button class="faq-question w-100" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; font-weight: 600; font-size: 1.05rem; background: none; border: none; text-align: left; cursor: pointer;">
                            Como recebo o acesso?
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div class="faq-answer" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <p style="padding: 0 20px 20px; color: var(--text-main);">Após a confirmação do pagamento, você receberá um e-mail com as instruções e o link para acessar a plataforma imediatamente.</p>
                        </div>
                    </div>

                    <div class="faq-item card-shadow" style="border-radius: 12px; overflow: hidden;">
                        <button class="faq-question w-100" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; font-weight: 600; font-size: 1.05rem; background: none; border: none; text-align: left; cursor: pointer;">
                            Funciona no celular?
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div class="faq-answer" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <p style="padding: 0 20px 20px; color: var(--text-main);">Sim, 100%! A plataforma foi projetada para funcionar perfeitamente em smartphones, tablets e computadores.</p>
                        </div>
                    </div>

                    <div class="faq-item card-shadow" style="border-radius: 12px; overflow: hidden;">
                        <button class="faq-question w-100" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; font-weight: 600; font-size: 1.05rem; background: none; border: none; text-align: left; cursor: pointer;">
                            É para quais idades?
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div class="faq-answer" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <p style="padding: 0 20px 20px; color: var(--text-main);">O material é focado no Berçário e Maternal, abrangendo crianças de 0 a 3 anos (até quase 4 anos).</p>
                        </div>
                    </div>

                    <div class="faq-item card-shadow" style="border-radius: 12px; overflow: hidden;">
                        <button class="faq-question w-100" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; font-weight: 600; font-size: 1.05rem; background: none; border: none; text-align: left; cursor: pointer;">
                            Tem datas comemorativas?
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div class="faq-answer" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <p style="padding: 0 20px 20px; color: var(--text-main);">Sim! O Plano Completo dá acesso exclusivo a todos os projetos e atividades focadas nas principais datas comemorativas do ano.</p>
                        </div>
                    </div>

                    <div class="faq-item card-shadow" style="border-radius: 12px; overflow: hidden;">
                        <button class="faq-question w-100" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; font-weight: 600; font-size: 1.05rem; background: none; border: none; text-align: left; cursor: pointer;">
                            Posso imprimir?
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div class="faq-answer" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <p style="padding: 0 20px 20px; color: var(--text-main);">Com certeza. Os planejamentos, cartazes e moldes possuem arquivos em PDF otimizados para você baixar e imprimir na hora.</p>
                        </div>
                    </div>

                    <div class="faq-item card-shadow" style="border-radius: 12px; overflow: hidden;">
                        <button class="faq-question w-100" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; font-weight: 600; font-size: 1.05rem; background: none; border: none; text-align: left; cursor: pointer;">
                            E se eu tiver dúvidas?
                            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                        <div class="faq-answer" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <p style="padding: 0 20px 20px; color: var(--text-main);">Temos uma equipe de suporte por WhatsApp e Telegram sempre pronta para te ajudar a acessar e utilizar seus materiais.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="footer bg-dark text-white text-center" style="background-color: #111; color: #fff; padding: 40px 0;">
        <div class="container footer-content">
            <div class="footer-logo font-bold mb-3" style="font-weight: 800; font-size: 1.1rem;">ProAtividades • Materiais para Educação Infantil</div>
            <p class="footer-disclaimer mx-auto text-muted mb-4" style="max-width: 600px; color: #aaa; font-size: 0.85rem;">Este é um produto digital. Conteúdos e organização podem receber atualizações para melhor atender às suas necessidades.</p>
            <div class="footer-links" style="display: flex; justify-content: center; gap: 20px; font-size: 0.85rem;">
                <a href="#" style="color: #aaa; text-decoration: none;">Políticas de Privacidade</a>
                <a href="#" style="color: #aaa; text-decoration: none;">Termos de Uso</a>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>
