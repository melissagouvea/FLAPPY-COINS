# Flappy Coins

Jogo arcade 2D feito com HTML, CSS e JavaScript puro (Canvas). Sem dependências e sem etapa de build.

## Como jogar
- Toque na tela, clique ou aperte Espaço para o passarinho subir.
- Passe pelos canos para fazer pontos e pegue moedas.
- 🛡 Escudo aguenta uma batida. 🧲 Ímã atrai moedas por 8 segundos.
- Aperte P ou Esc para pausar.

## Recursos
- Missões diárias (renovam à meia-noite, no horário do aparelho)
- Lojinha com cores, chapéus, óculos, cachecóis e cenários
- Ranking local por pontos ou moedas (geral e semanal), com opção de limpar
- Tema claro, escuro e automático
- Volume de música e efeitos ajustável

## Estrutura
```
flappy-coins/
├── index.html
├── css/style.css
├── js/game.js
├── README.md
└── .gitignore
```

## Rodar localmente
Abra o `index.html` no navegador ou use a extensão Live Server do VS Code.

## Publicar na Vercel
1. Suba a pasta para um repositório no GitHub.
2. Na Vercel, clique em Add New > Project e importe o repositório.
3. Deixe o Framework como "Other", sem comando de build, e clique em Deploy.

## Salvamento e ranking
O progresso (moedas, itens, missões, recordes e ranking) fica salvo no `localStorage` do navegador. Nada é enviado para servidor, então cada aparelho tem o seu próprio progresso. Um ranking global precisaria de um backend.