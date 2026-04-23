// =============================================
//  CONFIG — Edit these details! 💕
// =============================================
const CONFIG = {
  girlfriendName: "Sayang",
  senderName: "Amad Icad 💕",
  dateString: "2026-05-09T13:00:00",   // 9 May 2026, 1pm
  dateDisplay: "Saturday, 9th May 2026",
  timeDisplay: "12:00 PM",
  placeDisplay: "A Very Special Spot",
  dressDisplay: "u pakai apa apa pon cantik sayang💕",
  loveMessage: `Happy Birthday Sayang ❤️. Finally you are already 23 years old! Ingat sikit you tu dah tua AHAHAHAHAHAH even
          muka you nampak muda, gurau je tau you 👉🏻👈🏻. You still cantik,lawa,cumel semualah di mata i. Macam yang you dah tau, i dah lama minat kat you tauuu, so thank you sudi terima i🫶🏻. Actually bila you terima i haritu, i macam tak percaya tauuu, like aaaaaaaa, i rasa bahagia sangat sangat. Thank you for being the happiness of my life. I LOVE YOU SAYANGGG muahhhhh 😘`,
};

// =============================================
//  APPLY CONFIG
// =============================================
document.getElementById("girlfriendName").textContent = CONFIG.girlfriendName;
document.getElementById("senderName").textContent = CONFIG.senderName;
document.getElementById("dateValue").textContent = CONFIG.dateDisplay;
document.getElementById("timeValue").innerHTML = CONFIG.timeDisplay + `<br/><small>I gerak pukul 10 so maybe around 12 to 1</small>`;
document.getElementById("dressValue").innerHTML = CONFIG.dressDisplay + `<br/><small>i pakai navy blue shirt with white pants</small>`;
document.getElementById("placeValue").innerHTML = CONFIG.placeDisplay + `<br/><small>jeng jeng jeng rahsia 😊</small>`;
document.getElementById("loveMessage").textContent = CONFIG.loveMessage;

// =============================================
//  FLOATING PARTICLES
// =============================================
const EMOJIS = ["❤️", "🌸", "🌹", "💕", "✨", "🌷", "💖", "🥀"];

function spawnParticle() {
  const el = document.createElement("div");
  el.className = "particle";
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = (8 + Math.random() * 14) + "s";
  el.style.animationDelay = (Math.random() * 4) + "s";
  el.style.fontSize = (9 + Math.random() * 14) + "px";
  document.getElementById("particles").appendChild(el);
  setTimeout(() => el.remove(), 26000);
}

setInterval(spawnParticle, 700);
for (let i = 0; i < 10; i++) setTimeout(spawnParticle, i * 200);

// =============================================
//  MULTI-PAGE SLIDE ENGINE
// =============================================
const TOTAL_PAGES = 6;
let currentPage = 0;
let isAnimating = false;

const slides = Array.from(document.querySelectorAll(".slide"));
const navDots = Array.from(document.querySelectorAll(".nav-dot"));
const arrowPrev = document.getElementById("arrowPrev");
const arrowNext = document.getElementById("arrowNext");
const pageNav = document.getElementById("pageNav");

function goToPage(index, skipEnvelopeCheck) {
  if (index < 0 || index >= TOTAL_PAGES || isAnimating) return;

  // Don't allow skipping past envelope without opening it
  if (!skipEnvelopeCheck && currentPage === 0 && !envelopeOpened) return;

  isAnimating = true;

  slides.forEach((slide, i) => {
    slide.classList.remove("is-active", "is-above");
    if (i < index) slide.classList.add("is-above");
    if (i === index) slide.classList.add("is-active");
  });

  navDots.forEach((dot, i) => dot.classList.toggle("active", i === index));

  currentPage = index;
  updateNavVisibility();

  setTimeout(() => { isAnimating = false; }, 680);

  // Start countdown when on countdown page
  if (index === 4) startCountdown();
}

function updateNavVisibility() {
  const onEnvelope = currentPage === 0;
  // Hide ALL nav on envelope page
  pageNav.classList.toggle("hidden-nav", onEnvelope);
  arrowPrev.classList.toggle("hidden", onEnvelope || currentPage === 1);
  arrowNext.classList.toggle("hidden", onEnvelope || currentPage === TOTAL_PAGES - 1);
}

// Init — set first slide active, hide nav on envelope page
slides.forEach((slide, i) => {
  if (i === 0) slide.classList.add("is-active");
});
navDots[0].classList.add("active");
// Hide nav controls on envelope page
pageNav.classList.add("hidden-nav");
arrowPrev.classList.add("hidden");
arrowNext.classList.add("hidden");

// Nav dots
navDots.forEach(dot => {
  dot.addEventListener("click", () => {
    const target = parseInt(dot.dataset.page);
    if (target === 0 || envelopeOpened) goToPage(target, true);
  });
});

// Arrows
arrowPrev.addEventListener("click", () => goToPage(currentPage - 1, true));
arrowNext.addEventListener("click", () => goToPage(currentPage + 1));

// =============================================
//  KEYBOARD NAVIGATION
// =============================================
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowRight") goToPage(currentPage + 1);
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") goToPage(currentPage - 1, true);
});

