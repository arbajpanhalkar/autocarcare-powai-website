// ===== Business settings (edit here) =====
const WHATSAPP_NUMBER = '918108353342';

// ===== Services list (from Google Business profile) =====
const services = [
  { icon: 'bi-cpu', name: 'Engine Diagnostic', desc: 'Computer scanning to find engine faults and check-engine light problems quickly.' },
  { icon: 'bi-disc', name: 'Brake Service & Repair', desc: 'Brake pads, discs, drums and brake oil — inspected and repaired for safe stopping.' },
  { icon: 'bi-droplet-half', name: 'Oil Change', desc: 'Engine oil and oil filter change with quality oil to keep your engine healthy.' },
  { icon: 'bi-sliders', name: 'Steering & Suspension', desc: 'Fix noises, vibrations, shock absorbers, bushes and steering play.' },
  { icon: 'bi-circle', name: 'Tyres', desc: 'Tyre check, puncture repair, rotation and replacement advice.' },
  { icon: 'bi-wind', name: 'Air & Cabin Filter', desc: 'Air filter and cabin filter replacement for better mileage and clean air.' },
  { icon: 'bi-snow', name: 'Car AC Repair', desc: 'AC gas refilling, cooling problems, compressor and leak repair.' },
  { icon: 'bi-battery-charging', name: 'Battery', desc: 'Battery testing, jump start and new battery replacement.' },
  { icon: 'bi-lightning-charge', name: 'Electrical Repair', desc: 'Wiring, lights, starter, alternator, sensors and other electrical faults.' },
  { icon: 'bi-cloud-haze2', name: 'Exhaust', desc: 'Silencer, exhaust pipe leaks and smoke-related repairs.' },
  { icon: 'bi-gear-wide-connected', name: 'Transmission & Clutch', desc: 'Clutch plate, pressure plate, bearing and gearbox repair or overhaul.' },
  { icon: 'bi-wrench-adjustable', name: 'General Service', desc: 'Complete periodic service and inspection for all car makes and models.' }
];

// ===== Problem checker: symptom -> suggested service =====
const symptoms = [
  { label: 'Check-engine light on', service: 'Engine Diagnostic', tip: 'A scan will read the fault code and show exactly what is wrong.' },
  { label: 'Squeaking while braking', service: 'Brake Service & Repair', tip: 'Usually worn brake pads — best to get them checked soon.' },
  { label: 'AC not cooling', service: 'Car AC Repair', tip: 'Could be low gas, a leak or a compressor issue.' },
  { label: 'Car not starting', service: 'Battery', tip: 'Most often a weak battery or starter problem. Call us — open 24 hours.' },
  { label: 'Clutch slipping / hard gear', service: 'Transmission & Clutch', tip: 'Clutch plate or gearbox needs inspection before it gets worse.' },
  { label: 'Noise over bumps', service: 'Steering & Suspension', tip: 'Shock absorbers, links or bushes may be worn out.' },
  { label: 'Black smoke / loud silencer', service: 'Exhaust', tip: 'Exhaust leak or engine tuning issue — needs a quick check.' },
  { label: 'Lights / horn not working', service: 'Electrical Repair', tip: 'Fuse, wiring or relay fault — usually quick to fix.' },
  { label: 'Due for service', service: 'General Service', tip: 'Oil, filters and full inspection to keep the car healthy.' }
];

const brands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Renault', 'Skoda', 'Volkswagen', 'MG', 'Nissan'];

const $ = id => document.getElementById(id);

// Render service cards + booking dropdown
const grid = $('servicesGrid');
const select = $('bService');
services.forEach((s, i) => {
  grid.insertAdjacentHTML('beforeend', `
    <div class="col-sm-6 col-lg-4 col-xl-3 reveal">
      <div class="service-card">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <div class="icon"><i class="bi ${s.icon}"></i></div>
        <h5>${s.name}</h5>
        <p>${s.desc}</p>
        <a href="#booking" data-service="${s.name}">Book Now <i class="bi bi-arrow-right"></i></a>
      </div>
    </div>`);
  select.insertAdjacentHTML('beforeend', `<option>${s.name}</option>`);
});
select.insertAdjacentHTML('beforeend', '<option>Other / Not Sure</option>');

