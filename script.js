document.addEventListener('DOMContentLoaded', () => {

    // --- 1. AUTOMAÇÃO DE DATA (Mês Atual) ---
    const mesElement = document.getElementById('mesAtual');
    if (mesElement) {
        const data = new Date();
        const nomeMes = data.toLocaleString('pt-BR', { month: 'long' });
        mesElement.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
    }

    // --- 2. CONFIGURAÇÃO DE ANIMAÇÃO (ScrollReveal) ---
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            distance: '30px',
            duration: 1000,
            easing: 'ease-out',
            reset: false,
            mobile: true
        });

        // Ordem de Entrada
        sr.reveal('.main-header', { origin: 'top', delay: 100 });
        sr.reveal('.hero-content', { origin: 'bottom', delay: 300 });
        sr.reveal('.hero-visual', { origin: 'bottom', delay: 500 });
        
        // Seção Método
        sr.reveal('.method-section .section-header', { origin: 'bottom', delay: 200 });
        sr.reveal('.glass-card', { origin: 'bottom', interval: 200, delay: 300 });

        // Seção Resultados
        sr.reveal('.results-section .section-header', { origin: 'bottom', delay: 200 });
        sr.reveal('.tech-card', { origin: 'bottom', interval: 150, delay: 300, distance: '40px' });
    }

    // --- 3. EFEITO 3D PARALLAX (Desktop Only) ---
    if (window.innerWidth > 1024) {
        const container = document.querySelector('.hero');
        const cardWrapper = document.querySelector('.card-3d-wrapper');
        const badgeTop = document.querySelector('.badge-top-right');
        const badgeBottom = document.querySelector('.badge-bottom-left');

        if (container && cardWrapper) {
            container.addEventListener('mousemove', (e) => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

                cardWrapper.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                
                if(badgeTop) badgeTop.style.transform = `translateZ(50px) translateX(${-xAxis}px) translateY(${-yAxis}px)`;
                if(badgeBottom) badgeBottom.style.transform = `translateZ(50px) translateX(${-xAxis}px) translateY(${-yAxis}px)`;
            });

            container.addEventListener('mouseleave', () => {
                cardWrapper.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
                if(badgeTop) badgeTop.style.transform = 'translateZ(0)';
                if(badgeBottom) badgeBottom.style.transform = 'translateZ(0)';
            });
        }
    }

    // --- 4. LÓGICA DO FORMULÁRIO MULTI-STEP (CORRIGIDA) ---
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progressBar');
    const stepIndicators = document.querySelectorAll('.step');
    let currentStep = 0;

    function updateForm() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        // Atualiza Barra e Indicadores
        const progress = ((currentStep + 1) / steps.length) * 100;
        if(progressBar) progressBar.style.width = `${progress}%`;

        stepIndicators.forEach((ind, index) => {
            if(index <= currentStep) ind.classList.add('active');
            else ind.classList.remove('active');
        });
        
        // Rola suavemente para o topo do formulário no mobile
        if(window.innerWidth < 768) {
            document.querySelector('.anamnese-section').scrollIntoView({behavior: 'smooth'});
        }
    }

    // Botão AVANÇAR
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            // Seleciona Inputs, Selects E TEXTAREAS da etapa atual
            const currentInputs = steps[currentStep].querySelectorAll('input, select, textarea');
            let isValid = true;
            
            // Verifica campo por campo
            for (const input of currentInputs) {
                // Ignora campos invisíveis (condicionais não ativadas)
                if (input.offsetParent === null) continue;

                if (!input.checkValidity()) {
                    isValid = false;
                    input.reportValidity(); // Mostra o balão de erro nativo do navegador
                    break; // Para no primeiro erro encontrado
                }
            }

            if (isValid && currentStep < steps.length - 1) {
                currentStep++;
                updateForm();
            }
        });
    });

    // Botão VOLTAR
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateForm();
            }
        });
    });

    // --- 5. CAMPOS CONDICIONAIS (SAÚDE) ---
    document.querySelectorAll('input[type="radio"][data-target]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            
            // Esconde outros do mesmo grupo
            const groupName = e.target.name;
            document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
                 if(r.getAttribute('data-target')) {
                     const id = r.getAttribute('data-target');
                     if(id !== targetId) {
                         const el = document.getElementById(id);
                         if(el) {
                             el.style.display = 'none';
                             // Remove obrigatoriedade se esconder
                             const innerInput = el.querySelector('input');
                             if(innerInput) innerInput.required = false; 
                         }
                     }
                 }
            });

            // Mostra o selecionado
            if (targetEl) {
                targetEl.style.display = 'block';
                const innerInput = targetEl.querySelector('input');
                if(innerInput) {
                    innerInput.focus();
                    // Opcional: Tornar obrigatório apenas se exibido
                    // innerInput.required = true; 
                }
            }
        });
    });

    // Esconder ao clicar em "Não"
    document.querySelectorAll('input[type="radio"][value="Não"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
             const groupName = e.target.name;
             // Procura o irmão "Sim" para saber qual ID esconder
             const siblingYes = document.querySelector(`input[name="${groupName}"][value="Sim"]`);
             if(siblingYes && siblingYes.getAttribute('data-target')){
                 const targetId = siblingYes.getAttribute('data-target');
                 const targetEl = document.getElementById(targetId);
                 if(targetEl) {
                     targetEl.style.display = 'none';
                     const innerInput = targetEl.querySelector('input');
                     if(innerInput) {
                         innerInput.value = ''; // Limpa valor
                         innerInput.required = false; 
                     }
                 }
             }
        });
    });

    // --- 6. ENVIO WHATSAPP ---
    const form = document.getElementById('techForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Captura segura dos dados (com operador ?. para evitar erro se campo não existir)
            const getVal = (id) => document.getElementById(id)?.value || 'N/A';
            
            // Passo 1
            const nome = getVal('nome');
            const nasc = getVal('dataNascimento');
            const cidade = getVal('cidade');
            const wpp = getVal('whatsapp');
            const prof = getVal('profissao');
            const peso = getVal('peso');
            const altura = getVal('altura');
            const agua = getVal('agua');

            // Passo 2
            const restricoes = getVal('restricoes');
            const evitar = getVal('alimentosEvitar');
            const favoritos = getVal('fontesFavoritas');
            const refDia = getVal('refeicoesAtual');
            const fome = getVal('fomeManha');
            const intestino = getVal('intestino');
            const rotinaAlim = getVal('alimentacaoAtual');

            // Passo 3 (Resumo Saúde)
            const cardiaco = document.querySelector('input[name="cardiaco"]:checked')?.value || 'Não';
            const famCard = document.querySelector('input[name="famCardiaco"]:checked')?.value || 'Não';
            const lesao = document.querySelector('input[name="lesao"]:checked')?.value || 'Não';
            const remedio = document.querySelector('input[name="remedio"]:checked')?.value || 'Não';
            const fumante = document.querySelector('input[name="fumante"]:checked')?.value || 'Não';

            // Observações Saúde
            const obsCard = getVal('obsCardiaco');
            const obsLesao = getVal('obsLesao');
            const obsRemedio = getVal('obsRemedio');

            // Passo 4
            const tempoTreino = getVal('tempoTreino');
            const diasTreino = getVal('diasTreino');
            const cardio = getVal('cardio');
            const focoInf = getVal('focoInferior');
            const focoSup = getVal('focoSuperior');

            // Passo 5
            const objetivo = document.querySelector('input[name="objetivoPrincipal"]:checked')?.value || 'N/A';
            const suplementos = getVal('suplementos');
            const aej = getVal('aej');
            const comentarios = getVal('comentarios');

            // Formatação da Mensagem
            const message = `
*PROTOCOLO KF - NOVA ANAMNESE* 🚀

👤 *PERFIL*
Nome: ${nome}
Idade/Nasc: ${nasc}
Cidade: ${cidade} | Prof: ${prof}
Contato: ${wpp}

📊 *BIO*
Peso: ${peso}kg | Altura: ${altura}cm
Água: ${agua}ml

🍎 *NUTRIÇÃO*
Refeições: ${refDia}x | Fome Manhã: ${fome}
Intestino: ${intestino}
Restrições: ${restricoes}
Não Gosta: ${evitar}
Gosta: ${favoritos}
Rotina: ${rotinaAlim}

❤️ *SAÚDE*
Cardíaco: ${cardiaco} ${obsCard !== 'N/A' && obsCard ? '('+obsCard+')' : ''}
Hist. Fam: ${famCard}
Lesões: ${lesao} ${obsLesao !== 'N/A' && obsLesao ? '('+obsLesao+')' : ''}
Remédios: ${remedio} ${obsRemedio !== 'N/A' && obsRemedio ? '('+obsRemedio+')' : ''}
Fumante: ${fumante}

💪 *TREINO*
Exp: ${tempoTreino}
Disp: ${diasTreino}
Cardio: ${cardio}
Foco Inf: ${focoInf}
Foco Sup: ${focoSup}

🎯 *FINALIZAÇÃO*
Obj: ${objetivo}
Supl: ${suplementos}
AEJ: ${aej}
Obs: ${comentarios}

---------------------------
_Solicito análise para início do projeto._
            `.trim();

            const phone = '559193537043';
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            
            window.open(url, '_blank');
        });
    }

    // Dados do Quiz
    const quizData = [
        {
            question: "O que te impede de ter o shape hoje?",
            options: [
                { text: "Falta de Tempo/Rotina Louca", type: "RUSH", icon: "fas fa-clock" },
                { text: "Preguiça/Falta de Foco", type: "MIND", icon: "fas fa-brain" },
                { text: "Não sei o que comer/treinar", type: "TECH", icon: "fas fa-question-circle" }
            ]
        },
        {
            question: "Qual seu estilo de treino preferido?",
            options: [
                { text: "Intenso e Rápido (30-40min)", type: "RUSH", icon: "fas fa-bolt" },
                { text: "Carga Máxima (Old School)", type: "MIND", icon: "fas fa-dumbbell" },
                { text: "Calculado e Científico", type: "TECH", icon: "fas fa-microchip" }
            ]
        },
        {
            question: "O que você busca no espelho?",
            options: [
                { text: "Definição Atlética", type: "RUSH", icon: "fas fa-running" },
                { text: "Volume Bruto", type: "MIND", icon: "fas fa-muscle-up" },
                { text: "Estética Simétrica", type: "TECH", icon: "fas fa-ruler-combined" }
            ]
        }
    ];

    let quizStep = 0;
    let quizScores = { RUSH: 0, MIND: 0, TECH: 0 };

    // Torna a função startQuiz acessível globalmente (pois é chamada no onclick do HTML)
    window.startQuiz = function() {
        document.getElementById('quiz-start').classList.remove('active');
        document.getElementById('quiz-question').classList.add('active');
        renderQuestion();
    };

    function renderQuestion() {
        const q = quizData[quizStep];
        document.getElementById('questionTitle').textContent = q.question;
        
        const container = document.getElementById('optionsContainer');
        container.innerHTML = ''; // Limpa anterior

        q.options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'quiz-option';
            btn.innerHTML = `<i class="${opt.icon}"></i> ${opt.text}`;
            btn.onclick = () => nextQuestion(opt.type);
            container.appendChild(btn);
        });

        // Atualiza barra
        const progress = ((quizStep) / quizData.length) * 100;
        document.getElementById('quizBar').style.width = `${progress}%`;
    }

    function nextQuestion(type) {
        quizScores[type]++;
        quizStep++;

        if (quizStep < quizData.length) {
            renderQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        document.getElementById('quiz-question').classList.remove('active');
        document.getElementById('quiz-result').classList.add('active');
        document.getElementById('quizBar').style.width = '100%';

        // Calcula vencedor
        let winner = Object.keys(quizScores).reduce((a, b) => quizScores[a] > quizScores[b] ? a : b);

        const profiles = {
            RUSH: {
                title: "EXECUTIVO TÁTICO",
                desc: "Você precisa de eficiência. Seu protocolo será baseado em alta densidade de treino para gerar o máximo de resultado no menor tempo possível."
            },
            MIND: {
                title: "GLADIADOR",
                desc: "Você tem a força, falta a direção. Vamos canalizar essa energia com um treino de choque para quebrar a estagnação mental e física."
            },
            TECH: {
                title: "ESTRATEGISTA",
                desc: "Você gosta de dados e precisão. Seu protocolo será milimetricamente calculado, com progressão de carga e dieta flexível ajustada."
            }
        };

        const result = profiles[winner];
        document.getElementById('resultName').textContent = result.title;
        document.getElementById('resultDesc').textContent = result.desc;
    }

    // --- LÓGICA DO FAQ (Acordeão) ---
    const faqItems = document.querySelectorAll('.accordion-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-body').style.maxHeight = null;
            });

            // Se não estava ativo, abre
            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.accordion-body');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // Revelar Footer e FAQ ao rolar
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.about-visual', { origin: 'left', delay: 200 });
        ScrollReveal().reveal('.about-content', { origin: 'right', delay: 400 });
        ScrollReveal().reveal('.accordion-item', { origin: 'bottom', interval: 100, delay: 200 });
    }

    // --- LÓGICA DO CARROSSEL INFINITO ---
    const scrollers = document.querySelectorAll(".scroller");

    // Verifica se o usuário não tem preferência por reduzir movimento
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // Adiciona atributo para saber que ativou
            scroller.setAttribute("data-animated", true);

            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            // Duplica cada item e coloca no final da lista
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                // Esconde do leitor de tela (acessibilidade) pois é duplicado
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }

});