// =============================================
//  TOUCH / SWIPE NAVIGATION
// =============================================
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  const dy = touchStartY - e.changedTouches[0].clientY;
  const dx = touchStartX - e.changedTouches[0].clientX;

  // Only trigger page turn on vertical swipe larger than horizontal
  if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx)) return;

  // Don't swipe if touching inside scrollable letter
  if (e.target.closest(".letter-paper")) return;

  if (dy > 0) goToPage(currentPage + 1);       // swipe up → next
  else goToPage(currentPage - 1, true);  // swipe down → prev
}, { passive: true });

// Mouse wheel
let wheelCooldown = false;
document.addEventListener("wheel", (e) => {
  if (wheelCooldown) return;
  wheelCooldown = true;
  setTimeout(() => { wheelCooldown = false; }, 800);
  if (e.deltaY > 0) goToPage(currentPage + 1);
  else goToPage(currentPage - 1, true);
}, { passive: true });

// =============================================
//  ENVELOPE OPEN
// =============================================
let envelopeOpened = false;
const envelope = document.getElementById("envelope");

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelope.classList.add("open");
  setTimeout(() => goToPage(1, true), 700);
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("touchend", (e) => {
  e.preventDefault();
  openEnvelope();
}, { passive: false });

// =============================================
//  COUNTDOWN TIMER
// =============================================
const targetDate = new Date(CONFIG.dateString);
let countdownInterval = null;

function startCountdown() {
  if (countdownInterval) return; // already running
  countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
}

function updateCountdown() {
  const diff = targetDate - new Date();

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML =
      `<div style="font-family:var(--ff-script);font-size:clamp(22px,6vw,32px);color:var(--gold-light)">🎉 Today is the day! 🎉</div>`;
    clearInterval(countdownInterval);
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = String(d).padStart(2, "0");
  document.getElementById("hours").textContent = String(h).padStart(2, "0");
  document.getElementById("minutes").textContent = String(m).padStart(2, "0");
  document.getElementById("seconds").textContent = String(s).padStart(2, "0");
}

// =============================================
//  RSVP — NO BUTTON
// =============================================
let noMoves = 0;
let mobileTaps = 0;
const btnNo = document.getElementById("btnNo");
const isMobile = () => window.matchMedia("(pointer: coarse)").matches;

const mobileNoLabels = [
  "ooo berani eh you? tekan aa lagi 😡",
  "WHATTT YOU TEKAN LAGI? NAK KENE CUBIT DIA NI",
  "sampai hati you💔, you tak sayang i ke?🥹",
  "Last warning tau ni, siap you nanti!",
  "wekkk you tetap kene setuju jugak"
];

// Desktop hover: button flies away
function runAway() {
  if (isMobile()) return;
  noMoves++;
  const maxX = window.innerWidth - btnNo.offsetWidth - 40;
  const maxY = window.innerHeight - btnNo.offsetHeight - 40;
  btnNo.style.position = "fixed";
  btnNo.style.left = Math.floor(Math.random() * maxX) + "px";
  btnNo.style.top = Math.floor(Math.random() * maxY) + "px";
  btnNo.style.zIndex = "999";
  btnNo.style.transition = "left 0.25s ease, top 0.25s ease";
  if (noMoves >= 5) btnNo.textContent = "Okay fine, I give up! 😂";
  else if (noMoves >= 3) btnNo.textContent = "Stop chasing me! 😅";
}

// Mobile tap: button shrinks
btnNo.addEventListener("touchstart", (e) => {
  if (!isMobile()) return;
  e.preventDefault();
  mobileTaps++;
  const scale = Math.max(0.4, 1 - mobileTaps * 0.15);
  btnNo.style.transform = `scale(${scale})`;
  btnNo.style.transition = "transform 0.2s ease, opacity 0.2s ease";
  btnNo.style.opacity = String(Math.max(0.3, 1 - mobileTaps * 0.14));
  if (mobileTaps < mobileNoLabels.length) {
    btnNo.textContent = mobileNoLabels[mobileTaps - 1];
  } else {
    btnNo.style.display = "none";
    document.getElementById("btnYes").click();
  }
}, { passive: false });

// =============================================
//  RSVP — YES / NO HANDLERS
// =============================================
function handleYes() {
  document.getElementById("rsvpButtons").style.display = "none";
  const resp = document.getElementById("rsvpResponse");
  resp.classList.remove("hidden");
  document.getElementById("responseEmoji").textContent = "🥰💕";
  document.getElementById("responseText").textContent =
    `Yayyyy!! I can't wait to see you, ${CONFIG.girlfriendName}!! 💖`;
  launchConfetti();
}

function handleNo() {
  btnNo.textContent = "...you sure?? 🥺";
  setTimeout(() => { btnNo.textContent = "Really sure? 😢"; }, 1500);
  setTimeout(() => {
    btnNo.style.display = "none";
    document.getElementById("btnYes").click();
  }, 3000);
}

// =============================================
//  CONFETTI BURST
// =============================================
function launchConfetti() {
  const area = document.getElementById("confettiArea");
  const colors = ["#c0396b", "#e8799b", "#c9a84c", "#e8cf8a", "#fff", "#ffc0cb", "#ff69b4"];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = Math.random() * 0.8 + "s";
      p.style.animationDuration = (1 + Math.random()) + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      area.appendChild(p);
      setTimeout(() => p.remove(), 3000);
    }, i * 40);
  }
}