// "Book Now" pre-selects the service
document.addEventListener('click', e => {
  const link = e.target.closest('[data-service]');
  if (link) select.value = link.dataset.service;
});

// Brands marquee (list doubled for seamless loop)
$('brandsTrack').innerHTML = [...brands, ...brands].map(b => `<span>${b}</span>`).join('');

// Problem checker
const symBox = $('symptoms');
const result = $('checkerResult');
symptoms.forEach((s, i) => symBox.insertAdjacentHTML('beforeend', `<button type="button" class="symptom" data-i="${i}">${s.label}</button>`));
symBox.addEventListener('click', e => {
  const btn = e.target.closest('.symptom');
  if (!btn) return;
  symBox.querySelectorAll('.symptom').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const s = symptoms[btn.dataset.i];
  const icon = services.find(x => x.name === s.service).icon;
  result.innerHTML = `
    <i class="bi ${icon}"></i>
    <div class="flex-grow-1">
      <h6>Suggested: ${s.service}</h6>
      <p class="m-0 small">${s.tip}</p>
    </div>
    <a href="#booking" class="btn btn-accent btn-sm" data-service="${s.service}">Book</a>`;
  result.classList.remove('pop'); void result.offsetWidth; result.classList.add('pop');
  $('bMsg').value = s.label;
});

// Rotating hero word
const words = ['Engine', 'Clutch', 'AC', 'Brake', 'Battery', 'Electrical'];
let wi = 0;
const rot = $('rotator');
setInterval(() => {
  rot.classList.add('out');
  setTimeout(() => { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.classList.remove('out'); }, 350);
}, 2200);

// Reveal on scroll + counters
const animateCounter = el => {
  const to = +el.dataset.to; let n = 0;
  const step = Math.max(1, Math.ceil(to / 40));
  const t = setInterval(() => { n = Math.min(to, n + step); el.textContent = n; if (n >= to) clearInterval(t); }, 30);
};
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('.counter').forEach(animateCounter);
    io.unobserve(en.target);
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  document.querySelectorAll('.counter').forEach(c => c.textContent = c.dataset.to);
}

// Booking form -> WhatsApp
$('bDate').min = new Date().toISOString().split('T')[0];
$('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const phone = $('bPhone');
  phone.value = phone.value.replace(/\D/g, '');
  if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
  const v = id => $(id).value.trim();
  const lines = [
    '*New Service Request - Auto Car Care Powai*',
    `Name: ${v('bName')}`,
    `Mobile: ${v('bPhone')}`,
    v('bCar') && `Car: ${v('bCar')}`,
    `Service: ${v('bService')}`,
    v('bDate') && `Date: ${v('bDate')}`,
    v('bTime') && `Time: ${v('bTime')}`,
    v('bMsg') && `Problem: ${v('bMsg')}`
  ].filter(Boolean);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  form.reset();
  form.classList.remove('was-validated');
});

// Navbar, back-to-top, active link
const nav = $('mainNav');
const toTop = $('toTop');
const links = document.querySelectorAll('#navMenu .nav-link');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  toTop.classList.toggle('show', y > 600);
  links.forEach(l => {
    const sec = document.querySelector(l.getAttribute('href'));
    if (sec) l.classList.toggle('active', sec.offsetTop - 120 <= y && sec.offsetTop + sec.offsetHeight - 120 > y);
  });
});
document.querySelectorAll('#navMenu .nav-link, #navMenu .btn').forEach(l => l.addEventListener('click', () => {
  const menu = $('navMenu');
  if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
}));

// Preloader
window.addEventListener('load', () => setTimeout(() => $('preloader').classList.add('hide'), 300));
setTimeout(() => $('preloader').classList.add('hide'), 2500); // fallback

$('year').textContent = new Date().getFullYear();
