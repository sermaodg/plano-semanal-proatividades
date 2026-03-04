
document.addEventListener("DOMContentLoaded", () => {

    // 1. ANIMAÇÕES DE ENTRADA (MOURNING / SCROLL REVEAL)
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    // Seleciona elementos para animar
    const revealElements = document.querySelectorAll(".scroll-reveal, .fade-in-up");
    revealElements.forEach(el => observer.observe(el));

    // Força a animação do Hero logo no carregamento
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // 2. SLIDESHOW DE IMAGENS (HERO)
    const slides = document.querySelectorAll(".image-slideshow .slide");
    let currentSlide = 0;

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add("active");
        }, 2000); // Altera a cada 2 segundos
    }


    // Navegação suave para os links internos (ancoras)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. FAQ ACCORDION
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Fecha todos os outros primeiro (opcional, para manter apenas um aberto)
            faqItems.forEach(faq => {
                faq.classList.remove("active");
                faq.querySelector(".faq-answer").style.maxHeight = null;
            });

            // Se não estava ativo, abre. Se estava, ele fechou no loop acima.
            if (!isActive) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 5. MODAL DE PROVAS VISUAIS
    const modal = document.getElementById("proofModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.querySelector(".close-modal");

    if (modal && openModalBtn && closeModalBtn) {
        // Abrir
        openModalBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            // Timeout para permitir que o display block aplique antes de alterar a opacidade
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
            document.body.style.overflow = "hidden"; // Evita scroll na página principal
        });

        // Fechar pelo botão (X)
        const closeModal = () => {
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }, 300); // Tempo da transição
        };

        closeModalBtn.addEventListener("click", closeModal);

        // Fechar clicando fora do conteúdo
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Fechar apertando ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("show")) {
                closeModal();
            }
        });
    }

    // 6. VTURB STYLE VIDEO PLAYER (Robust Implementation)
    const wrapper = document.getElementById("vturb-player");
    const video = document.getElementById("promo-video");
    const overlay = document.getElementById("play-overlay");
    const progressBar = document.getElementById("progress-bar");
    const fallback = document.getElementById("video-fallback");

    if (wrapper && video && overlay && progressBar && fallback) {
        // Estado inicial
        overlay.style.display = "flex";
        fallback.style.display = "none";
        progressBar.style.width = "0%";
        video.controls = false;

        let busy = false;

        function showFallback() {
            overlay.style.display = "none";
            fallback.style.display = "block";
        }

        function updateProgress() {
            if (!video.duration || Number.isNaN(video.duration)) return;
            const pct = Math.min(100, Math.max(0, (video.currentTime / video.duration) * 100));
            progressBar.style.width = pct.toFixed(2) + "%";
        }

        async function safePlay() {
            if (busy) return;
            busy = true;
            try {
                await video.play();
            } catch (err) {
                console.warn("[VIDEO] play() falhou:", err);
                showFallback();
            } finally {
                setTimeout(() => (busy = false), 120);
            }
        }

        function safePause() {
            if (busy) return;
            video.pause();
        }

        function togglePlay() {
            if (video.paused) safePlay();
            else safePause();
        }

        overlay.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
        });

        wrapper.addEventListener("click", (e) => {
            if (e.target.closest("#play-overlay")) return;
            togglePlay();
        });

        video.addEventListener("play", () => {
            overlay.style.display = "none";
        });

        video.addEventListener("pause", () => {
            if (video.currentTime > 0 && video.currentTime < (video.duration || Infinity)) {
                overlay.style.display = "flex";
            }
        });

        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("loadedmetadata", updateProgress);

        video.addEventListener("error", () => {
            const err = video.error;
            console.warn("[VIDEO] erro no elemento video:", err);
            showFallback();
        });
    }
});

// ---------------------------
// ---------------------------
// 3) UTMify & Facebook Tracking
// ---------------------------

