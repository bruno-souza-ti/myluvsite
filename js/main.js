/* ============================================================
   Não precisa mexer daqui pra baixo — a personalização fica em js/config.js
   ============================================================ */

// nomes no topo
document.getElementById("heroNames").innerHTML =
  `${CONFIG.herName}<span class="amp">&amp;</span>${CONFIG.yourName}`;

// contador ao vivo — anos, meses, semanas, dias, horas, minutos, segundos
const counterWrapEl = document.getElementById("counterWrap");
const counterOrder = [
  { key: "years", label: (n) => (n === 1 ? "ano" : "anos") },
  { key: "months", label: (n) => (n === 1 ? "mês" : "meses") },
  { key: "weeks", label: (n) => (n === 1 ? "semana" : "semanas") },
  { key: "days", label: (n) => (n === 1 ? "dia" : "dias") },
  { key: "hours", label: (n) => "horas" },
  { key: "minutes", label: (n) => "min" },
  { key: "seconds", label: (n) => "seg" },
];

// cria as caixas uma vez só
counterWrapEl.innerHTML = counterOrder
  .map(
    (c) => `
  <div class="counter-box">
    <div class="counter-num" id="cn-${c.key}">0</div>
    <div class="counter-label" id="cl-${c.key}">${c.key}</div>
  </div>
`,
  )
  .join("");

function breakdownSince(start, now) {
  // anos e meses por diferença de calendário
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let cursor = new Date(
    start.getFullYear() + years,
    start.getMonth() + months,
    start.getDate(),
    start.getHours(),
    start.getMinutes(),
    start.getSeconds(),
  );
  if (cursor > now) {
    months--;
    cursor = new Date(
      start.getFullYear() + years,
      start.getMonth() + months,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
      start.getSeconds(),
    );
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // resto em milissegundos vira semanas/dias/horas/min/seg
  let restMs = now - cursor;
  const SEC = 1000,
    MIN = 60 * SEC,
    HOUR = 60 * MIN,
    DAY = 24 * HOUR,
    WEEK = 7 * DAY;

  const weeks = Math.floor(restMs / WEEK);
  restMs -= weeks * WEEK;
  const days = Math.floor(restMs / DAY);
  restMs -= days * DAY;
  const hours = Math.floor(restMs / HOUR);
  restMs -= hours * HOUR;
  const minutes = Math.floor(restMs / MIN);
  restMs -= minutes * MIN;
  const seconds = Math.floor(restMs / SEC);

  return { years, months, weeks, days, hours, minutes, seconds };
}

function tick() {
  const now = new Date();
  const b = breakdownSince(CONFIG.startDate, now);
  counterOrder.forEach((c) => {
    document.getElementById(`cn-${c.key}`).textContent = b[c.key];
    document.getElementById(`cl-${c.key}`).textContent = c.label(b[c.key]);
  });
}
tick();
setInterval(tick, 1000);

// data/hora de referência, por extenso
const fmt = CONFIG.startDate.toLocaleString("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
document.getElementById("counterSince").textContent =
  `contando desde ${fmt}`;

// carta
const letterFullEl = document.getElementById("letterFull");
letterFullEl.innerHTML =
  CONFIG.letter.map((p) => `<p>${p}</p>`).join("") +
  `<p class="sign">${CONFIG.signOff}<br>— ${CONFIG.yourName}</p>`;

const envelope = document.getElementById("envelope");
envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  setTimeout(() => letterFullEl.classList.add("show"), 500);
});

// galeria — display rolante com duas fileiras (sentidos opostos)
// cada foto real (não-placeholder) guarda seu índice original em CONFIG.photos
// para o lightbox poder abrir a foto certa e navegar entre elas.
const realPhotos = CONFIG.photos
  .map((p, i) => ({ ...p, idx: i }))
  .filter((p) => !p.placeholder);

function photoSlotHTML(p, globalIndex) {
  if (p.placeholder) {
    return `<div class="photo-slot"><div class="icon">🤍</div><div>foto ${globalIndex + 1}<br>adicione aqui</div></div>`;
  }
  return `<div class="photo-slot has-photo" data-idx="${globalIndex}"><img src="${p.img}" alt="${p.alt || ""}"></div>`;
}

function fillTrack(elId, photos, offset) {
  const el = document.getElementById(elId);
  const html = photos.map((p, i) => photoSlotHTML(p, i + offset)).join("");
  // duplica o conteúdo para o loop infinito ficar contínuo
  el.innerHTML = html + html;
}
fillTrack("track", CONFIG.photos, 0);

// lightbox — abre a foto clicada e permite navegar entre todas as fotos reais
const lightboxOverlay = document.getElementById("lightboxOverlay");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
let lightboxPos = 0;

function renderLightbox() {
  const p = realPhotos[lightboxPos];
  if (!p) return;
  lightboxImg.src = p.img;
  lightboxImg.alt = p.alt || "";
  lightboxCaption.textContent = p.alt || "";
}
function openLightbox(globalIndex) {
  const pos = realPhotos.findIndex((p) => p.idx === globalIndex);
  if (pos === -1) return;
  lightboxPos = pos;
  renderLightbox();
  lightboxOverlay.classList.add("show");
}
function closeLightbox() {
  lightboxOverlay.classList.remove("show");
}
function stepLightbox(delta) {
  if (realPhotos.length === 0) return;
  lightboxPos = (lightboxPos + delta + realPhotos.length) % realPhotos.length;
  renderLightbox();
}

document.getElementById("marquee").addEventListener("click", (e) => {
  const slot = e.target.closest(".photo-slot[data-idx]");
  if (!slot) return;
  openLightbox(Number(slot.dataset.idx));
});
document
  .getElementById("lightboxClose")
  .addEventListener("click", closeLightbox);
document
  .getElementById("lightboxPrev")
  .addEventListener("click", () => stepLightbox(-1));
document
  .getElementById("lightboxNext")
  .addEventListener("click", () => stepLightbox(1));
lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightboxOverlay.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

// motivos — cartões que viram ao clicar/tocar
const reasonsGridEl = document.getElementById("reasonsGrid");
reasonsGridEl.innerHTML = CONFIG.reasons
  .map(
    (reason, i) => `
  <div class="reason-card" tabindex="0" role="button" aria-label="Motivo ${i + 1}, toque para virar">
    <div class="reason-card-inner">
      <div class="reason-card-front">
        <div class="reason-num">${String(i + 1).padStart(2, "0")}</div>
        <div class="reason-heart">♡</div>
        <div class="reason-hint">toque para ver</div>
      </div>
      <div class="reason-card-back"><p>${reason}</p></div>
    </div>
  </div>
`,
  )
  .join("");

reasonsGridEl.addEventListener("click", (e) => {
  const card = e.target.closest(".reason-card");
  if (card) card.classList.toggle("flipped");
});
reasonsGridEl.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".reason-card");
  if (!card) return;
  e.preventDefault();
  card.classList.toggle("flipped");
});

// pétalas flutuantes
const petalsEl = document.getElementById("petals");
const petalChars = ["♡", "✿", "❀"];
for (let i = 0; i < 16; i++) {
  const el = document.createElement("div");
  el.className = "petal";
  el.textContent = petalChars[Math.floor(Math.random() * petalChars.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = 10 + Math.random() * 14 + "s";
  el.style.animationDelay = Math.random() * 12 + "s";
  el.style.color = Math.random() > 0.5 ? "#e9a4b8" : "#cf9d5f";
  el.style.fontSize = 12 + Math.random() * 14 + "px";
  petalsEl.appendChild(el);
}
