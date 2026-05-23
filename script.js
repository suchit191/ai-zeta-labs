const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
if (menuBtn && menu) menuBtn.addEventListener('click', () => menu.classList.toggle('show'));

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => menu && menu.classList.remove('show'));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 70));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, 22);
    countObserver.unobserve(el);
  });
}, { threshold: 0.4 });

counters.forEach(counter => countObserver.observe(counter));

// Green moving dot animation like the original Zeta AI Labs home section
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = 0;
  let height = 0;
  let animationId;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function createParticles() {
    const count = Math.max(95, Math.floor(width / 7));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() < 0.16 ? 5 + Math.random() * 10 : 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      alpha: 0.28 + Math.random() * 0.72,
      green: Math.random() > 0.32
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -30) p.x = width + 30;
      if (p.x > width + 30) p.x = -30;
      if (p.y < -30) p.y = height + 30;
      if (p.y > height + 30) p.y = -30;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
      if (p.green) {
        gradient.addColorStop(0, `rgba(0, 217, 155, ${p.alpha})`);
        gradient.addColorStop(1, 'rgba(0, 217, 155, 0)');
      } else {
        gradient.addColorStop(0, `rgba(0, 169, 255, ${p.alpha * 0.75})`);
        gradient.addColorStop(1, 'rgba(0, 169, 255, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else draw();
  });
}



// Large green scroll-reactive dots across the page, like the original website
const dotPositions = [
  { top: 18, left: 11, size: 'medium', speed: 0.18 },
  { top: 30, left: 28, size: 'large', speed: -0.14 },
  { top: 48, left: 58, size: 'medium', speed: 0.20 },
  { top: 68, left: 86, size: 'large', speed: -0.18 },
  { top: 82, left: 15, size: 'small', speed: 0.22 },
  { top: 24, left: 73, size: 'small', speed: -0.20 },
  { top: 57, left: 39, size: 'medium', speed: 0.12 },
  { top: 76, left: 66, size: 'small', speed: -0.16 }
];

const scrollDots = dotPositions.map(dot => {
  const el = document.createElement('span');
  el.className = `scroll-dot ${dot.size}`;
  el.style.top = `${dot.top}%`;
  el.style.left = `${dot.left}%`;
  document.body.appendChild(el);
  return { el, speed: dot.speed };
});

function moveScrollDots() {
  const y = window.scrollY || window.pageYOffset;
  document.body.style.setProperty('--mx', `${20 + Math.sin(y / 300) * 15}%`);
  document.body.style.setProperty('--my', `${30 + Math.cos(y / 300) * 15}%`);
  scrollDots.forEach((dot, index) => {
    const xWave = Math.sin((y / 180) + index) * 42;
    const yWave = Math.cos((y / 220) + index) * 36 + (y * dot.speed);
    dot.el.style.transform = `translate3d(${xWave}px, ${yWave}px, 0)`;
  });
}

window.addEventListener('scroll', moveScrollDots, { passive: true });
moveScrollDots();
