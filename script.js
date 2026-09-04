/* ============================================================
   PROJECT MOONLIGHT — script.js (consolidated)
   Sections: CONFIG -> AudioSystem -> Effects -> Games -> Gallery
             -> ParticleHeart -> MoonlightAtmosphere -> Main (boot)
   ============================================================ */

const CONFIG = {

  // --- Identity ---------------------------------------------------
  recipientName: "Nimatullah",
  recipientTitle: "Ancestor of the Guidance Moon",
  birthdayDateISO: "2026-08-11",     // used only for display, not enforced
  siteName: "Project Moonlight",

  // --- Global moonlight atmosphere (falling stars, shooting stars, moon glow) ---
  moonlight: {
    fallingStars: true,
    shootingStars: true,
    moonGlow: true,
    starDensityMobile: 60,
    starDensityDesktop: 110
  },

  // --- Unlock gate (Phase 4) ---------------------------------------
  unlock: {
    question: "What nickname did I secretly give you?",
    acceptedAnswers: ["ancestor of the guidance moon", "guidance moon", "the moon", "moon"]
  },

  // --- Memory Gallery captions (Phase 10) ---------------------------
  photos: [
    { file: "photo1.jpg", caption: "A beauty that speaks softly, shines naturally, and leaves a memory long after the moment is gone." },
    { file: "photo2.jpg", caption: "Beauty in a moment — graceful, radiant, and effortlessly unforgettable." }
  ],

  funnyMemories: [
    "During our lessons, she somehow had the confidence to answer questions like she had already seen the exam paper before. 😂",
    "Sometimes before I could even properly process a question, she had already understood it and was ready with an answer. At that point, I just had to respect the intelligence. 😂"
  ],

  meaningfulMemories: [
    "During our lessons together, she always answered questions bravely and confidently.",
    "She had this admirable ability to understand things quickly, even when others were still trying to figure them out.",
    "I remember noticing how beautifully she carried herself while working — focused, confident and quietly shining.",
    "One thing that stood out to me was how her intelligence and beauty seemed to arrive together. It was honestly an unfair combination. 😂✨"
  ],

  admire: [
    "Her beauty — effortlessly beautiful.",
    "Her bravery and confidence.",
    "Her intelligence.",
    "How quickly she understands things."
  ],

  insideJoke: "\u201CHave you finished understanding the question, or should the rest of us wait?\u201D 😂",

  guessingGame: [
    {
      question: "What was she unusually good at during our lessons?",
      options: ["Answering questions instantly", "Falling asleep in class", "Losing her notes"],
      correctIndex: 0,
      response: "Correct. Obviously. 😌"
    },
    {
      question: "Which best describes her energy?",
      options: ["Quietly confident", "Chaotic gremlin", "Allergic to effort"],
      correctIndex: 0,
      response: "The moon has competition. 🌙"
    }
  ],

  letter: `To nimatullah the one we called Ancestor of the Guidance Moon 🌙,

There are some people you meet and somehow, without doing anything extraordinary, they leave an impression.

You are one of those people.

I remember our lessons together and how confidently you answered questions. While some of us were still trying to understand what the question was asking, you somehow already had the answer. 😂

But beyond the intelligence, there was something else I noticed.

You have a beautiful way of carrying yourself brave, focused and quietly confident. And honestly, your beauty doesn't exactly make you easy to overlook either. 😌✨

You have this little light about you. Maybe that's why the name Ancestor of the Guidance Moon somehow felt appropriate. 🌙

I hope this new chapter brings you more reasons to smile, more achievements to celebrate, and more moments where you realize just how amazing you really are.

Keep learning. Keep growing. Keep being brave.

And most importantly.

Keep shining. ✨

Happy Birthday, beautiful soul. 🌙💜

From someone who is genuinely glad to have met you.`,

  finalMessage: `Your next chapter begins now. 🌙
May your intelligence keep opening doors, your courage keep taking you forward, and your beautiful smile keep making ordinary moments brighter.

Keep shining, Ancestor of the Guidance Moon. ✨

Happy Birthday. 💜`,

  secretEgg: `🌙 SECRET DISCOVERED

So you actually found this. 👀

I could have hidden another birthday message here, but then where would be the fun?

Here's the truth:

You're beautiful. You're intelligent. You're brave. And somehow you manage to make hard things look ridiculously easy.

Don't let anyone convince you otherwise.

Keep shining. The moon has competition now. 🌙✨`,

  terminal: {
    unlockCommand: "sudo reveal_moon",
    bootLines: [
      "> booting birthday_protocol...",
      "> loading memories........ OK",
      "> compiling compliments... OK",
      "> checking recipient...... [NAME]",
      "> status: EXTRAORDINARY",
      "> birthday_protocol.exe successfully deployed ❤"
    ],
    revealLines: [
      "ACCESS GRANTED...",
      "",
      "Identity detected: [NAME] 🌙",
      "",
      "Intelligence: ██████████ 100%",
      "Bravery:      ██████████ 100%",
      "Beauty:       ERROR — VALUE TOO HIGH",
      "Smile brightness: UNMEASURABLE",
      "",
      "Status: STILL SHINING ✨",
      "",
      "Final system message:",
      "\"Some people don't need the spotlight. They simply become the light.\""
    ]
  },

  media: {
    music: "music.mp3",
    voiceMessage: null // e.g. "voice.mp3" — leave null to skip Phase 11
  }
};

/* ============================================================
   AUDIO SYSTEM (Phase 11 + Phase 20)
   ============================================================ */