// Flag to prevent double Lead firing
window.__leadSent = false;
window.quizData = {};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function sendLeadData() {
    if (window.__leadSent) return;
    window.__leadSent = true;

    console.log("[TRACKING] Sending Lead data...", window.quizData);

    // 1. GTM DataLayer
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'Lead',
            quiz_answers: window.quizData
        });
    }

    // 2. UTMify Pixel
    if (typeof window.pixelUtmify === 'function') {
        window.pixelUtmify('Lead');
    }

    // 3. Meta Pixel
    if (typeof fbq === 'function') {
        fbq('track', 'Lead', window.quizData);
    }

    // 4. (Optional) CAPI
    try {
        fetch('/api/capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_name: 'Lead',
                event_id: generateUUID(),
                user_data: window.quizData,
                url: window.location.href
            }),
            keepalive: true
        }).catch(() => { });
    } catch (e) { }
}

async function fireUtmifyAndRedirect(url, event, planName = 'Oferta') {
    if (event) {
        event.preventDefault();
    }

    // Grab target URL (can be from argument or event target)
    let targetUrl = url;
    if (event && event.currentTarget && event.currentTarget.href) {
        targetUrl = event.currentTarget.href;
    }

    const finalUrl = new URL(targetUrl);

    // Keep current UTMs
    const currentParams = new URLSearchParams(window.location.search);
    for (const [key, value] of currentParams) {
        if (!finalUrl.searchParams.has(key)) {
            finalUrl.searchParams.append(key, value);
        }
    }

    // UUID for Deduplication
    const eventId = generateUUID();

    console.log("[TRACKING] Initiating Checkout...", { planName, eventId });

    // Race Condition Promises
    const trackFb = new Promise((resolve) => {
        try {
            if (typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout', {
                    content_name: planName,
                    quiz_answers: window.quizData
                }, { eventID: eventId });
            }
        } catch (e) {
            console.warn("fbq call error:", e);
        }
        resolve();
    });

    const trackCapi = fetch('/api/capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event_name: 'InitiateCheckout',
            event_id: eventId,
            content_name: planName,
            user_data: window.quizData,
            url: window.location.href
        }),
        keepalive: true
    }).catch(() => { });

    const trackUtmify = new Promise((resolve) => {
        try {
            // Se o UTMify manual for necessário, mas geralmente data-utmify="checkout" resolve
            if (typeof window.pixelUtmify === 'function') {
                window.pixelUtmify('InitiateCheckout');
            }
        } catch (err) { }
        resolve();
    });

    // 200ms Timeout Race
    const timeout = new Promise((resolve) => setTimeout(resolve, 200));

    try {
        await Promise.race([
            Promise.all([trackFb, trackCapi, trackUtmify]),
            timeout
        ]);
    } catch (err) {
        console.warn("Tracking timeout or error:", err);
    } finally {
        // Redireciona na mesma aba para garantir persistência de rastreio em alguns navegadores
        window.location.href = finalUrl.toString();
    }
}

// ---------------------------
// 4) QUIZ LOGIC
// ---------------------------
function nextStep(stepNumber, answerLabel, questionKey) {
    // Capturar resposta se houver
    if (answerLabel && questionKey) {
        window.quizData[questionKey] = answerLabel;
    }

    // Esconder todos os steps e remover a classe 'active'
    let steps = document.querySelectorAll('.quiz-step');
    steps.forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });

    // Mostrar o novo step selecionado
    let nextStepElement = document.getElementById('step-' + stepNumber);
    if (nextStepElement) {
        nextStepElement.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Pequeno atraso para aplicar a classe 'active' para criar a animação
        setTimeout(() => {
            nextStepElement.classList.add('active');
        }, 50);

        // Disparar Lead no passo final (Oferta)
        if (stepNumber === 6) {
            sendLeadData();
        }

        // VSL Logic: VTurb delay on step 5
        if (stepNumber === 5) {
            // Exibe o botão após 60 segundos (60000 ms)
            setTimeout(() => {
                const delayContainer = document.getElementById('delay-container');
                if (delayContainer) {
                    delayContainer.style.display = 'block';
                    // Efeito de fade-in
                    setTimeout(() => {
                        delayContainer.style.opacity = '1';
                    }, 50);
                }
            }, 60000); // 60s
        }
    }
}
