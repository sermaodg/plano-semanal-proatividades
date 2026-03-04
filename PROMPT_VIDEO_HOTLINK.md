# Prompt de Diagnóstico e Configuração de Vídeo (Player Customizado / VTurb-like)

**Caso de Uso:** Quando um vídeo hospedado externamente (ex: Imgur, AWS S3 mal configurado, etc.) fica com tela preta, não inicia o autoplay, ou o console do navegador exibe erro `403 Forbidden` (`Failed to load resource`).

---

**Copie e cole o texto abaixo para a Inteligência Artificial sempre que enfrentar esse problema em outros projetos:**

> "Tenho uma Landing Page com um player de vídeo customizado (estilo VTurb, usando a tag `<video>` do HTML) e botões de play/pause sobrepostos via JavaScript. O vídeo não está carregando, a tela fica preta (ou invisível), e no console (F12 -> aba Network) vejo o erro '403 Forbidden' ou 'Failed to load resource' na URL do meu arquivo .mp4. O vídeo está hospedado externamente (ex: Imgur).
>
> Por favor, me ajude a corrigir esse problema garantindo **obrigatoriamente** o seguinte protocolo antibloqueio e conformidade mobile:
>
> **1. Contorno de Hotlink no HTML:** Adicione a tag `<meta name="referrer" content="no-referrer">` no `<head>` do meu documento HTML. Essa tag esconde a origem do tráfego para que serviços como o Imgur não bloqueiem a indexação e libere a reprodução via hotlink.
> **2. Estrutura do Elemento Video:** Certifique-se de que a tag `<video>` **não** possua atributos conflitantes como `crossorigin="anonymous"` nem referrers inline na própria tag. Ela deve ser simples, contendo `playsinline`, `preload="auto"`, `webkit-playsinline` e um atributo `poster` apontando para a imagem de capa (impedindo telas pretas ao carregar).
> **3. Autoplay e Mobile no JS:** O vídeo **deve** ser inicializado programaticamente no JS com `video.muted = true` e `video.playsInline = true`. Se não iniciar mutado, navegadores modernos (Safari, iOS, Chrome Mobile) impedem a chamada de `play()` sem interação prévia.
> **4. Controle AbortError / Toggle Seguro:** O evento de clique (para tirar do pause e ligar o som) não pode gerar duplo clique concorrente causando `NotAllowedError` ou `AbortError`. Crie uma lógica assíncrona blindada (`async function`) gerenciando o play através de um `try/catch` e uma variável de bloqueio de estado (`isTryingToPlay`). Quando a promessa de `.play()` devolver sucesso sob a interação do usuário, aí sim defina o `video.muted = false` para reproduzir som.
> **5. Lógica de Fallback de Queda:** Em caso de `error` no `<video>` ou falha capturada no `catch` do _play_, o container original de controles deve sumir e uma div de Fallback deve ser mostrada, com um link nativo simples `<a>` enviando a pessoa para a fonte do vídeo (uma emergência no meio de um lançamento).
>
> Se os 5 passos estiverem cobertos e o 'Console de Rede' persistir em mostrar `403 Forbidden`, assumiremos que não é falha de código, e sim bloqueio irreversível do host. Indique hospedagens profissionais em nuvem para migração do .mp4."

---

### Por que esse Prompt funciona tão bem?

- Ele tira a Inteligência Artificial da "Adivinhação de JavaScript" e dá as diretrizes claras que **403 não é erro de código**, é erro de regra de servidor.
- Já força a IA criar o código com **espera Assíncrona** (`async / await play()`), prevenindo os velhos bugs em celulares onde você clica repetidamente no vídeo e ele buga o carregamento na metade. 
- Mata imediatamente os problemas com Iphones que detestam que o script tente rodar um vídeo publicamente antes do clique e sem "Mudo" ativado.