const AudioSystem = (() => {
  const music = document.getElementById('bg-music');
  const voice = document.getElementById('voice-audio');
  const toggleBtn = document.getElementById('audio-toggle');
  let musicOn = false;
  let musicReady = false;

  function initMusicSource() {
    if (CONFIG.media.music) {
      music.src = CONFIG.media.music;
      musicReady = true;
    }
  }

  function tryPlayMusic() {
    if (!musicReady) return;
    music.volume = 0.35;
    music.play().then(() => {
      musicOn = true;
      toggleBtn.textContent = '🔊';
    }).catch(() => {
      musicOn = false;
      toggleBtn.textContent = '🔇';
    });
  }

  function toggleMusic() {
    if (!musicReady) return;
    if (musicOn) {
      music.pause();
      musicOn = false;
      toggleBtn.textContent = '🔇';
    } else {
      tryPlayMusic();
    }
  }

  function playVoice(onEnd) {
    if (!CONFIG.media.voiceMessage) {
      if (onEnd) setTimeout(onEnd, 600);
      return;
    }
    voice.src = CONFIG.media.voiceMessage;
    voice.currentTime = 0;
    voice.play().catch(() => {});
    if (onEnd) voice.onended = onEnd;
  }

  function init() {
    initMusicSource();
    toggleBtn.addEventListener('click', toggleMusic);
    toggleBtn.style.opacity = musicReady ? '1' : '0.4';
  }

  function primeOnFirstInteraction() {tryPlayMusic();
  }

  return { init, toggleMusic, playVoice, primeOnFirstInteraction, get isVoiceConfigured() { return !!CONFIG.media.voiceMessage; } };
})();

/* ============================================================
   EFFECTS — starfield, confetti, fireworks
   Lightweight 2D canvas particle helpers shared across screens.
   ============================================================ */

const Effects = (() => {

  function sizeCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  // ---------------- Starfield (ambient, Phase 3 / Phase 16) ----------------
  function startStarfield(canvas, { density = 90, drift = true } = {}) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    let ctx = sizeCanvas(canvas);
    let stars = [];
    let running = true;

    function build() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const count = Math.round((w * h) / 9000 * (density / 90));
      stars = Array.from({ length: Math.max(count, 30) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        tw: Math.random() * 0.02 + 0.005,
        vy: drift ? Math.random() * 0.05 + 0.01 : 0
      }));
    }

    function frame() {
      if (!running) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.a += s.tw * (Math.random() > 0.5 ? 1 : -1);
        s.a = Math.max(0.1, Math.min(1, s.a));
        s.y += s.vy;
        if (s.y > h) s.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(232,204,133,${s.a * 0.8})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    build();
    frame();
    window.addEventListener('resize', () => { ctx = sizeCanvas(canvas); build(); });
    return { stop: () => { running = false; } };
  }

  // ---------------- Confetti (Phase 17) ----------------
  function burstConfetti(canvas, durationMs = 3200) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const ctx = sizeCanvas(canvas);
    const colors = ['#c9a24d', '#e8cc85', '#5b2f8c', '#f2ecf9'];
    const w = canvas.clientWidth, h = canvas.clientHeight;
    let pieces = Array.from({ length: 430 }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 1.6,
      vy: Math.random() * 2 + 2,
      size: Math.random() * 6 + 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    const start = performance.now();
    function frame(t) {
      const elapsed = t - start;
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (elapsed < durationMs) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    }
    requestAnimationFrame(frame);
  }

  // ---------------- Fireworks (Phase 17) ----------------
  function startFireworks(canvas, durationMs = 6000) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    const ctx = sizeCanvas(canvas);
    const colors = ['#c9a24d', '#e8cc85', '#5b2f8c', '#f2ecf9', '#8a5fc4'];
    const w = () => canvas.clientWidth, h = () => canvas.clientHeight;
    let particles = [];
    const start = performance.now();

    function explode() {
      const cx = Math.random() * w() * 0.7 + w() * 0.15;
      const cy = Math.random() * h() * 0.5 + h() * 0.1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 34;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 2.4 + 1.2;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.012 + 0.012,
          color
        });
      }
    }

    let lastBurst = 0;
    function frame(t) {
      const elapsed = t - start;
      if (t - lastBurst > 550 && elapsed < durationMs * 0.75) { explode(); lastBurst = t; }
      ctx.fillStyle = 'rgba(5,3,8,0.22)';
      ctx.fillRect(0, 0, w(), h());
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      particles = particles.filter(p => p.life > 0);
      if (elapsed < durationMs) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w(), h());
    }
    requestAnimationFrame(frame);
  }

  return { startStarfield, burstConfetti, startFireworks };
})();

/* ============================================================
   MINI-GAMES (Phases 6–9)
   Each init function mounts into DOM already present in index.html
   and calls onWin() once, when the player succeeds.
   ============================================================ */

