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
        document.querySelectorAll('.nav-group-header').forEach(header => {
            header.addEventListener('click', () => {
                const navItems = header.nextElementSibling;
                header.classList.toggle('expanded');
                if (navItems) {
                    navItems.style.display = header.classList.contains('expanded') ? 'block' : 'none';
                }
            });
        });

// ===========================
// MOBILE SIDEBAR TOGGLE
// ===========================
(() => {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (!toggle || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when a nav item is clicked (mobile UX)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 650) closeSidebar();
    });
  });

  // Close sidebar if window resizes above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 650) closeSidebar();
  });
})();