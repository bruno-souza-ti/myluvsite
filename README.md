# Para Você

Um site simples e romântico, feito para ela.

## Estrutura

```
index.html          marcação da página
css/style.css        estilos
js/config.js          ⭐ o único arquivo que você precisa editar
js/main.js            lógica do site (não precisa mexer)
assets/fotos/         coloque as fotos aqui
```

## Como personalizar

1. Abra `js/config.js` num editor de texto.
2. Troque `yourName`, `herName`, `startDate` (data/hora em que começaram a namorar), o texto de `letter` e as frases de `reasons`.
3. Para adicionar fotos: coloque os arquivos dentro de `assets/fotos/` e troque cada
   `{ placeholder: true }` da lista `photos` por:
   ```js
   { img: "assets/fotos/nome-do-arquivo.jpg", alt: "descrição da foto" }
   ```

## Como testar

Dê duplo clique em `index.html` — abre direto no navegador, sem precisar de servidor.

## Como publicar (GitHub Pages)

1. Crie um repositório novo no GitHub (pode ser privado).
2. Suba estes arquivos para o repositório.
3. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
4. Em alguns minutos o site fica no ar em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.