const Games = (() => {

  // -------- Phase 6: Find the Heart --------
  function initHeartGame(onWin) {
    const area = document.getElementById('heart-game-area');
    const feedback = document.getElementById('heart-feedback');
    const decoys = ['✨', '⭐', '🌙', '💫', '🔮', '🪐', '☁️', '🕯️'];
    area.innerHTML = '';
    feedback.textContent = '';
    const total = 14;
    const heartIndex = Math.floor(Math.random() * total);

    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'floating-item' + (i === heartIndex ? ' heart-target' : '');
      btn.textContent = i === heartIndex ? '💜' : decoys[Math.floor(Math.random() * decoys.length)];
      const top = Math.random() * 82 + 4;
      const left = Math.random() * 86 + 2;
      btn.style.top = top + '%';
      btn.style.left = left + '%';
      btn.style.animation = `floatItem ${3 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite alternate`;
      btn.addEventListener('click', () => {
        if (i === heartIndex) {
          feedback.textContent = 'Found it. Of course you did. 💜';
          area.querySelectorAll('.floating-item').forEach(b => b.disabled = true);
          document.getElementById('heart-continue').classList.remove('hidden');
          onWin();
        } else {
          btn.style.opacity = '0.15';
          feedback.textContent = 'Not that one — keep looking.';
        }
      });
      area.appendChild(btn);
    }

    if (!document.getElementById('float-keyframes')) {
      const style = document.createElement('style');
      style.id = 'float-keyframes';
      style.textContent = `@keyframes floatItem { from { transform: translateY(0px); } to { transform: translateY(-14px); } }`;
      document.head.appendChild(style);
    }
  }

  // -------- Phase 7: Catch the Button --------
  function initCatchGame(onWin) {
    const area = document.getElementById('catch-game-area');
    const btn = document.getElementById('catch-button');
    const feedback = document.getElementById('catch-feedback');
    feedback.textContent = '';
    let escapes = 4;
    btn.style.top = '45%';
    btn.style.left = '35%';
    btn.textContent = 'Click me';
    btn.onclick = null;

    function reposition() {
      const areaRect = area.getBoundingClientRect();
      const maxTop = Math.max(areaRect.height - 60, 10);
      const maxLeft = Math.max(areaRect.width - 130, 10);
      const top = Math.random() * maxTop;
      const left = Math.random() * maxLeft;
      btn.style.top = top + 'px';
      btn.style.left = left + 'px';
    }

    function dodge(e) {
      if (escapes > 0) {
        e.preventDefault();
        escapes -= 1;
        reposition();
        feedback.textContent = escapes > 1 ? 'Too slow. 😏' : 'Almost...';
      }
    }

    btn.addEventListener('pointerenter', dodge);
    btn.addEventListener('touchstart', dodge, { passive: false });
    btn.addEventListener('click', () => {
      if (escapes > 0) { dodge({ preventDefault() {} }); return; }
      feedback.textContent = 'Okay fine, you win. 🎉';
      btn.disabled = true;
      document.getElementById('catch-continue').classList.remove('hidden');
      onWin();
    });

    reposition();
  }

  // -------- Phase 8: Memory Match --------
  function initMatchGame(onWin) {
    const grid = document.getElementById('match-grid');
    const feedback = document.getElementById('match-feedback');
    feedback.textContent = '';
    const symbols = ['🌙', '💜', '✨', '🔮'];
    let deck = [...symbols, ...symbols]
      .map(s => ({ s, id: Math.random() }))
      .sort(() => Math.random() - 0.5);

    grid.innerHTML = '';
    let flipped = [];
    let matched = 0;
    let lock = false;

    deck.forEach((card, idx) => {
      const el = document.createElement('button');
      el.className = 'memory-card';
      el.dataset.symbol = card.s;
      el.dataset.idx = idx;
      el.textContent = '';
      el.addEventListener('click', () => {
        if (lock || el.classList.contains('flipped') || el.classList.contains('matched')) return;
        el.textContent = card.s;
        el.classList.add('flipped');
        flipped.push(el);
        if (flipped.length === 2) {
          lock = true;
          const [a, b] = flipped;
          if (a.dataset.symbol === b.dataset.symbol) {
            a.classList.add('matched'); b.classList.add('matched');
            matched += 1;
            flipped = []; lock = false;
            if (matched === symbols.length) {
              feedback.textContent = 'All matched. Sharp as ever. 💜';
              document.getElementById('match-continue').classList.remove('hidden');
              onWin();
            }
          } else {
            setTimeout(() => {
              a.textContent = ''; b.textContent = '';
              a.classList.remove('flipped'); b.classList.remove('flipped');
              flipped = []; lock = false;
            }, 650);
          }
        }
      });
      grid.appendChild(el);
    });
  }

  // -------- Phase 9: Guessing Game --------
  function initGuessGame(onWin) {
    const qEl = document.getElementById('guess-question');
    const optsEl = document.getElementById('guess-options');
    const feedback = document.getElementById('guess-feedback');
    const continueBtn = document.getElementById('guess-continue');
    continueBtn.classList.add('hidden');
    let step = 0;

    function render() {
      const q = CONFIG.guessingGame[step];
      feedback.textContent = '';
      qEl.textContent = q.question;
      optsEl.innerHTML = '';
      q.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'btn-ghost';
        b.textContent = opt;
        b.addEventListener('click', () => {
          optsEl.querySelectorAll('button').forEach(x => x.disabled = true);
          if (i === q.correctIndex) {
            feedback.textContent = q.response;
          } else {
            feedback.textContent = "Nice try — but she'd know that answer instantly.";
          }
          step += 1;
          setTimeout(() => {
            if (step < CONFIG.guessingGame.length) render();
            else {
              qEl.textContent = "That's everyone's answer key checked. 💜";
              optsEl.innerHTML = '';
              continueBtn.classList.remove('hidden');
              onWin();
            }
          }, 1100);
        });
        optsEl.appendChild(b);
      });
    }
    render();
  }

  return { initHeartGame, initCatchGame, initMatchGame, initGuessGame };
})();

/* ============================================================
   GALLERY (Phase 10)
   Tap-through photo cards with captions. Gracefully shows a
   placeholder if a photo file hasn't been added yet, so the
   experience never breaks on missing assets.
   ============================================================ */

