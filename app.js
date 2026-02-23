// ===========================
// SIDEBAR TOGGLE
// ===========================
document.querySelectorAll('.section-header, .nav-group-header').forEach(header => {
  header.addEventListener('click', () => {
    const parent = header.closest('.sidebar-section') || header.closest('.nav-group');
    parent.classList.toggle('collapsed');
  });
});

// ===========================
// NAVBAR SEARCH — CMD+K
// ===========================
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.navbar-search input').focus();
  }
});

// ===========================
// SIDEBAR ACTIVE ITEM
// ===========================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// ===========================
// PROGRESS RING ANIMATION
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const ring = document.querySelector('.ring-fill');
  if (!ring) return;

  const r = 45;
  const circumference = 2 * Math.PI * r;
  const progress = 50; // percent
  const offset = circumference - (progress / 100) * circumference;

  ring.style.strokeDasharray = `${circumference}`;
  ring.style.strokeDashoffset = circumference;

  setTimeout(() => {
    ring.style.strokeDashoffset = offset;
  }, 200);
});

// ===========================
// SIDEBAR TAB SWITCH
// ===========================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===========================
// SEARCH FUNCTIONALITY
// ===========================
const searchInputs = document.querySelectorAll('.input-wrapper input, .navbar-search input');

searchInputs.forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      console.log('Search:', input.value);
      // Hook into your search logic here
    }
  });
});