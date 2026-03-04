css_append = """

/* =========================================
   QUIZ STYLES
   ========================================= */

.quiz-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-white);
}

.quiz-step {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease-in-out;
}

.quiz-step.active {
    opacity: 1;
    transform: translateY(0);
}

.step-content {
    animation: fadeIn 0.8s forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.max-w-400 { max-width: 400px; }
.max-w-600 { max-width: 600px; }
.max-w-800 { max-width: 800px; }
.mx-auto { margin-left: auto; margin-right: auto; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 3rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }
.pt-1 { padding-top: 0.25rem; }
.pt-2 { padding-top: 0.5rem; }
.pt-3 { padding-top: 1rem; }
.pt-4 { padding-top: 1.5rem; }
.pt-5 { padding-top: 3rem; }
.pb-1 { padding-bottom: 0.25rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pb-3 { padding-bottom: 1rem; }
.pb-4 { padding-bottom: 1.5rem; }
.pb-5 { padding-bottom: 3rem; }

.text-center { text-align: center; }
.text-left { text-align: left; }
.font-bold { font-weight: 700; }
.w-100 { width: 100%; }
.block { display: block; }
"""

with open('styles.css', 'a', encoding='utf-8') as f:
    f.write(css_append)

print("styles appended")