const Gallery = (() => {
  let index = 0;
  function render() {
    const viewport = document.getElementById('gallery-viewport');
    const photos = CONFIG.photos;
    if (!photos.length) {
      viewport.innerHTML = '<div class="gallery-photo-missing">No photos configured yet — add them in the CONFIG block at the top of script.js</div>';
      return;
    }
    const item = photos[index];
    viewport.innerHTML = `
      <img class="gallery-photo active" src="${item.file}" alt="${item.caption}"
           onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'gallery-photo-missing',textContent:'${item.file} not found'}))" />
      <div class="gallery-caption-bar">
        <div class="gallery-caption">${item.caption}</div>
        <div class="gallery-counter">${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}</div>
      </div>`;
  }

  function next() {
    if (!CONFIG.photos.length) return;
    index = (index + 1) % CONFIG.photos.length;
    render();
  }

  function prev() {
    if (!CONFIG.photos.length) return;
    index = (index - 1 + CONFIG.photos.length) % CONFIG.photos.length;
    render();
  }

  function init() {
    index = 0;
    render();
    document.getElementById('gallery-next').onclick = next;
    document.getElementById('gallery-prev').onclick = prev;
  }

  return { init };
})();

/* ============================================================
   PARTICLE HEART (Phase 15 — major feature, Phase 16 — transition)
   Built from programmatic heart-shaped coordinates (not a video),
   so it's a real interactive 3D element. Particle count adapts to
   device capability. Falls back to a simple CSS heart if WebGL is
   unavailable (Phase 22) so the rest of the experience still works.
   ============================================================ */

const ParticleHeart = (() => {

  function heartPoint(t, r) {
    // Classic parametric heart curve, scaled, with radial fill for volume.
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: x * r * 0.09, y: y * r * 0.09 };
  }

  function deviceParticleBudget() {
    const cores = navigator.hardwareConcurrency || 4;
    const w = window.innerWidth;
    if (cores <= 4 || w < 420) return 1800;
    if (cores <= 6 || w < 900) return 3200;
    return 5200;
  }

  function supportsWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  function runFallback(container, name, onComplete) {
    container.innerHTML = `
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
        <div style="font-size:min(30vw,220px);animation:pulseHeart 1.6s ease-in-out infinite;">💜</div>
      </div>
      <style>@keyframes pulseHeart{0%,100%{transform:scale(1);opacity:0.85}50%{transform:scale(1.12);opacity:1}}</style>`;
    setTimeout(() => onComplete && onComplete(), 3200);
  }

  function run(container, { name = '', onComplete } = {}) {
    if (!supportsWebGL() || typeof THREE === 'undefined') {
      runFallback(container, name, onComplete);
      return;
    }

    let width = container.clientWidth, height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 22;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      runFallback(container, name, onComplete);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const count = deviceParticleBudget();
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const goldColor = new THREE.Color('#e8cc85');
    const violetColor = new THREE.Color('#8a5fc4');

    for (let i = 0; i < count; i++) {
      // Scattered start position (sphere cloud).
      const radius = 14 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Target heart position.
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      const p = heartPoint(t, r);
      targets[i * 3] = p.x;
      targets[i * 3 + 1] = p.y;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 2.2;

      const c = Math.random() > 0.55 ? goldColor : violetColor;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let phase = 'forming'; // forming -> holding -> bursting
    let phaseStart = performance.now();
    const posAttr = geometry.attributes.position;

    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

    function animate(t) {
      const elapsed = t - phaseStart;

      if (phase === 'forming') {
        const progress = Math.min(elapsed / 2600, 1);
        const eased = easeOutCubic(progress);
        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          posAttr.array[ix] += (targets[ix] - posAttr.array[ix]) * eased * 0.06;
          posAttr.array[ix + 1] += (targets[ix + 1] - posAttr.array[ix + 1]) * eased * 0.06;
          posAttr.array[ix + 2] += (targets[ix + 2] - posAttr.array[ix + 2]) * eased * 0.06;
        }
        points.rotation.y += 0.004;
        if (progress >= 1) { phase = 'holding'; phaseStart = t; }
      } else if (phase === 'holding') {
        points.rotation.y += 0.006;
        const pulse = 1 + Math.sin(elapsed / 400) * 0.02;
        points.scale.set(pulse, pulse, pulse);
        if (elapsed > 2600) {
          if (name) {
            const nameEl = document.getElementById('heart-name-reveal');
            if (nameEl) { nameEl.textContent = name; nameEl.classList.remove('hidden'); nameEl.classList.add('fade-in'); }
          }
        }
        if (elapsed > 4200) { phase = 'bursting'; phaseStart = t; }
      } else if (phase === 'bursting') {
        // Final love-particle explosion: the heart first reaches its complete
        // form, then every particle is thrown outward from the heart center.
        const progress = Math.min(elapsed / 2100, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          const dx = targets[ix], dy = targets[ix + 1], dz = targets[ix + 2];
          const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          const burst = 0.018 + eased * 0.95;
          posAttr.array[ix] += (dx / len) * burst;
          posAttr.array[ix + 1] += (dy / len) * burst;
          posAttr.array[ix + 2] += (dz / len) * burst;
        }
        // Bright at the beginning, then dissolve as the particles fly away.
        material.opacity = 0.98 * (1 - Math.pow(progress, 1.35));
        points.rotation.y += 0.014;
        points.scale.set(
          1 + eased * 0.16,
          1 + eased * 0.16,
          1 + eased * 0.16
        );
        if (progress >= 1) {
          renderer.dispose();
          if (onComplete) onComplete();
          return;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      width = container.clientWidth; height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }

  return { run };
})();

/* ============================================================
   MOONLIGHT ATMOSPHERE — Phase upgrade: persistent global falling
   stars + occasional shooting stars, shared across every screen
   instead of a landing-only starfield. One canvas pair, one loop.
   ============================================================ */

const MoonlightAtmosphere = (() => {
  let starCanvas, starCtx, shootCanvas, shootCtx;
  let stars = [];
  let shootingStars = [];
  let running = true;
  let reduced = false;
  let lastShootTime = 0;
  let nextShootDelay = 9000;

  function sizeCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function buildStars() {
    const isMobile = window.innerWidth < 700;
    const density = isMobile
      ? (CONFIG.moonlight?.starDensityMobile ?? 60)
      : (CONFIG.moonlight?.starDensityDesktop ?? 110);
    const dimGlyphs = ['✨', '·', '·']; // mostly tiny sparkles, some plain pinpoints for depth
    const brightGlyphs = ['⭐', '💫'];
    stars = Array.from({ length: density }, () => {
      const bright = Math.random() < 0.15;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: bright ? (Math.random() * 8 + 13) : (Math.random() * 6 + 7),
        glyph: bright
          ? brightGlyphs[Math.floor(Math.random() * brightGlyphs.length)]
          : dimGlyphs[Math.floor(Math.random() * dimGlyphs.length)],
        speed: bright ? (Math.random() * 0.35 + 0.25) : (Math.random() * 0.18 + 0.05),
        drift: (Math.random() - 0.5) * 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        alpha: Math.random() * 0.6 + 0.3,
        twinkle: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
        type: bright ? 'bright' : 'star'
      };
    });
  }

  function drawStars() {
    if (!running || !CONFIG.moonlight?.fallingStars) { requestAnimationFrame(drawStars); return; }
    const w = window.innerWidth, h = window.innerHeight;
    const speedMul = reduced ? 0.15 : 1;
    starCtx.clearRect(0, 0, w, h);
    starCtx.textAlign = 'center';
    starCtx.textBaseline = 'middle';
    for (const s of stars) {
      s.phase += s.twinkle;
      s.rotation += s.rotSpeed;
      const a = s.alpha * (0.65 + 0.35 * Math.sin(s.phase));
      s.y += s.speed * speedMul;
      s.x += s.drift * speedMul;
      if (s.y > h + 20) { s.y = -20; s.x = Math.random() * w; }
      if (s.x > w + 20) s.x = -20;
      if (s.x < -20) s.x = w + 20;

      starCtx.save();
      starCtx.globalAlpha = a;
      starCtx.font = `${s.size}px sans-serif`;
      if (s.glyph === '·') {
        starCtx.fillStyle = 'rgba(242,236,249,0.85)';
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.size * 0.09, 0, Math.PI * 2);
        starCtx.fill();
      } else {
        starCtx.translate(s.x, s.y);
        starCtx.rotate(s.rotation);
        starCtx.fillText(s.glyph, 0, 0);
      }
      starCtx.restore();
    }
    requestAnimationFrame(drawStars);
  }

  function spawnShootingStar() {
    const w = window.innerWidth, h = window.innerHeight;
    const startX = Math.random() * w * 0.6 + w * 0.2;
    const startY = Math.random() * h * 0.25;
    const len = Math.random() * 5 + 5;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    shootingStars.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * len,
      vy: Math.sin(angle) * len,
      life: 1,
      decay: 1 / (Math.random() * 22 + 40) // ~700-1200ms at 60fps
    });
  }

  function drawShooting(t) {
    if (!running || !CONFIG.moonlight?.shootingStars) { requestAnimationFrame(drawShooting); return; }
    const w = window.innerWidth, h = window.innerHeight;
    shootCtx.clearRect(0, 0, w, h);
    if (!reduced && shootingStars.length < 2 && t - lastShootTime > nextShootDelay) {
      spawnShootingStar();
      lastShootTime = t;
      nextShootDelay = Math.random() * 10000 + 8000; // 8-18s
    }
    for (const s of shootingStars) {
      s.x += s.vx; s.y += s.vy; s.life -= s.decay;
      shootCtx.strokeStyle = `rgba(232,204,133,${Math.max(s.life, 0)})`;
      shootCtx.lineWidth = 1.6;
      shootCtx.beginPath();
      shootCtx.moveTo(s.x, s.y);
      shootCtx.lineTo(s.x - s.vx * 5, s.y - s.vy * 5);
      shootCtx.stroke();
    }
    shootingStars = shootingStars.filter(s => s.life > 0);
    requestAnimationFrame(drawShooting);
  }

  function init() {
    starCanvas = document.getElementById('falling-stars');
    shootCanvas = document.getElementById('shooting-stars');
    if (!starCanvas || !shootCanvas) return;
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    starCtx = sizeCanvas(starCanvas);
    shootCtx = sizeCanvas(shootCanvas);
    buildStars();
    requestAnimationFrame(drawStars);
    requestAnimationFrame(drawShooting);

    window.addEventListener('resize', () => {
      starCtx = sizeCanvas(starCanvas);
      shootCtx = sizeCanvas(shootCanvas);
      buildStars();
    });
    document.addEventListener('visibilitychange', () => {
      running = document.visibilityState === 'visible';
    });
  }
  return { init };
})();

/* ============================================================
   MAIN — orchestrates the whole experience end to end.
   ============================================================ */

(() => {
  const displayName = () => (CONFIG.recipientName && CONFIG.recipientName.trim()) || CONFIG.recipientTitle;

  // ---------------- Screen navigation ----------------
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      if (s.id === id) {
        s.classList.remove('hidden');
        s.classList.remove('fade-out');
        s.classList.add('fade-in');
      } else if (!s.classList.contains('hidden')) {
        s.classList.add('fade-out');
        setTimeout(() => s.classList.add('hidden'), 850);
      }
    });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  // ---------------- Hub state ----------------
  const hubItems = [
    { id: 'heart', label: 'Challenge: Find the Heart', screen: 'game-heart' },
    { id: 'catch', label: 'Challenge: Catch the Button', screen: 'game-catch' },
    { id: 'match', label: 'Challenge: Memory Match', screen: 'game-match' },
    { id: 'guess', label: 'Challenge: About You', screen: 'game-guess' },
    { id: 'gallery', label: 'Memory Gallery', screen: 'gallery' },
    { id: 'admire', label: 'Things I Admire', screen: 'admire' }
  ];
  const completed = new Set();

  function renderHub() {
    const grid = document.getElementById('hub-grid');
    grid.innerHTML = '';
    hubItems.forEach(item => {
      const card = document.createElement('button');
      const isDone = completed.has(item.id);
      card.className = 'hub-card tap' + (isDone ? ' complete' : '');
      card.innerHTML = `<span class="label">${item.label}</span><span class="status">${isDone ? 'DONE' : 'OPEN'}</span>`;
      card.addEventListener('click', () => openSection(item));
      grid.appendChild(card);
    });

    const finalCard = document.createElement('button');
    const allDone = completed.size === hubItems.length;
    finalCard.className = 'hub-card tap' + (allDone ? '' : ' locked');
    finalCard.innerHTML = `<span class="label">✦ Final Reveal</span><span class="status">${allDone ? 'UNLOCKED' : 'LOCKED'}</span>`;
    if (allDone) finalCard.addEventListener('click', beginFinalSequence);
    grid.appendChild(finalCard);

    document.getElementById('hub-progress').textContent =
      `${completed.size} / ${hubItems.length} UNLOCKED`;
    const fillEl = document.getElementById('hub-progress-fill');
    if (fillEl) fillEl.style.width = `${(completed.size / hubItems.length) * 100}%`;
  }

  function markComplete(id) {
    completed.add(id);
  }

  function openSection(item) {
    showScreen(item.screen);
    switch (item.id) {
      case 'heart': Games.initHeartGame(() => markComplete('heart')); break;
      case 'catch': Games.initCatchGame(() => markComplete('catch')); break;
      case 'match': Games.initMatchGame(() => markComplete('match')); break;
      case 'guess': Games.initGuessGame(() => markComplete('guess')); break;
      case 'gallery': Gallery.init(); break;
      case 'admire': initAdmireScreen(); break;
    }
  }

  // Return-to-hub wiring for the simple "Continue" buttons.
  function goHub() { renderHub(); showScreen('hub'); }
  document.getElementById('heart-continue').addEventListener('click', goHub);
  document.getElementById('catch-continue').addEventListener('click', goHub);
  document.getElementById('match-continue').addEventListener('click', goHub);
  document.getElementById('guess-continue').addEventListener('click', goHub);
  document.getElementById('gallery-done').addEventListener('click', () => { markComplete('gallery'); goHub(); });

  // ---------------- Admire screen ----------------
  function initAdmireScreen() {
    const textEl = document.getElementById('admire-text');
    const counterEl = document.getElementById('admire-counter');
    const nextBtn = document.getElementById('admire-next');
    let i = 0;
    function render() {
      textEl.textContent = CONFIG.admire[i];
      counterEl.textContent = `${i + 1} / ${CONFIG.admire.length}`;
      nextBtn.textContent = i === CONFIG.admire.length - 1 ? 'Continue' : 'Next';
    }
    render();
    nextBtn.onclick = () => {
      if (i < CONFIG.admire.length - 1) { i += 1; render(); }
      else { markComplete('admire'); goHub(); }
    };
  }

  // ---------------- Letter (Phase 13) — part of the final sequence ----------------
  function playLetter(onDone) {
    showScreen('letter');
    const textEl = document.getElementById('letter-text');
    const continueBtn = document.getElementById('letter-continue');
    continueBtn.classList.add('hidden');
    textEl.textContent = '';
    const full = CONFIG.letter;
    let i = 0;
    const speed = 16; // ms per character
    const cursor = document.createElement('span');
    cursor.className = 'letter-cursor';
    cursor.textContent = ' ';

    function type() {
      if (i <= full.length) {
        textEl.textContent = full.slice(0, i);
        textEl.appendChild(cursor);
        i += 2;
        setTimeout(type, speed);
      } else {
        cursor.remove();
        continueBtn.classList.remove('hidden');
      }
    }
    type();
    continueBtn.onclick = onDone;
  }

  // ---------------- Terminal (Phase 14) ----------------
  function playTerminal(onDone) {
    showScreen('terminal-screen');
    const body = document.getElementById('terminal-body');
    const input = document.getElementById('terminal-input');
    body.textContent = '';
    input.value = '';
    input.disabled = false;

    const bootLines = CONFIG.terminal.bootLines.map(l => l.replace('[NAME]', displayName()));
    let li = 0;
    function printBoot() {
      if (li < bootLines.length) {
        body.textContent += (li === 0 ? '' : '\n') + bootLines[li];
        li += 1;
        setTimeout(printBoot, 420);
      } else {
        body.textContent += '\n\nType a command to continue:';
        input.focus();
      }
    }
    printBoot();

    input.onkeydown = (e) => {
      if (e.key !== 'Enter') return;
      const cmd = input.value.trim();
      body.textContent += `\n$ ${cmd}`;
      input.value = '';
      if (cmd.toLowerCase() === CONFIG.terminal.unlockCommand.toLowerCase()) {
        input.disabled = true;
        const revealLines = CONFIG.terminal.revealLines.map(l => l.replace('[NAME]', displayName()));
        let ri = 0;
        function printReveal() {
          if (ri < revealLines.length) {
            body.textContent += '\n' + revealLines[ri];
            body.scrollTop = body.scrollHeight;
            ri += 1;
            setTimeout(printReveal, 380);
          } else {
            setTimeout(onDone, 1400);
          }
        }
        printReveal();
      } else {
        body.textContent += '\ncommand not recognized. try again.';
      }
      body.scrollTop = body.scrollHeight;
    };

    // Mobile-friendly fallback: tap the terminal body to auto-fill the command
    // after a few seconds, in case typing an exact command is frustrating on phone.
    let tapHint = setTimeout(() => {
      if (!input.disabled) body.textContent += `\n\n(hint: try "${CONFIG.terminal.unlockCommand}")`;
    }, 6000);
  }

  // ---------------- Grand finale sequence ----------------
  function playHeartScene(onDone) {
    showScreen('heart-scene');
    document.getElementById('heart-name-reveal').classList.add('hidden');
    const wrap = document.getElementById('heart-canvas-wrap');
    wrap.innerHTML = '';
    ParticleHeart.run(wrap, { name: displayName(), onComplete: onDone });
  }

  function resetFinale() {
    finaleStarted = false;
    const content = document.getElementById('finale-content');
    const hint = document.getElementById('finale-hint');
    const canvas = document.getElementById('finale-canvas');
    const photos = document.getElementById('finale-photos');
    [document.getElementById('finale-happy'),document.getElementById('finale-name-gold'),document.getElementById('finale-subtitle'),document.getElementById('finale-title')].forEach(el=>el&&el.classList.remove('show'));
    content?.classList.remove('show');
    document.getElementById('finale-message')?.classList.remove('show');
    photos?.classList.remove('show');
    hint?.classList.remove('hide');
    if(canvas){ const c=canvas.getContext('2d'); c.clearRect(0,0,canvas.width,canvas.height); }
  }

  function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;
    const canvas=document.getElementById('finale-canvas'), ctx=canvas.getContext('2d');
    const content=document.getElementById('finale-content'), hint=document.getElementById('finale-hint');
    const happy=document.getElementById('finale-happy'), name=document.getElementById('finale-name-gold');
    const subtitle=document.getElementById('finale-subtitle'), title=document.getElementById('finale-title');
    const message=document.getElementById('finale-message'), photos=document.getElementById('finale-photos');
    [happy,name,subtitle,title].forEach(el=>el.classList.remove('show')); message.classList.remove('show'); photos.classList.remove('show');
    const cores=navigator.hardwareConcurrency||4;
    const lowPower = matchMedia('(pointer:coarse)').matches || innerWidth<760 || cores<=4;
    const dpr=Math.min(devicePixelRatio||1,lowPower?1.5:2), resize=()=>{canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
    resize(); finaleResizeHandler=resize; addEventListener('resize',resize);
    const W=()=>innerWidth,H=()=>innerHeight;
    const heart=t=>({x:16*Math.sin(t)**3,y:13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)});
    const count=W()<480||cores<=4?2200:W()<900||cores<=6?4200:6500;
    const particles=[], fireworks=[], confetti=[];
    const sc=()=>W()<600?.0135:.017;
    for(let i=0;i<count;i++){
      const t=Math.random()*Math.PI*2, p=heart(t), fill=Math.sqrt(Math.random()), r=.15+fill*1.15;
      particles.push({x:Math.random()*W(),y:H()+Math.random()*H(),tx:W()/2+p.x*r*W()*sc(),ty:H()/2-p.y*r*W()*sc(),vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*.5,size:.6+Math.random()*2.8,phase:Math.random()*6.28});
    }
    function fire(x,y,n=300,power=9){const b=[];const nn=lowPower?Math.round(n*.55):n;for(let i=0;i<nn;i++){const a=Math.random()*6.283,s=1.2+Math.random()*power;b.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0,max:65+Math.random()*125,r:.7+Math.random()*3});}fireworks.push(b)}
    // Confetti: gravity, alternating gold/bronze color every 3rd piece, same
    // size/speed ranges — fired as several bursts through the sequence.
    function confettiBlast(n=260,x=W()/2,y=H()*.47){const nn=lowPower?Math.round(n*.6):n;for(let i=0;i<nn;i++){const a=Math.random()*6.283,s=2+Math.random()*9;confetti.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,life:0,max:130+Math.random()*100,w:3+Math.random()*5,h:5+Math.random()*9,rot:Math.random()*6.28,spin:(Math.random()-.5)*.25})}}
    let frame=0;
    function loop(){
      frame++; ctx.clearRect(0,0,W(),H());
      const g=ctx.createRadialGradient(W()/2,H()*.48,5,W()/2,H()*.48,Math.max(W(),H())*.78);g.addColorStop(0,'rgba(243,221,169,.34)');g.addColorStop(.13,'rgba(215,181,110,.18)');g.addColorStop(.42,'rgba(80,60,25,.08)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W(),H());
      ctx.fillStyle='#f3dda9';ctx.shadowColor='#d7b56e';ctx.shadowBlur=lowPower?0:18;
      particles.forEach(p=>{if(frame<260){const e=1-Math.pow(1-frame/260,3);p.x+=(p.tx-p.x)*(.018+e*.06);p.y+=(p.ty-p.y)*(.018+e*.06)}else if(frame<470){const pulse=1+Math.sin(frame/11+p.phase)*.025;p.x+=(W()/2+(p.tx-W()/2)*pulse-p.x)*.028;p.y+=(H()/2+(p.ty-H()/2)*pulse-p.y)*.028}else{if(!p.burst){const dx=p.tx-W()/2,dy=p.ty-H()/2,dist=Math.hypot(dx,dy)||1,speed=3.5+Math.random()*7;p.vx=(dx/dist)*speed+(Math.random()-.5)*2;p.vy=(dy/dist)*speed+(Math.random()-.5)*2-2.5;p.burst=true}p.vy+=.028;p.x+=p.vx;p.y+=p.vy}ctx.globalAlpha=frame<470?.9:Math.max(0,1-(frame-470)/230);ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,6.283);ctx.fill()});
      if(frame===1)fire(W()*.12,H()*.25,260,8);
      if(frame===25)fire(W()*.88,H()*.22,260,8);
      if(frame===55)fire(W()*.5,H()*.12,320,10);
      if(frame===90)fire(W()*.22,H()*.18,240,8);
      if(frame===120)fire(W()*.78,H()*.16,240,8);
      if(frame===260){hint.classList.add('hide');confettiBlast();fire(W()*.12,H()*.3,360,10);fire(W()*.88,H()*.3,360,10);fire(W()*.5,H()*.14,450,11);fire(W()*.5,H()*.5,360,9);}
      if(frame===510)confettiBlast(260,W()*.22,H()*.3);
      if(frame===610)confettiBlast(260,W()*.78,H()*.3);
      if(frame===735)confettiBlast(300,W()/2,H()*.4);
      if(frame>290&&frame<1250&&frame%(lowPower?42:28)===0)fire(W()*(.04+Math.random()*.92),H()*(.04+Math.random()*.58),lowPower?110:180,7.5);
      ctx.fillStyle='#f3dda9';ctx.shadowColor='#d7b56e';ctx.shadowBlur=lowPower?0:12;
      fireworks.forEach(b=>b.forEach(p=>{p.life++;p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy=p.vy*.985+.035;ctx.globalAlpha=Math.max(0,1-p.life/p.max);ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill()}));
      ctx.shadowBlur=0;
      confetti.forEach(p=>{p.life++;p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.rot+=p.spin;ctx.save();ctx.globalAlpha=Math.max(0,1-p.life/p.max);ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=(p.life%3===0)?'#f3dda9':'#d7b56e';ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()});
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      if(frame===300){content.classList.add('show');happy.classList.add('show')}
      if(frame===365)name.classList.add('show');
      if(frame===435)subtitle.classList.add('show');
      if(frame===510)title.classList.add('show');
      if(frame===610){message.textContent=CONFIG.finalMessage;message.classList.add('show')}
      if(frame===735)photos.classList.add('show');
      if(frame<1900)finaleRAF=requestAnimationFrame(loop);
    }
    loop();
  }

  function playFinale() {
    resetFinale();
    showScreen('finale');
    startFinale();
  }

  function beginFinalSequence() {
    playLetter(() => {
      playTerminal(() => {
        playHeartScene(() => {
          playFinale();
        });
      });
    });
  }

  document.getElementById('replay-btn').addEventListener('click', () => {
    window.location.reload();
  });

  // ---------------- Secret Easter egg (Phase 19) ----------------
  (function initSecretEgg() {
    const trigger = document.getElementById('secret-trigger');
    const modal = document.getElementById('secret-modal');
    const textEl = document.getElementById('secret-text');
    let taps = 0;
    trigger.addEventListener('click', () => {
      taps += 1;
      if (taps >= 5) {
        textEl.textContent = CONFIG.secretEgg;
        modal.classList.remove('hidden');
        taps = 0;
      }
    });
    modal.addEventListener('click', () => modal.classList.add('hidden'));
  })();

  // ---------------- Unlock gate (Phase 4) ----------------
  function initUnlockScreen() {
    document.getElementById('unlock-question').textContent = CONFIG.unlock.question;
    const input = document.getElementById('unlock-input');
    const error = document.getElementById('unlock-error');
    input.value = '';
    error.textContent = '';

    function attempt() {
      const val = input.value.trim().toLowerCase();
      const ok = CONFIG.unlock.acceptedAnswers.some(a => val.includes(a.toLowerCase()) || a.toLowerCase().includes(val) && val.length > 2);
      if (ok && val.length > 0) {
        renderHub();
        showScreen('hub');
      } else {
        error.textContent = "Not quite — try again.";
      }
    }
    document.getElementById('unlock-submit').onclick = attempt;
    input.onkeydown = (e) => { if (e.key === 'Enter') attempt(); };
  }

  // ---------------- Landing (Phase 3) ----------------
  function initLanding() {
    const enterBtn = document.getElementById('enter-btn');
    const loadingText = document.getElementById('loading-text');
    const lines = ['initializing experience...', 'gathering memories...', 'almost there...'];

    enterBtn.addEventListener('click', () => {
      AudioSystem.primeOnFirstInteraction();
      enterBtn.classList.add('hidden');
      loadingText.classList.remove('hidden');
      let i = 0;
      const step = () => {
        if (i < lines.length) {
          loadingText.textContent = lines[i];
          i += 1;
          setTimeout(step, 550);
        } else {
          initUnlockScreen();
          showScreen('unlock');
        }
      };
      step();
    });
  }

  // ---------------- Boot ----------------
  document.addEventListener('DOMContentLoaded', () => {
    AudioSystem.init();
    MoonlightAtmosphere.init();
    initLanding();
  });
})();
